"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { LeadsFilters } from '@/components/admin/LeadsFilters';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { getFreshAdminIdToken } from '@/lib/firebase/client';

type LeadStatus =
  | 'visitou'
  | 'clicou_whatsapp'
  | 'enviou_mensagem'
  | 'fechou'
  | 'nao_respondeu'
  | 'perdido';

type LeadRecord = {
  code: string;
  status: LeadStatus;
  gclid?: string | null;
  utms?: {
    utm_campaign?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
  };
  landingPage?: string;
  createdAt?: string;
  observacao?: string;
};

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [summary, setSummary] = useState<Record<string, number>>({
    total: 0,
    visitou: 0,
    clicou_whatsapp: 0,
    enviou_mensagem: 0,
    fechou: 0,
    nao_respondeu: 0,
    perdido: 0,
  });

  useEffect(() => {
    async function loadLeads() {
      try {
        const params = new URLSearchParams(searchParams.toString());
        const token = await getFreshAdminIdToken();

        if (!token) {
          setLeads([]);
          setSummary({
            total: 0,
            visitou: 0,
            clicou_whatsapp: 0,
            enviou_mensagem: 0,
            fechou: 0,
            nao_respondeu: 0,
            perdido: 0,
          });
          setLoading(false);
          window.location.href = '/admin/login?redirect=/admin/leads';
          return;
        }

        const response = await fetch(`/api/admin/leads?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os leads');
        }

        const payload = await response.json();
        setLeads(payload.leads || []);
        setSummary(payload.summary || {
          total: 0,
          visitou: 0,
          clicou_whatsapp: 0,
          enviou_mensagem: 0,
          fechou: 0,
          nao_respondeu: 0,
          perdido: 0,
        });
      } catch (error) {
        console.error('[admin/leads] error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [searchParams]);

  async function syncHistoricalLeads() {
    setSyncingSheets(true);
    try {
      const token = await getFreshAdminIdToken();
      if (!token) throw new Error('Sessão expirada');

      const response = await fetch('/api/admin/sync-sheets', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível sincronizar');
      }

      window.alert(
        `Sincronização concluída: ${payload.inserted} lead(s) inserido(s) de ${payload.found} encontrado(s).`
      );
    } catch (error) {
      console.error('[admin/leads] sync sheets error:', error);
      window.alert(error instanceof Error ? error.message : 'Erro ao sincronizar a planilha');
    } finally {
      setSyncingSheets(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-7">
        {[
          ['Total', summary.total],
          ['Visitou', summary.visitou],
          ['Clicou WhatsApp', summary.clicou_whatsapp],
          ['Enviou Mensagem', summary.enviou_mensagem],
          ['Fechou', summary.fechou],
          ['Não Respondeu', summary.nao_respondeu],
          ['Perdido', summary.perdido],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <p className="text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">{label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LeadsFilters />
          <button
            type="button"
            onClick={syncHistoricalLeads}
            disabled={syncingSheets}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
          >
            {syncingSheets ? 'Sincronizando...' : 'Sincronizar planilha'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Carregando leads...</p>
        ) : (
          <LeadsTable leads={leads} />
        )}
      </div>
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-600">Carregando leads...</div>}>
      <LeadsPageContent />
    </Suspense>
  );
}
