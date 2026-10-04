"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/types";

interface DetailGalleryProps {
  images: GalleryImage[];
  alt: string;
  featured?: boolean;
}

export default function DetailGallery({ images, alt, featured = false }: DetailGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleImages = images.slice(0, 3);
  const currentImage = visibleImages[currentIndex];

  if (!currentImage) return null;

  const goTo = (index: number) => {
    setCurrentIndex((index + visibleImages.length) % visibleImages.length);
  };

  return (
    <div>
      <div className="relative h-96 overflow-hidden rounded-xl shadow-lg lg:h-[500px]">
        <img src={currentImage.url} alt={currentImage.alt || alt} className="h-full w-full object-cover" loading="eager" />
        {visibleImages.length > 1 && (
          <>
            <button type="button" onClick={() => goTo(currentIndex - 1)} aria-label="Imagem anterior" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => goTo(currentIndex + 1)} aria-label="Próxima imagem" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white">
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {visibleImages.map((image, index) => (
                <button key={image.id} type="button" onClick={() => goTo(index)} aria-label={`Ver imagem ${index + 1}`} className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`} />
              ))}
            </div>
          </>
        )}
        {featured && <span className="absolute right-4 top-4 rounded-full bg-yellow-500 px-4 py-2 font-semibold text-white shadow-md">Destaque</span>}
      </div>
      {visibleImages.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {visibleImages.map((image, index) => (
            <button type="button" key={image.id} onClick={() => goTo(index)} className={`relative h-24 overflow-hidden rounded-lg ${index === currentIndex ? "ring-2 ring-primary-600" : "opacity-75 hover:opacity-100"}`}>
              <img src={image.url} alt={image.alt || `${alt} - Foto ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}