"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, ChevronLeft, ChevronRight, MapPin, MessageCircle } from 'lucide-react';
import { metaPixelEvents } from '@/utils/metaPixel';
import WhatsAppConversionLink from './WhatsAppConversionLink';
import { normalizeBrazilianPhone } from '@/lib/phone';
import useResponsiveCarouselItemsPerPage from '@/hooks/useResponsiveCarouselItemsPerPage';
import { ProductJsonLd } from '@/components/seo/JsonLd';
import { BRAND_URL } from '@/lib/brand';
import type { SitePageCopy } from '@/types';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from './EditableHeading';

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
  whatsappNumber?: string;
  copy?: Partial<SitePageCopy>;
}

export default function Tours({ tours, whatsappNumber, copy }: ToursProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = useResponsiveCarouselItemsPerPage();

  const featuredTours = tours
    .filter((tour) => tour.featured)
    .sort((first, second) => (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER));
  const featuredTourIds = new Set(featuredTours.map((tour) => tour.id));
  const displayTours = [
    ...featuredTours,
    ...tours.filter((tour) => !featuredTourIds.has(tour.id)),
  ];

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
    setCurrentIndex((index) => Math.min(index, totalGroups - 1));
  }, [totalGroups]);

  useEffect(() => {
    if (displayTours.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalGroups);
    }, 9000);

    return () => clearInterval(timer);
  }, [displayTours.length, itemsPerPage, isPaused, totalGroups]);

  if (!isCopyFieldEnabled(copy, "toursSection")) return null;

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
    : displayTours.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage);

  return (
    <section id="tours" className="py-14 bg-[#0F3A4A]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-left sm:text-center">
          {isCopyFieldEnabled(copy, "destinationsBadge") && <p className="mb-3 inline-flex items-center gap-2 font-semibold uppercase tracking-wide text-cyan-200">
            <MapPin size={18} aria-hidden="true" />
            {copy?.destinationsBadge || "Destinos em Destaque"}
          </p>}
          {isCopyFieldEnabled(copy, "toursSectionTitle") && <EditableHeading level={getHeadingLevel(copy, 'toursSectionTitle', 'h2')} className="font-display text-3xl md:text-4xl text-white mb-4">
            {copy?.toursSectionTitle || "Transfers e Passeios mais procurados"}
          </EditableHeading>}
          {isCopyFieldEnabled(copy, "toursSectionIntro") && <p className="max-w-3xl text-white/80 sm:mx-auto">
            {copy?.toursSectionIntro || "Transfers e Passeios saindo de Fortaleza exclusivos e organizados por categoria para transformar sua viagem em uma experiência única."}
          </p>}
        </div>

        <div className="mb-8 text-left sm:text-center">
          {isCopyFieldEnabled(copy, "toursTitle") && <EditableHeading level={getHeadingLevel(copy, 'toursTitle', 'h3')} className="font-display mb-3 text-2xl text-white md:text-3xl">
            {copy?.toursTitle || "Nossos Passeios"}
          </EditableHeading>}
          {isCopyFieldEnabled(copy, "toursIntro") && <p className="max-w-2xl text-white/80 sm:mx-auto">
            {copy?.toursIntro || "Descubra experiências únicas e memoráveis com nossos passeios cuidadosamente selecionados"}
          </p>}
        </div>

        <div className="relative">
          {/* Carousel */}
          <div
            className="relative grid grid-cols-1 gap-6 px-2 transition-all duration-300 ease-out md:grid-cols-2 md:px-0 lg:grid-cols-3 lg:gap-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onTouchCancel={() => setIsPaused(false)}
          >
            {visibleTours.map((tour, index) => (
              <React.Fragment key={`${tour.id}-${index}`}>
                {visibleTours.findIndex((visibleTour) => visibleTour.id === tour.id) === index && tour.mainImageUrl && tour.price > 0 && (
                  <ProductJsonLd
                    name={tour.name}
                    description={tour.description}
                    image={tour.mainImageUrl}
                    price={tour.price}
                    url={`${BRAND_URL}/pacote/${tour.slug || tour.id}`}
                  />
                )}
                <div className="relative group mx-auto w-full max-w-sm">
                  <article
                    className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-out flex flex-col group"
                  >
                <Link
                  href={`/pacote/${tour.slug || tour.id}`}
                  className="relative block aspect-square w-full overflow-hidden"
                  onClick={() => handleTourClick(tour.name)}
                  aria-label={`Ver passeio: ${tour.name}`}
                >
                  {tour.mainImageUrl ? (
                    <Image
                      src={tour.mainImageUrl}
                      alt={tour.mainImageAlt || tour.name}
                      fill
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, calc(100vw - 4rem)"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">{copy?.toursImagePlaceholder || "Sem imagem"}</span>
                    </div>
                  )}
                  {tour.featured && (
                    <span className="absolute top-4 right-4 bg-primary-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {copy?.tourFeaturedBadge || "Destaque"}
                    </span>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  {isCopyFieldEnabled(copy, "tourCardTitle") && <EditableHeading level={getHeadingLevel(copy, 'tourCardTitle', 'h4')}>
                    <Link
                      href={`/pacote/${tour.slug || tour.id}`}
                      className="mb-2 block min-h-14 line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors"
                      onClick={() => handleTourClick(tour.name)}
                    >
                      {tour.name}
                    </Link>
                  </EditableHeading>}
                  {isCopyFieldEnabled(copy, "tourCardDescription") && <p className="mb-4 min-h-12 line-clamp-2 flex-1 text-gray-600">{tour.description}</p>}

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{tour.duration || copy?.toursDurationFallback || 'Consulte'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{copy?.toursGroupLabel || "Gr pequenos"}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
                    <WhatsAppConversionLink
                      href={`https://wa.me/${normalizeBrazilianPhone(whatsappNumber || "5585997314093")}?text=${encodeURIComponent(`Olá! Gostaria de reservar o passeio: ${tour.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 flex-1 items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap text-xs sm:text-sm"
                      aria-label={`Reservar ${tour.name} pelo WhatsApp`}
                    >
                      <MessageCircle size={18} />
                      <span className="whitespace-nowrap">{copy?.tourReserveButton || "Reservar pelo WhatsApp"}</span>
                    </WhatsAppConversionLink>
                    <Link
                      href={`/pacote/${tour.slug || tour.id}`}
                      className="flex-shrink-0 text-center bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                      onClick={() => handleTourClick(tour.name)}
                    >
                      {copy?.tourDetailsButton || "Ver passeio"}
                    </Link>
                  </div>
                </div>
                  </article>
                </div>
              </React.Fragment>
            ))}
            {displayTours.length > itemsPerPage && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white md:-left-4 md:h-12 md:w-12"
                  aria-label="Passeio anterior"
                >
                  <ChevronLeft size={20} className="md:h-6 md:w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white md:-right-4 md:h-12 md:w-12"
                  aria-label="Próximo passeio"
                >
                  <ChevronRight size={20} className="md:h-6 md:w-6" />
                </button>
              </>
            )}
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
            {copy?.toursButton || "Ver Todos os Passeios"}
          </Link>
        </div>

      </div>
    </section>
  );
}
