"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroProps {
  banners: Banner[];
}

export default function Hero({ banners }: HeroProps) {
  const availableBanners = banners.filter((banner) => banner?.imageUrl);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= availableBanners.length) {
      setCurrentIndex(0);
    }
  }, [availableBanners.length, currentIndex]);

  useEffect(() => {
    if (availableBanners.length < 2) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % availableBanners.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [availableBanners.length]);

  const safeBanner = availableBanners[currentIndex] || null;

  if (!safeBanner) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Passeios e Transfers em Fortaleza e Região</h1>
          <p className="text-xl md:text-2xl mb-8">Reserve experiências únicas com conforto, segurança e atendimento personalizado.</p>
        </div>
      </section>
    );
  }

  const currentBanner = safeBanner;
  const heroTitle = currentBanner.title?.trim() || 'Passeios e Transfers em Fortaleza e Região';

  return (
    <section className="relative h-[600px] overflow-hidden" aria-label="Banner principal">
      <div className="absolute inset-0">
        {currentBanner.imageUrl ? (
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.imageAlt || currentBanner.title || 'Passeios e Transfers em Fortaleza e Região'}
            width={1280}
            height={720}
            className="h-full w-full object-cover"
            sizes="100vw"
            priority
            quality={20}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/45" />
      </div>

      <div className="relative h-full flex items-center justify-center text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {currentBanner.subtitle || 'Reserve experiências únicas em Fortaleza e região.'}
          </p>
          <a
            href={currentBanner.buttonLink}
            target={/^https?:\/\//i.test(currentBanner.buttonLink) ? '_blank' : undefined}
            rel={/^https?:\/\//i.test(currentBanner.buttonLink) ? 'noopener noreferrer' : undefined}
            className="inline-block bg-primary-800 hover:bg-primary-900 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            aria-label={currentBanner.buttonText}
          >
            {currentBanner.buttonText}
          </a>
        </div>
      </div>

      {availableBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" aria-label="Selecionar banner">
          {availableBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/60'}`}
              aria-label={`Exibir banner ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
