import Image from "next/image";
import { shouldOptimizeImage } from "@/lib/image-optimization";
import type { GoogleReviewsContent } from "@/types";

interface PackageReviewHighlightsProps {
  content: GoogleReviewsContent | null;
}

export default function PackageReviewHighlights({ content }: PackageReviewHighlightsProps) {
  const image = content?.reviewsHighlightImage || "/confianca-transfer-fortaleza.jpg";
  const alt = content?.reviewsHighlightImageAlt
    || "Transfer Fortaleza Tur: mais que números, é confiança. Mais de 260 avaliações no Google e 160 no TripAdvisor.";

  return (
    <section className="border-t border-gray-200 bg-white py-8 sm:py-12" aria-label={alt}>
      <div className="container mx-auto px-4">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-3xl overflow-hidden rounded-xl sm:rounded-2xl">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            unoptimized={!shouldOptimizeImage(image)}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
