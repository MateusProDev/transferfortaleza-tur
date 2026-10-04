export type LeadStatus =
  | 'visitou'
  | 'clicou_whatsapp'
  | 'enviou_mensagem'
  | 'fechou'
  | 'nao_respondeu'
  | 'perdido';

const STATUS_META: Record<LeadStatus, { label: string; className: string }> = {
  visitou: { label: 'Visitou', className: 'border-slate-200 bg-slate-100 text-slate-700' },
  clicou_whatsapp: { label: 'Clicou WhatsApp', className: 'border-blue-200 bg-blue-100 text-blue-700' },
  enviou_mensagem: { label: 'Enviou mensagem', className: 'border-amber-200 bg-amber-100 text-amber-700' },
  fechou: { label: 'Fechou', className: 'border-emerald-200 bg-emerald-100 text-emerald-700' },
  nao_respondeu: { label: 'Não respondeu', className: 'border-orange-200 bg-orange-100 text-orange-700' },
  perdido: { label: 'Perdido', className: 'border-red-200 bg-red-100 text-red-700' },
};

export function StatusBadge({ status }: { status: LeadStatus | string }) {
  const normalized = (status || 'visitou') as LeadStatus;
  const meta = STATUS_META[normalized] ?? STATUS_META.visitou;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}
