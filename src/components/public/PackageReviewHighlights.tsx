import Image from "next/image";
import { Star } from "lucide-react";
import { shouldOptimizeImage } from "@/lib/image-optimization";
import type { GoogleReviewsContent } from "@/types";

interface PackageReviewHighlightsProps {
  content: GoogleReviewsContent | null;
}

const reviewImages = [
  {
    source: "/trip-avaliacoes-google.jpg",
    alt: "Selo TripAdvisor Travellers’ Choice 2026 da Transfer Fortaleza Tur",
    key: "tripAdvisor" as const,
  },
  {
    source: "/avaliacoes-google.jpg",
    alt: "Classificação excelente da Transfer Fortaleza Tur com mais de 260 avaliações no Google",
    key: "googleReviews" as const,
  },
];

export default function PackageReviewHighlights({ content }: PackageReviewHighlightsProps) {
  const images = reviewImages.map(({ source, alt, key }) => ({
    source: (key === "tripAdvisor" ? content?.tripAdvisorImage : content?.googleReviewsImage) || source,
    alt: (key === "tripAdvisor" ? content?.tripAdvisorImageAlt : content?.googleReviewsImageAlt) || alt,
  }));

  return (
    <section className="border-t border-gray-200 bg-white py-10 sm:py-14" aria-labelledby="package-reviews-title">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-700">
            {content?.badge || "A confiança de quem viaja com a gente"}
          </p>
          <h2 id="package-reviews-title" className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {content?.title || "Excelência reconhecida pelos nossos clientes"}
          </h2>
          <div className="mt-3 flex items-center justify-center gap-1" aria-label="5 estrelas">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} aria-hidden="true" className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          {content?.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              {content.subtitle}
            </p>
          )}
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-5 sm:grid-cols-2 sm:gap-7">
          {images.map(({ source, alt }, index) => {
            const image = (
              <div className="relative mx-auto aspect-[16/9] w-full max-w-xl overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                <Image
                  src={source}
                  alt={alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  unoptimized={!shouldOptimizeImage(source)}
                  className="object-contain"
                />
              </div>
            );

            return content?.googleUrl && index === 1 ? (
              <a
                key={source}
                href={content.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver avaliações da Transfer Fortaleza Tur no Google"
                className="rounded-xl transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                {image}
              </a>
            ) : (
              <div key={source}>{image}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
