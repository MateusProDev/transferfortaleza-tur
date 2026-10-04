import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const token = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_LEAD_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return Response.json({ error: 'Firebase Admin não inicializado' }, { status: 500 });
  }

  const doc = await db.collection('leads_tracking').doc(params.code).get();

  if (!doc.exists) {
    return Response.json({ error: 'Lead não encontrado' }, { status: 404 });
  }

  return Response.json({ ok: true, lead: doc.data() });
}
