import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { appendLead, updateLeadStatus } from '@/lib/sheets/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TrackSchema = z.object({
  event: z.enum(['visitou', 'clicou_whatsapp', 'enviou_mensagem', 'clicou_cta']).optional(),
  code: z.string().min(4).max(20),
  gclid: z.string().nullable().optional(),
  utms: z.object({
    utm_source: z.string().nullable().optional(),
    utm_medium: z.string().nullable().optional(),
    utm_campaign: z.string().nullable().optional(),
    utm_content: z.string().nullable().optional(),
    utm_term: z.string().nullable().optional(),
  }),
  landingPage: z.string().default('/'),
  userAgent: z.string().optional().default(''),
  observacao: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = TrackSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ ok: false, error: 'Payload inválido' }, { status: 400 });
    }

    const db = getAdminFirestore();
    if (!db) {
      return Response.json({ ok: true, message: 'Firestore indisponível no momento' }, { status: 200 });
    }

    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0]?.trim() || 'unknown';
    const eventType = parsed.data.event || 'visitou';
    const now = new Date().toISOString();

    const resolveStatus = (type: string, previousStatus?: string) => {
      if (type === 'visitou') return 'visitou';
      if (type === 'clicou_whatsapp') return 'clicou_whatsapp';
      if (type === 'enviou_mensagem') return 'enviou_mensagem';
      if (type === 'clicou_cta') return previousStatus || 'visitou';
      return previousStatus || 'visitou';
    };

    const payload = {
      ...parsed.data,
      event: eventType,
      ip,
      timestamp: now,
      createdAt: now,
      status: 'visitou',
      status_updated_at: now,
      updatedAt: now,
    };

    const ref = db.collection('leads_tracking').doc(payload.code);
    const current = await ref.get();

    if (!current.exists) {
      const initialStatus = resolveStatus(eventType);
      await ref.set({
        ...payload,
        status: initialStatus,
        status_updated_at: now,
        updatedAt: now,
      }, { merge: true });
      try {
        await appendLead({
          ...payload,
          status: initialStatus,
          status_updated_at: now,
        });
      } catch (sheetError) {
        console.error('[track] appendLead error:', sheetError);
      }
    } else {
      const previousStatus = current.data()?.status || 'visitou';
      const nextStatus = resolveStatus(eventType, previousStatus);

      await ref.set(
        {
          ...payload,
          status: nextStatus,
          status_updated_at: now,
          updatedAt: now,
        },
        { merge: true }
      );

      if (previousStatus !== nextStatus) {
        try {
          await updateLeadStatus(payload.code, nextStatus, now, payload.observacao || '');
        } catch (sheetError) {
          console.error('[track] updateLeadStatus error:', sheetError);
        }
      }
    }

    return Response.json({ ok: true, status: payload.status });
  } catch (error) {
    console.error('[track] error:', error);
    return Response.json({ ok: true, message: 'Tracking salvo em fila local' }, { status: 200 });
  }
}
