import Link from "next/link";
import { ArrowRight, Car, Users } from "lucide-react";
import { Transfer } from "@/types";

interface RecommendedTransfersProps {
  transfers: Transfer[];
}

export default function RecommendedTransfers({ transfers }: RecommendedTransfersProps) {
  if (!transfers || transfers.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Outros transfers recomendados</h2>
            <p className="text-gray-600">Confira outras opções de transporte para sua viagem</p>
          </div>
          <Link href="/transfer" className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold">
            Ver todos <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transfers.map((transfer) => (
            <Link
              key={transfer.id}
              href={`/transfer/${transfer.slug || transfer.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={transfer.imageUrl} alt={transfer.imageAlt || transfer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">{transfer.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><Car size={16} />{transfer.vehicleType || "Consulte"}</span>
                  <span className="flex items-center gap-2"><Users size={16} />{transfer.capacity ? `${transfer.capacity} pessoas` : "Consulte"}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-primary-600 font-semibold">Ver detalhes</span>
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