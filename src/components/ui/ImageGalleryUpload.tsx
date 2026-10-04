"use client";

import ImageUpload from "@/components/ui/ImageUpload";
import { GalleryImage } from "@/types";

interface ImageGalleryUploadProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  label: string;
  maxImages?: number;
}

export default function ImageGalleryUpload({ images, onImagesChange, label, maxImages = 2 }: ImageGalleryUploadProps) {
  const slots = Array.from({ length: maxImages }, (_, index) => images[index]);

  const updateImage = (index: number, url: string) => {
    const nextImages = [...images];
    if (url) {
      nextImages[index] = {
        id: nextImages[index]?.id || `${Date.now()}-${index}`,
        url,
        alt: nextImages[index]?.alt || "",
        order: index,
      };
    } else {
      nextImages.splice(index, 1);
    }
    onImagesChange(nextImages.slice(0, maxImages).map((image, imageIndex) => ({ ...image, order: imageIndex })));
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Adicione até {maxImages} imagens adicionais (máximo de 3 com a principal)</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {slots.map((image, index) => (
          <ImageUpload
            key={image?.id || `gallery-slot-${index}`}
            label={`Imagem ${index + 1}`}
            currentImage={image?.url}
            banner
            onImageUpload={(url) => updateImage(index, url)}
          />
        ))}
      </div>
    </div>
  );
}