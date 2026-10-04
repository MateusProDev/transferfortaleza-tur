import { NextRequest } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { updateLeadStatus } from '@/lib/sheets/sync';
import { uploadConversion } from '@/lib/ads/conversion';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return Response.json({ error: 'Token ausente' }, { status: 401 });
    }

    const auth = getAdminAuth();
    if (!auth) {
      return Response.json({ error: 'Firebase Admin Auth indisponível' }, { status: 500 });
    }

    const decoded = await auth.verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase();

    if (!ADMIN_EMAILS.includes(email)) {
      return Response.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { code } = params;
    const body = await request.json();
    const status = body.status as string;
    const observacao = String(body.observacao || '');

    if (!code || !status) {
      return Response.json({ error: 'Código e status são obrigatórios' }, { status: 400 });
    }

    const db = getAdminFirestore();
    if (!db) {
      return Response.json({ error: 'Firestore indisponível' }, { status: 500 });
    }

    const ref = db.collection('leads_tracking').doc(code);
    const current = await ref.get();
    const previousStatus = current.exists ? current.data()?.status || 'visitou' : 'visitou';
    const updatedAt = new Date().toISOString();
    let conversion: Awaited<ReturnType<typeof uploadConversion>> | undefined;

    await ref.set(
      {
        ...(current.exists ? current.data() : {}),
        status,
        status_updated_at: updatedAt,
        observacao: observacao || current.data()?.observacao || '',
        updatedAt,
      },
      { merge: true }
    );

    if (status === 'enviou_mensagem' && !current.data()?.qualified_at) {
      await ref.set({ qualified_at: updatedAt }, { merge: true });
    }

    if (status === 'fechou' && !current.data()?.converted_at) {
      conversion = await uploadConversion({
        gclid: current.data()?.gclid || null,
        code,
        value: 0,
        currency: 'BRL',
      });

      if (conversion.ok) {
        await ref.set({ converted_at: updatedAt }, { merge: true });
      }
    }

    await updateLeadStatus(code, status, updatedAt, observacao || '');

    return Response.json({
      ok: true,
      status,
      previousStatus,
      updated_at: updatedAt,
      conversion: conversion
        ? { ok: conversion.ok, reason: conversion.reason }
        : undefined,
    });
  } catch (error) {
    console.error('[api/admin/lead] error:', error);
    return Response.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
  }
}
