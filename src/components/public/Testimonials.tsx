"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  clientPhotoAlt: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || window.innerWidth < 768) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O Que Nossos Clientes Dizem
            </h2>
          </div>
          <p className="text-center text-gray-600">Nenhum depoimento disponível no momento.</p>
        </div>
      </section>
    );
  }

  const featuredTestimonial = testimonials[activeIndex];

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Histórias reais de experiências memoráveis
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div
              className="flex items-center justify-center mb-6"
              role="img"
              aria-label={`Avaliação do cliente: ${featuredTestimonial.rating} de 5 estrelas`}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  aria-hidden="true"
                  className={i < featuredTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>

            <blockquote className="text-center mb-8">
              <p className="text-xl text-gray-700 italic leading-relaxed whitespace-pre-line">
                &ldquo;{featuredTestimonial.text}&rdquo;
              </p>
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {featuredTestimonial.clientPhoto ? (
                  <Image
                    src={featuredTestimonial.clientPhoto}
                    alt={featuredTestimonial.clientPhotoAlt || featuredTestimonial.clientName}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Sem foto</span>
                  </div>
                )}
              </div>
              <div>
                <cite className="not-italic font-semibold text-gray-900">
                  {featuredTestimonial.clientName}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
