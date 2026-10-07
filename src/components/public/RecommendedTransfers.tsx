import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Car, Users } from "lucide-react";
import { Transfer } from "@/types";
import { shouldOptimizeImage } from "@/lib/image-optimization";
import type { SitePageCopy } from "@/types";
import EditableHeading, { getHeadingLevel } from "./EditableHeading";

interface RecommendedTransfersProps {
  transfers: Transfer[];
  copy?: Partial<SitePageCopy>;
}

export default function RecommendedTransfers({ transfers, copy }: RecommendedTransfersProps) {
  if (!transfers || transfers.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <EditableHeading level={getHeadingLevel(copy, "relatedTitle", "h2")} className="text-3xl font-bold text-gray-900 mb-2">{copy?.relatedTitle || "Outros transfers recomendados"}</EditableHeading>
            <p className="text-gray-600">{copy?.relatedIntro || "Confira outras opções de transporte para sua viagem"}</p>
          </div>
          <Link href="/transfer" className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold">
            {copy?.relatedSeeAll || "Ver todos"} <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transfers.map((transfer) => (
            <Link
              key={transfer.id}
              href={`/pacote/${transfer.slug || transfer.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={transfer.imageUrl}
                  alt={transfer.imageAlt || transfer.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  unoptimized={!shouldOptimizeImage(transfer.imageUrl)}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <EditableHeading level={getHeadingLevel(copy, "cardTitle", "h3")} className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">{transfer.name}</EditableHeading>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><Car size={16} />{transfer.vehicleType || copy?.vehicleFallback || "Consulte"}</span>
                  <span className="flex items-center gap-2"><Users size={16} />{transfer.capacity ? `${transfer.capacity} ${copy?.capacitySuffix || "pessoas"}` : copy?.capacityFallback || "Consulte"}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-primary-600 font-semibold">{copy?.relatedCardButton || "Ver transfer"}: {transfer.name}</span>
                  <ArrowRight size={18} className="text-primary-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}