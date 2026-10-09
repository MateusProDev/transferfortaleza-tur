"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Search, Users } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/site-url';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { shouldOptimizeImage } from '@/lib/image-optimization';
import type { SitePageCopy } from '@/types';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from '@/components/public/EditableHeading';

interface Transfer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  vehicleType: string;
  capacity: number;
  active: boolean;
  slug?: string;
}

interface TransfersClientProps {
  transfers: Transfer[];
  loadError: boolean;
  copy?: Partial<SitePageCopy>;
}

export default function TransfersClient({ transfers, loadError, copy }: TransfersClientProps) {
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>(transfers);
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = getSiteUrl();
  const breadcrumbItems = [
    { name: 'Início', url: baseUrl },
    { name: 'Transfer', url: `${baseUrl}/transfer` },
  ];

  useEffect(() => {
    setFilteredTransfers(transfers);
  }, [transfers]);

  useEffect(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const filtered = transfers.filter((transfer) =>
      (transfer.name || '').toLowerCase().includes(normalizedSearch) ||
      (transfer.description || '').toLowerCase().includes(normalizedSearch)
    );
    setFilteredTransfers(filtered);
  }, [searchTerm, transfers]);

  return (
    <main className="min-h-screen bg-[#0F3A4A] pt-24">
      <Header />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="bg-secondary-600 text-white py-16">
        <div className="container mx-auto px-4">
          {isCopyFieldEnabled(copy, "title") && <EditableHeading level={getHeadingLevel(copy, 'title', 'h1')} className="font-display text-4xl md:text-5xl mb-4">{copy?.title || "Serviços de Transfer"}</EditableHeading>}
          {isCopyFieldEnabled(copy, "intro") && <p className="text-xl max-w-2xl">{copy?.intro || "Conforto e segurança em seus deslocamentos com nossa frota moderna"}</p>}
        </div>
      </div>

      {isCopyFieldEnabled(copy, "listingSection") && <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={copy?.searchPlaceholder || "Buscar transfers..."}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-600"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {filteredTransfers.length} {filteredTransfers.length === 1 ? copy?.foundSingular || 'transfer encontrado' : copy?.foundPlural || 'transfers encontrados'}
          </div>
        </div>

        {loadError ? (
          <div className="py-12 text-center text-white/80" role="alert">
            {copy?.loadError || "Não foi possível carregar os transfers agora. Tente novamente mais tarde."}
          </div>
        ) : filteredTransfers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">{copy?.noResults || "Nenhum transfer encontrado com os filtros selecionados."}</p>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium">
              {copy?.clearFilters || "Limpar filtros"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransfers.map((transfer) => (
              <article key={transfer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <Link
                  href={`/pacote/${transfer.slug || transfer.id}`}
                  className="relative block h-48 w-full"
                  aria-label={`Ver transfer: ${transfer.name}`}
                >
                  {transfer.imageUrl ? (
                    <Image src={transfer.imageUrl} alt={transfer.imageAlt || transfer.name} fill className="object-cover" unoptimized={!shouldOptimizeImage(transfer.imageUrl)} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">{copy?.imagePlaceholder || "Sem imagem"}</span>
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  {isCopyFieldEnabled(copy, "cardTitle") && <EditableHeading level={getHeadingLevel(copy, 'cardTitle', 'h2')} className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/pacote/${transfer.slug || transfer.id}`} className="hover:text-primary-600" aria-label={`Ver transfer: ${transfer.name}`}>{transfer.name}</Link>
                  </EditableHeading>}
                  {isCopyFieldEnabled(copy, "cardDescription") && <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{transfer.description}</p>}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1"><Car size={16} /><span>{transfer.vehicleType || copy?.vehicleFallback || 'Consulte'}</span></div>
                    <div className="flex items-center space-x-1"><Users size={16} /><span>{transfer.capacity > 0 ? `${transfer.capacity} ${copy?.capacitySuffix || "pessoas"}` : copy?.capacityFallback || 'Consulte'}</span></div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/pacote/${transfer.slug || transfer.id}`}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      aria-label={`Ver detalhes de ${transfer.name}`}
                    >
                      {copy?.detailsButton || "Ver transfer"}: {transfer.name}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>}
      <Footer />
    </main>
  );
}