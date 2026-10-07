import { Shield, CreditCard, HeadphonesIcon, Building2 } from 'lucide-react';
import type { SitePageCopy } from '@/types';
import EditableHeading, { getHeadingLevel } from './EditableHeading';

export default function TourTrustBadges({ copy }: { copy?: Partial<SitePageCopy> }) {
  const badges = [
    {
      icon: Shield,
      title: copy?.trust1Title || "Garantia de Satisfação",
      description: copy?.trust1Description || "Se não gostar, devolvemos seu dinheiro",
    },
    {
      icon: CreditCard,
      title: copy?.trust2Title || "Pagamento Seguro",
      description: copy?.trust2Description || "Ambiente criptografado e protegido",
    },
    {
      icon: HeadphonesIcon,
      title: copy?.trust3Title || "Suporte 24h",
      description: copy?.trust3Description || "Atendimento via WhatsApp a qualquer hora",
    },
    {
      icon: Building2,
      title: copy?.trust4Title || "Empresa CNPJ Ativo",
      description: copy?.trust4Description || "Turismo legal e confiável",
    },
  ];

  return (
    <section className="bg-gray-50 py-8 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <EditableHeading level={getHeadingLevel(copy, `trust${index + 1}Title`, "h3")} className="font-semibold text-gray-900 text-sm mb-1">
                  {badge.title}
                </EditableHeading>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
