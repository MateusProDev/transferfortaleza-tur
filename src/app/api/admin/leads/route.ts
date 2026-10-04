import { NextRequest } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const campaign = searchParams.get('campaign') || '';
    const code = searchParams.get('code') || '';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    const db = getAdminFirestore();
    if (!db) {
      return Response.json({ error: 'Firestore indisponível' }, { status: 500 });
    }

    const snapshot = await db.collection('leads_tracking').get();
    let leads = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    leads = leads.filter((lead: any) => {
      const normalizedStatus = lead.status || 'visitou';
      const matchesStatus = !status || normalizedStatus === status;
      const matchesCampaign = !campaign || (lead.utms?.utm_campaign || '').toLowerCase().includes(campaign.toLowerCase());
      const matchesCode = !code || String(lead.code || '').toLowerCase().includes(code.toLowerCase());

      const createdAtValue = lead.createdAt || lead.timestamp || lead.status_updated_at;
      const createdAt = createdAtValue ? new Date(createdAtValue) : null;

      let matchesDate = true;
      if (from && createdAt) {
        matchesDate = matchesDate && createdAt >= new Date(from);
      }
      if (to && createdAt) {
        matchesDate = matchesDate && createdAt <= new Date(`${to}T23:59:59.999Z`);
      }

      return matchesStatus && matchesCampaign && matchesCode && matchesDate;
    });

    leads.sort((a: any, b: any) => {
      const aTime = new Date(a.createdAt || a.timestamp || 0).getTime();
      const bTime = new Date(b.createdAt || b.timestamp || 0).getTime();
      return bTime - aTime;
    });

    const summary = {
      total: leads.length,
      visitou: leads.filter((lead: any) => (lead.status || 'visitou') === 'visitou').length,
      clicou_whatsapp: leads.filter((lead: any) => (lead.status || 'visitou') === 'clicou_whatsapp').length,
      enviou_mensagem: leads.filter((lead: any) => (lead.status || 'visitou') === 'enviou_mensagem').length,
      fechou: leads.filter((lead: any) => (lead.status || 'visitou') === 'fechou').length,
      nao_respondeu: leads.filter((lead: any) => (lead.status || 'visitou') === 'nao_respondeu').length,
      perdido: leads.filter((lead: any) => (lead.status || 'visitou') === 'perdido').length,
    };

    return Response.json({ leads, summary });
  } catch (error) {
    console.error('[api/admin/leads] error:', error);
    return Response.json({ error: 'Erro ao listar leads' }, { status: 500 });
  }
}
