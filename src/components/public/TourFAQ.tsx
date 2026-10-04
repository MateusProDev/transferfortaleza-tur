"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TourFAQ as TourFAQItem } from '@/types';

export const DEFAULT_TOUR_FAQS: TourFAQItem[] = [
  {
    question: "Como funciona o parcelamento?",
    answer: "Oferecemos parcelamento em até 12x no cartão de crédito. Para pagamentos à vista, oferecemos desconto de 5%. Entre em contato para conhecer as condições especiais.",
  },
  {
    question: "Posso remarcar o passeio?",
    answer: "Sim! Você pode remarcar seu passeio até 48 horas antes da data prevista, sem custo adicional, sujeito à disponibilidade. Remarcações com menos de 48h podem ter taxa de alteração.",
  },
  {
    question: "O seguro viagem está incluído?",
    answer: "Todos os nossos passeios incluem seguro básico de acidentes pessoais. Para viagens internacionais ou passeios específicos, oferecemos seguro viagem completo com cobertura médica e cancelamento.",
  },
  {
    question: "Qual é a política de cancelamento?",
    answer: "Cancelamento até 7 dias antes: reembolso integral. De 3 a 7 dias: 50% de reembolso. Menos de 3 dias: sem reembolso. Em casos de força maior, avaliamos cada situação individualmente.",
  },
  {
    question: "O passeio inclui alimentação?",
    answer: "Depende do passeio. Alguns incluem almoço ou lanches, conforme descrito na seção 'O que está incluído'. Recomendamos verificar os detalhes específicos de cada roteiro.",
  },
];

interface TourFAQProps {
  faqs?: TourFAQItem[];
}

export default function TourFAQ({ faqs }: TourFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqList = faqs?.length ? faqs : DEFAULT_TOUR_FAQS;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Perguntas Frequentes
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqList.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-blue-600 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="p-5 bg-white border-t border-gray-200"
                  role="region"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
