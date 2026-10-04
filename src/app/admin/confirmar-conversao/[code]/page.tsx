"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { googleAdsConversion } from '@/lib/google-ads';

export default function ConfirmarConversaoPage() {
  const params = useParams<{ code: string }>();
  const code = params?.code || '';
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    async function runConversion() {
      try {
        if (typeof window === 'undefined') return;

        const sendTo = `${googleAdsConversion.id}/${googleAdsConversion.label}`;

        window.gtag?.('event', 'conversion', {
          send_to: sendTo,
          transaction_id: code,
          value: 0,
          currency: 'BRL',
        });

        setStatus('ok');
      } catch (error) {
        console.error('[admin/confirmar-conversao] error:', error);
        setStatus('error');
      }
    }

    runConversion();
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {status === 'loading' && <p className="text-slate-700">Enviando conversão...</p>}
        {status === 'ok' && <p className="text-emerald-700">Conversão enviada com sucesso.</p>}
        {status === 'error' && <p className="text-red-700">Não foi possível enviar a conversão.</p>}
      </div>
    </div>
  );
}
