"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { shouldOptimizeImage } from "@/lib/image-optimization";
import type { GoogleReviewsContent as GoogleReviewsContentType, SitePageCopy } from "@/types";

interface GoogleReviewsProps {
  content: GoogleReviewsContentType | null;
  copy?: Partial<SitePageCopy>;
}

export default function GoogleReviews({ content, copy }: GoogleReviewsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviews = content?.reviews ?? [];

  useEffect(() => {
    if (!content?.active || !content.autoplay || reviews.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % reviews.length);
    }, Math.max(1000, content.autoplayDelay));

    return () => window.clearInterval(interval);
  }, [content?.active, content?.autoplay, content?.autoplayDelay, reviews.length]);

  if (!content?.active || reviews.length === 0) return null;

  const review = reviews[activeIndex];
  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + reviews.length) % reviews.length);
  };

  return (
    <section className="bg-white py-14" aria-label="Avaliações do Google">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {content.badge && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-700">
              {content.badge}
            </p>
          )}
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {content.title || "Avaliações no Google"}
          </h2>
          {content.subtitle && <p className="mb-8 text-gray-600">{content.subtitle}</p>}

          <article className="rounded-xl bg-gray-50 p-8 shadow-sm">
            <div className="mb-5 flex justify-center" aria-label={`${review.rating} de 5 estrelas`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  aria-hidden="true"
                  size={20}
                  className={index < review.rating ? "fill-current text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <blockquote className="mb-6 min-h-[9.25rem] line-clamp-5 text-lg leading-relaxed text-gray-700">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <div className="flex min-h-11 items-center justify-center gap-3">
              {review.photo && (
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={review.photo}
                    alt={review.photoAlt || review.name}
                    fill
                    unoptimized={!shouldOptimizeImage(review.photo)}
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-gray-900">{review.name}</p>
                {review.date && <p className="text-sm text-gray-500">{review.date}</p>}
              </div>
            </div>
          </article>

          {reviews.length > 1 && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Avaliação anterior"
                className="rounded-full border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-500" aria-live="polite">
                {activeIndex + 1} / {reviews.length}
              </span>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Próxima avaliação"
                className="rounded-full border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {content.googleUrl && (
            <a
              href={content.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-semibold text-primary-800 hover:text-primary-950"
            >
              {copy?.googleReviewsLinkText || "Ver avaliações no Google"}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
