"use client";

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getFreshAdminIdToken } from '@/lib/firebase/client';
import { StatusBadge, type LeadStatus } from './StatusBadge';
import { StatusSelect } from './StatusSelect';

type LeadRow = {
  code: string;
  status: LeadStatus;
  status_updated_at?: string;
  gclid?: string | null;
  utms?: {
    utm_campaign?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
  };
  landingPage?: string;
  observacao?: string;
  createdAt?: string;
};

type LeadsTableProps = {
  leads: LeadRow[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const [items, setItems] = useState(leads);
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  async function getAdminToken() {
    const token = await getFreshAdminIdToken();
    if (!token) {
      throw new Error('Token de autenticação ausente');
    }
    return token;
  }

  async function handleStatusChange(code: string, nextStatus: LeadStatus, observacao?: string) {
    try {
      const response = await fetch(`/api/admin/lead/${code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAdminToken()}`,
        },
        body: JSON.stringify({
          status: nextStatus,
          observacao,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Erro ao atualizar status');
      }

      setItems((current) =>
        current.map((lead) =>
          lead.code === code
            ? {
                ...lead,
                status: nextStatus,
                observacao: observacao || lead.observacao,
                status_updated_at: payload.updated_at || new Date().toISOString(),
              }
            : lead
        )
      );

      if (nextStatus === 'fechou' && payload.conversion && !payload.conversion.ok) {
        toast.success('Lead fechado. Conversão pendente no Google Ads.');
      } else {
        toast.success('Status atualizado com sucesso');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao atualizar status');
    }
  }

  function openWhatsApp(lead: LeadRow) {
    const code = lead.code;
    const message = `🔎 Código de referência: ${code}`;
    const url = `https://wa.me/5585997314093?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function viewDetails(lead: LeadRow) {
    setSelectedLead(lead);
  }

  function formatLeadDetails(lead: LeadRow) {
    return [
      ['Data', lead.createdAt ? new Date(lead.createdAt).toLocaleString('pt-BR') : '-'],
      ['Código', lead.code || '-'],
      ['Status', lead.status || '-'],
      ['GCLID', lead.gclid || '-'],
      ['Campanha', lead.utms?.utm_campaign || '-'],
      ['Fonte', lead.utms?.utm_source || '-'],
      ['Meio', lead.utms?.utm_medium || '-'],
      ['Landing Page', lead.landingPage || '-'],
      ['Observação', lead.observacao || 'Sem observação'],
    ];
  }

  return (
    <>
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detalhes do lead</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{selectedLead.code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-2">
              {formatLeadDetails(selectedLead).map(([label, value]) => (
                <div key={String(label)} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                  <span className="min-w-[110px] text-xs font-semibold uppercase tracking-wide text-slate-500">{String(label)}</span>
                  <span className="break-all text-sm text-slate-700">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-0 table-auto divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:text-xs">Data</th>
                <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:text-xs">Código</th>
                <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:text-xs">Status</th>
                <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:text-xs">GCLID</th>
                <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:text-xs">Campanha</th>
                <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:px-4 sm:text-xs">Landing Page</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {visibleRows.map((lead) => (
                <>
                  <tr key={`${lead.code}-data`} className="align-top">
                    <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString('pt-BR') : '-'}
                    </td>
                    <td className="px-3 py-3 text-xs font-medium text-slate-800 sm:px-4 sm:text-sm">{lead.code}</td>
                    <td className="px-3 py-3 sm:px-4"><StatusBadge status={lead.status} /></td>
                    <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">{lead.gclid || '-'}</td>
                    <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">{lead.utms?.utm_campaign || '-'}</td>
                    <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">
                      <span className="block max-w-[180px] break-all">{lead.landingPage || '-'}</span>
                    </td>
                  </tr>

                  <tr key={`${lead.code}-actions`} className="bg-slate-50/70">
                    <td colSpan={6} className="px-3 py-3 sm:px-4">
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => openWhatsApp(lead)}
                            className="rounded-md bg-green-600 px-2 py-1.5 text-[10px] font-medium text-white transition hover:bg-green-700 sm:text-xs"
                          >
                            Abrir WhatsApp
                          </button>

                          <button
                            type="button"
                            onClick={() => viewDetails(lead)}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-medium text-slate-700 transition hover:bg-slate-100 sm:text-xs"
                          >
                            Ver detalhes
                          </button>
                        </div>

                        <div className="max-w-[420px]">
                          <StatusSelect
                            value={lead.status}
                            code={lead.code}
                            onChange={(nextStatus, observacao) => handleStatusChange(lead.code, nextStatus, observacao)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-3 sm:px-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-xs text-slate-600 sm:text-sm">Página {page} de {totalPages}</span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      </div>
    </>
  );
}
