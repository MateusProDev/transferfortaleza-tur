"use client";

import { useRouter, useSearchParams } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'visitou', label: 'Visitou' },
  { value: 'clicou_whatsapp', label: 'Clicou WhatsApp' },
  { value: 'enviou_mensagem', label: 'Enviou mensagem' },
  { value: 'fechou', label: 'Fechou' },
  { value: 'nao_respondeu', label: 'Não respondeu' },
  { value: 'perdido', label: 'Perdido' },
];

export function LeadsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get('status') || '';
  const campaign = searchParams.get('campaign') || '';
  const code = searchParams.get('code') || '';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    router.replace(`/admin/leads?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <label className="text-sm text-slate-600">
        <span className="mb-1 block">Status</span>
        <select
          value={status}
          onChange={(event) => updateFilter('status', event.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-slate-600">
        <span className="mb-1 block">Código</span>
        <input
          value={code}
          onChange={(event) => updateFilter('code', event.target.value)}
          placeholder="Pesquisar código"
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-slate-600">
        <span className="mb-1 block">Campanha</span>
        <input
          value={campaign}
          onChange={(event) => updateFilter('campaign', event.target.value)}
          placeholder="utm_campaign"
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-slate-600">
        <span className="mb-1 block">Data inicial</span>
        <input
          type="date"
          value={from}
          onChange={(event) => updateFilter('from', event.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-slate-600">
        <span className="mb-1 block">Data final</span>
        <input
          type="date"
          value={to}
          onChange={(event) => updateFilter('to', event.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}
