import { Shield, CreditCard, HeadphonesIcon, Building2 } from 'lucide-react';

export default function TourTrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Garantia de Satisfação",
      description: "Se não gostar, devolvemos seu dinheiro",
    },
    {
      icon: CreditCard,
      title: "Pagamento Seguro",
      description: "Ambiente criptografado e protegido",
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte 24h",
      description: "Atendimento via WhatsApp a qualquer hora",
    },
    {
      icon: Building2,
      title: "Empresa CNPJ Ativo",
      description: "Turismo legal e confiável",
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
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
