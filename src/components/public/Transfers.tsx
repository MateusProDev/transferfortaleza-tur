"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Users, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import WhatsAppConversionLink from './WhatsAppConversionLink';
import { normalizeBrazilianPhone } from '@/lib/phone';
import type { Transfer } from '@/types';
import type { SitePageCopy } from '@/types';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from './EditableHeading';
import useResponsiveCarouselItemsPerPage from '@/hooks/useResponsiveCarouselItemsPerPage';

interface TransfersProps {
  transfers: Transfer[];
  whatsappNumber?: string;
  copy?: Partial<SitePageCopy>;
}

export default function Transfers({ transfers, whatsappNumber, copy }: TransfersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = useResponsiveCarouselItemsPerPage();

  const featuredTransfers = transfers.filter((transfer) => transfer.featuredOnHome);
  const displayTransfers = featuredTransfers.length > 0 ? featuredTransfers : transfers.slice(0, 6);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setIsPaused(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener?.('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener?.('change', updateReducedMotion);
  }, []);

  const totalGroups = Math.max(1, Math.ceil(displayTransfers.length / itemsPerPage));

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, totalGroups - 1));
  }, [totalGroups]);

  useEffect(() => {
    if (displayTransfers.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalGroups);
    }, 9000);

    return () => clearInterval(timer);
  }, [displayTransfers.length, itemsPerPage, isPaused, totalGroups]);

  if (!isCopyFieldEnabled(copy, "transfersSection")) return null;

  const goToSlide = (index: number) => {
    setCurrentIndex(((index % totalGroups) + totalGroups) % totalGroups);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  };

  const startIndex = currentIndex * itemsPerPage;
  const visibleTransfers = displayTransfers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
    <section id="transfers" className="py-14 bg-[#0F3A4A]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-left sm:text-center">
          {isCopyFieldEnabled(copy, "transfersTitle") && <EditableHeading level={getHeadingLevel(copy, 'transfersTitle', 'h2')} className="font-display text-3xl md:text-4xl text-white mb-4">
            {copy?.transfersTitle || "Serviços de Transfer"}
          </EditableHeading>}
          {isCopyFieldEnabled(copy, "transfersIntro") && <p className="max-w-2xl text-white/80 sm:mx-auto">
            {copy?.transfersIntro || "Conforto e segurança em seus deslocamentos com nossa frota moderna"}
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
            {visibleTransfers.map((transfer) => (
              <div key={transfer.id} className="relative group mx-auto w-full max-w-sm md:max-w-none">
                <article
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ease-out flex flex-col group"
                >
                <Link
                  href={`/pacote/${transfer.slug || transfer.id}`}
                  className="relative mb-4 block h-40 w-full"
                  aria-label={`Ver transfer: ${transfer.name}`}
                >
                  {transfer.imageUrl ? (
                    <Image
                      src={transfer.imageUrl}
                      alt={transfer.imageAlt || transfer.name}
                      fill
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) calc(50vw - 2rem), calc(100vw - 2rem)"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">{copy?.transfersImagePlaceholder || "Sem imagem"}</span>
                    </div>
                  )}
                </Link>

                {isCopyFieldEnabled(copy, "transferCardTitle") && <EditableHeading level={getHeadingLevel(copy, 'transferCardTitle', 'h3')}>
                  <Link
                    href={`/pacote/${transfer.slug || transfer.id}`}
                    className="block text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors"
                  >
                    {transfer.name}
                  </Link>
                </EditableHeading>}
                {isCopyFieldEnabled(copy, "transferCardDescription") && <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{transfer.description}</p>}

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Car size={16} />
                    <span>{transfer.vehicleType || copy?.transfersVehicleFallback || 'Consulte'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} ${copy?.transfersCapacitySuffix || "pessoas"}` : copy?.transfersCapacityFallback || 'Consulte'}</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link
                    href={`/pacote/${transfer.slug || transfer.id}`}
                    className="flex-1 text-center bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                  >
                    {copy?.transferDetailsButton || "Ver transfer"}
                  </Link>
                  <WhatsAppConversionLink
                    href={`https://wa.me/${normalizeBrazilianPhone(whatsappNumber || "5585997314093")}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o transfer: ${transfer.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                    aria-label={`Consultar ${transfer.name} pelo WhatsApp`}
                  >
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline">{copy?.transferWhatsappButton || "WhatsApp"}</span>
                    <span className="sm:hidden">{copy?.transferWhatsappButton || "WhatsApp"}</span>
                  </WhatsAppConversionLink>
                </div>
                </article>
              </div>
            ))}
            {displayTransfers.length > itemsPerPage && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white md:-left-4 md:h-12 md:w-12"
                  aria-label="Transfer anterior"
                >
                  <ChevronLeft size={20} className="md:h-6 md:w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white md:-right-4 md:h-12 md:w-12"
                  aria-label="Próximo transfer"
                >
                  <ChevronRight size={20} className="md:h-6 md:w-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {displayTransfers.length > itemsPerPage && (
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
            href="/transfer"
            className="inline-block bg-secondary-800 hover:bg-secondary-900 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            {copy?.transfersButton || "Ver Todos os Transfers"}
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
