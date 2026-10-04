"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { metaPixelEvents } from '@/utils/metaPixel';
import WhatsAppConversionLink from './WhatsAppConversionLink';
import OtherToursCarousel from './OtherToursCarousel';
import { ProductJsonLd } from '@/components/seo/JsonLd';

interface Tour {
  id: string;
  order?: number;
  name: string;
  description: string;
  mainImageUrl: string;
  mainImageAlt: string;
  price: number;
  duration: string;
  featured: boolean;
  slug?: string;
}

interface ToursProps {
  tours: Tour[];
}

export default function Tours({ tours }: ToursProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3;

  const featuredTours = tours
    .filter((tour) => tour.featured)
    .sort((first, second) => (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER));
  const displayTours = featuredTours.length > 0 ? featuredTours : tours.slice(0, 6);
  const otherTours = featuredTours.length > 0
    ? tours.filter((tour) => !featuredTours.some((featuredTour) => featuredTour.id === tour.id))
    : tours.slice(6);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setIsPaused(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener?.('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener?.('change', updateReducedMotion);
  }, []);

  const handleTourClick = (tourName: string) => {
    metaPixelEvents.customEvent('ViewTourList', {
      content_name: tourName,
      content_category: 'Tour'
    });
  };

  const totalGroups = Math.max(1, Math.ceil(displayTours.length / itemsPerPage));

  useEffect(() => {
    if (displayTours.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalGroups);
    }, 9000);

    return () => clearInterval(timer);
  }, [displayTours.length, itemsPerPage, isPaused, totalGroups]);

  const goToSlide = (index: number) => {
    setCurrentIndex(((index % totalGroups) + totalGroups) % totalGroups);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  };

  const visibleTours = displayTours.length === 0
    ? []
    : Array.from({ length: itemsPerPage }, (_, index) => {
        const itemIndex = (currentIndex * itemsPerPage + index) % displayTours.length;
        return displayTours[itemIndex];
      });

  return (
    <section id="tours" className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Passeios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra experiências únicas e memoráveis com nossos passeios cuidadosamente selecionados
          </p>
        </div>

        <div className="relative">
          {/* Carousel */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-2 md:px-0 transition-all duration-300 ease-out"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
          >
            {visibleTours.map((tour) => (
              <React.Fragment key={tour.id}>
                {tour.mainImageUrl && tour.price > 0 && (
                  <ProductJsonLd
                    name={tour.name}
                    description={tour.description}
                    image={tour.mainImageUrl}
                    price={tour.price}
                    url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://passeiolegal.com'}/passeios/${tour.slug || tour.id}`}
                  />
                )}
                <div className="relative group">
                  {displayTours.length > itemsPerPage && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                        aria-label={`Passeio anterior: ${tour.name}`}
                      >
                        <ChevronLeft size={20} className="md:w-6 md:h-6" />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                        aria-label={`Próximo passeio: ${tour.name}`}
                      >
                        <ChevronRight size={20} className="md:w-6 md:h-6" />
                      </button>
                    </>
                  )}
                  <article
                    className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-out flex flex-col group"
                  >
                <div className="relative aspect-square w-full overflow-hidden">
                  {tour.mainImageUrl ? (
                    <Image
                      src={tour.mainImageUrl}
                      alt={tour.mainImageAlt || tour.name}
                      fill
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) calc(50vw - 2rem), calc(100vw - 4rem)"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  {tour.featured && (
                    <span className="absolute top-4 right-4 bg-primary-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destaque
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3>
                    <Link
                      href={`/passeios/${tour.slug || tour.id}`}
                      className="block text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors"
                      onClick={() => handleTourClick(tour.name)}
                    >
                      {tour.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{tour.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{tour.duration || 'Consulte'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>Gr pequenos</span>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
                    <WhatsAppConversionLink
                      href={`https://wa.me/5585997314093?text=${encodeURIComponent(`Olá! Gostaria de reservar o passeio: ${tour.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 flex-1 items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm"
                      aria-label={`Reservar ${tour.name} pelo WhatsApp`}
                    >
                      <MessageCircle size={18} />
                      <span className="whitespace-nowrap">Reservar pelo WhatsApp</span>
                    </WhatsAppConversionLink>
                    <Link
                      href={`/passeios/${tour.slug || tour.id}`}
                      className="flex-shrink-0 text-center bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                      onClick={() => handleTourClick(tour.name)}
                    >
                      Ver passeio
                    </Link>
                  </div>
                </div>
                  </article>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Dots */}
          {displayTours.length > itemsPerPage && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalGroups }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label={`Ir para grupo ${index + 1}`}
                >
                  <span className={`h-3 w-3 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/passeios"
            className="inline-block bg-secondary-800 hover:bg-secondary-900 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Ver Todos os Passeios
          </Link>
        </div>

        {otherTours.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-14">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mais Passeios
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore outros roteiros para encontrar a experiência ideal para sua viagem
              </p>
            </div>
            <OtherToursCarousel tours={otherTours} />
          </div>
        )}
      </div>
    </section>
  );
}
