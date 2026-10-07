"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, Search, SlidersHorizontal } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { getSiteUrl } from '@/lib/site-url';
import type { Tour } from '@/types';
import { shouldOptimizeImage } from '@/lib/image-optimization';
import type { SitePageCopy } from '@/types';
import EditableHeading, { getHeadingLevel } from '@/components/public/EditableHeading';

interface PasseiosClientProps {
  tours: Tour[];
  sectionDisabled: boolean;
  loadError: boolean;
  copy?: Partial<SitePageCopy>;
}

export default function PasseiosClient({ tours, sectionDisabled, loadError, copy }: PasseiosClientProps) {
  const [filteredTours, setFilteredTours] = useState<Tour[]>(tours);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const baseUrl = getSiteUrl();
  const breadcrumbItems = [
    { name: 'Início', url: baseUrl },
    { name: 'Passeios', url: `${baseUrl}/passeios` },
  ];

  useEffect(() => {
    let filtered = tours;
    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((tour) =>
        tour.name.toLowerCase().includes(normalizedSearch) ||
        tour.description.toLowerCase().includes(normalizedSearch)
      );
    }
    if (durationFilter !== 'all') {
      filtered = filtered.filter((tour) => {
        const duration = tour.duration.toLowerCase();
        if (durationFilter === 'short') return duration.includes('hora') && !duration.includes('dia');
        if (durationFilter === 'medium') return duration.includes('dia') && !duration.includes('semana');
        return duration.includes('semana') || duration.includes('mês');
      });
    }
    if (showFeaturedOnly) filtered = filtered.filter((tour) => tour.featured);
    setFilteredTours(filtered);
  }, [searchTerm, durationFilter, showFeaturedOnly, tours]);

  if (sectionDisabled) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <EditableHeading level={getHeadingLevel(copy, 'disabledTitle', 'h1')} className="text-3xl font-bold text-gray-900 mb-4">{copy?.disabledTitle || "Seção Indisponível"}</EditableHeading>
          <p className="text-gray-600 mb-8">{copy?.disabledMessage || "A seção de passeios está temporariamente desativada."}</p>
          <Link href="/" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">Voltar para a Página Inicial</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F3A4A] pt-24">
      <Header />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <EditableHeading level={getHeadingLevel(copy, 'title', 'h1')} className="font-display text-4xl md:text-5xl mb-4">{copy?.title || "Nossos Passeios"}</EditableHeading>
          <p className="text-xl max-w-2xl">{copy?.intro || "Descubra experiências únicas e memoráveis com nossos passeios cuidadosamente selecionados"}</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder={copy?.searchPlaceholder || "Buscar passeios..."} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <SlidersHorizontal size={20} />
              <span>{copy?.filtersButton || "Filtros"}</span>
            </button>
          </div>
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium mb-2">{copy?.durationFilterLabel || "Duração"}</label>
                <select value={durationFilter} onChange={(event) => setDurationFilter(event.target.value as typeof durationFilter)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600">
                  <option value="all">{copy?.anyDuration || "Todas"}</option>
                  <option value="short">{copy?.shortDuration || "Até 1 dia"}</option>
                  <option value="medium">{copy?.mediumDuration || "1-3 dias"}</option>
                  <option value="long">{copy?.longDuration || "Mais de 3 dias"}</option>
                </select>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="featured" checked={showFeaturedOnly} onChange={(event) => setShowFeaturedOnly(event.target.checked)} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600" />
                <label htmlFor="featured" className="ml-2 text-sm font-medium">{copy?.featuredOnly || "Apenas Destaques"}</label>
              </div>
            </div>
          )}
          <div className="mt-4 text-sm text-gray-600">{filteredTours.length} {filteredTours.length === 1 ? copy?.foundSingular || 'passeio encontrado' : copy?.foundPlural || 'passeios encontrados'}</div>
        </div>

        {loadError ? (
          <div className="text-center py-12" role="alert">
            <p className="text-white/80 text-lg">{copy?.loadError || "Não foi possível carregar os passeios."}</p>
            <Link href="/passeios" className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium">Tentar novamente</Link>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">{copy?.noResults || "Nenhum passeio encontrado com os filtros selecionados."}</p>
            <button onClick={() => { setSearchTerm(''); setDurationFilter('all'); setShowFeaturedOnly(false); }} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">{copy?.clearFilters || "Limpar filtros"}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <article key={tour.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <Link
                  href={`/pacote/${tour.slug || tour.id}`}
                  className="relative block aspect-square w-full overflow-hidden"
                  aria-label={`Ver passeio: ${tour.name}`}
                >
                  {tour.mainImageUrl ? <Image src={tour.mainImageUrl} alt={tour.mainImageAlt || tour.name} fill className="h-full w-full object-cover object-center" unoptimized={!shouldOptimizeImage(tour.mainImageUrl)} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-400">{copy?.imagePlaceholder || "Sem imagem"}</span></div>}
                  {tour.featured && <span className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Destaque</span>}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <EditableHeading level={getHeadingLevel(copy, 'cardTitle', 'h2')} className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/pacote/${tour.slug || tour.id}`} className="hover:text-primary-600" aria-label={`Ver passeio: ${tour.name}`}>{tour.name}</Link>
                  </EditableHeading>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{tour.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1"><Clock size={16} /><span>{tour.duration || copy?.durationFallback || 'Consulte'}</span></div>
                    <div className="flex items-center space-x-1"><Users size={16} /><span>{copy?.groupLabel || "Grupos pequenos"}</span></div>
                  </div>
                  <div className="flex items-center justify-end"><Link href={`/pacote/${tour.slug || tour.id}`} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium" aria-label={`${copy?.detailsButton || "Ver passeio"}: ${tour.name}`}>{copy?.detailsButton || "Ver passeio"}: {tour.name}</Link></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
