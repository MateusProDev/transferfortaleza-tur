"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Users, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import WhatsAppConversionLink from './WhatsAppConversionLink';
import RecommendedTransfers from './RecommendedTransfers';
import type { Transfer } from '@/types';

interface TransfersProps {
  transfers: Transfer[];
}

export default function Transfers({ transfers }: TransfersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3;

  const featuredTransfers = transfers.filter((transfer) => transfer.featuredOnHome);
  const displayTransfers = featuredTransfers.length > 0 ? featuredTransfers : transfers.slice(0, 6);
  const otherTransfers = featuredTransfers.length > 0
    ? transfers.filter((transfer) => !transfer.featuredOnHome)
    : transfers.slice(6);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setIsPaused(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener?.('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener?.('change', updateReducedMotion);
  }, []);

  const totalGroups = Math.max(1, Math.ceil(displayTransfers.length / itemsPerPage));

  useEffect(() => {
    if (displayTransfers.length <= itemsPerPage || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalGroups);
    }, 9000);

    return () => clearInterval(timer);
  }, [displayTransfers.length, itemsPerPage, isPaused, totalGroups]);

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
    <section id="transfers" className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Serviços de Transfer
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conforto e segurança em seus deslocamentos com nossa frota moderna
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
            {visibleTransfers.map((transfer) => (
              <div key={transfer.id} className="relative group">
                {displayTransfers.length > itemsPerPage && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                      aria-label={`Transfer anterior: ${transfer.name}`}
                    >
                      <ChevronLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg transition hover:bg-white"
                      aria-label={`Próximo transfer: ${transfer.name}`}
                    >
                      <ChevronRight size={20} className="md:w-6 md:h-6" />
                    </button>
                  </>
                )}
                <article
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ease-out flex flex-col group"
                >
                <div className="relative h-40 mb-4 w-full">
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
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>

                <h3>
                  <Link
                    href={`/transfer/${transfer.slug || transfer.id}`}
                    className="block text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors"
                  >
                    {transfer.name}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{transfer.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Car size={16} />
                    <span>{transfer.vehicleType || 'Consulte'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link
                    href={`/transfer/${transfer.slug || transfer.id}`}
                    className="flex-1 text-center bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                  >
                    Ver transfer
                  </Link>
                  <WhatsAppConversionLink
                    href={`https://wa.me/5585997314093?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o transfer: ${transfer.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                    aria-label={`Consultar ${transfer.name} pelo WhatsApp`}
                  >
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">WhatsApp</span>
                  </WhatsAppConversionLink>
                </div>
                </article>
              </div>
            ))}
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
            Ver Todos os Transfers
          </Link>
        </div>
      </div>
    </section>
    {otherTransfers.length > 0 && (
      <RecommendedTransfers transfers={otherTransfers} />
    )}
    </>
  );
}
