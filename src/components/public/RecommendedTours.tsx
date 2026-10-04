import Link from 'next/link';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { Tour } from '@/types';

interface RecommendedToursProps {
  tours: Tour[];
}

export default function RecommendedTours({ tours }: RecommendedToursProps) {
  if (!tours || tours.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Quem viu este passeio também gostou
            </h2>
            <p className="text-gray-600">
              Descubra mais experiências incríveis em Fortaleza e região
            </p>
          </div>
          <Link
            href="/passeios"
            className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Ver todos
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              href={`/passeios/${tour.slug || tour.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Imagem */}
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={tour.mainImageUrl}
                  alt={`${tour.name} - Passeio em Fortaleza`}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {tour.featured && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star size={12} />
                    Destaque
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {tour.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock size={16} />
                  <span>{tour.duration || 'Consulte'}</span>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
                    Ver detalhes
                  </span>
                  <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/passeios"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Ver todos os passeios
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
