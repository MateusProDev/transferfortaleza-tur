"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function TesteGclidContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('lead_tracking');
    if (!stored) {
      setCode('');
      return;
    }

    try {
      const parsed = JSON.parse(stored) as { code?: string };
      setCode(parsed.code || '');
    } catch {
      setCode('');
    }
  }, [searchParams]);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold text-slate-900">Teste de GCLID</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-700">
          URL atual: <strong>{typeof window !== 'undefined' ? window.location.href : ''}</strong>
        </p>
        <p className="mt-4 text-slate-700">
          gclid: <strong>{searchParams.get('gclid') || 'nenhum'}</strong>
        </p>
        <p className="mt-2 text-slate-700">
          utm_source: <strong>{searchParams.get('utm_source') || 'nenhuma'}</strong>
        </p>

        <p className="mt-6 text-2xl font-black text-[#0b5d3a]">
          Código: {code || 'Ainda não gerado'}
        </p>
      </div>
    </main>
  );
}

export default function TesteGclidPage() {
  return (
    <Suspense fallback={<main className="p-8 text-slate-700">Carregando...</main>}>
      <TesteGclidContent />
    </Suspense>
  );
}
