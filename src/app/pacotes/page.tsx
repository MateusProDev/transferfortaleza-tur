import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Clock, Users } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Footer from '@/components/public/Footer';
import Header from '@/components/public/Header';
import { getCachedSiteSettings, getCachedTours, getCachedTransfers } from '@/lib/public-data-cache';
import { shouldOptimizeImage } from '@/lib/image-optimization';
import { getSiteUrl } from '@/lib/site-url';
import type { SitePageCopy, Tour, Transfer } from '@/types';
import EditableHeading, { getHeadingLevel } from '@/components/public/EditableHeading';

export const revalidate = 300;

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let copy: Partial<SitePageCopy> | undefined;
  try {
    const settings = await getCachedSiteSettings();
    copy = settings?.pageCopy?.packages;
  } catch (error) {
    console.error('Error fetching package page metadata:', error);
  }
  const title = copy?.seoTitle || 'Passeios e Transfers em Fortaleza';
  const description = copy?.seoDescription || 'Explore passeios e transfers em Fortaleza e região. Encontre experiências, transporte e reserve sua próxima viagem.';
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/pacotes` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/pacotes`,
      title: `${title} | Transfer Fortaleza Tur`,
      description,
    },
  };
}

export default async function PacotesPage() {
  let tours: Tour[] = [];
  let transfers: Transfer[] = [];
  let toursEnabled = true;
  let transfersEnabled = true;
  let loadError = false;
  let pageCopy: Partial<SitePageCopy> | undefined;

  try {
    const [loadedTours, loadedTransfers, settings] = await Promise.all([
      getCachedTours(true),
      getCachedTransfers(true),
      getCachedSiteSettings(),
    ]);
    tours = loadedTours;
    transfers = loadedTransfers;
    pageCopy = settings?.pageCopy?.packages;
    toursEnabled = settings?.sections?.toursEnabled !== false;
    transfersEnabled = settings?.sections?.transfersEnabled !== false;
  } catch (error) {
    console.error('Error fetching packages page data:', error);
    loadError = true;
  }

  const breadcrumbItems = [
    { name: 'Início', url: baseUrl },
    { name: 'Passeios e Transfers', url: `${baseUrl}/pacotes` },
  ];

  return (
    <main className="min-h-screen bg-[#0F3A4A] pt-24">
      <Header />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <EditableHeading level={getHeadingLevel(pageCopy, "title", "h1")} className="font-display mb-4 text-4xl md:text-5xl">{pageCopy?.title || "Passeios e Transfers"}</EditableHeading>
          <p className="max-w-2xl text-xl">
            {pageCopy?.intro || "Encontre passeios para conhecer Fortaleza e região, além de transfers para viajar com conforto."}
          </p>
          <nav aria-label="Categorias" className="mt-8 flex flex-wrap gap-3">
            {toursEnabled && (
              <a href="#passeios" className="rounded-lg bg-white px-5 py-3 font-semibold text-primary-700 transition hover:bg-gray-100">
                Ver passeios
              </a>
            )}
            {transfersEnabled && (
              <a href="#transfers" className="rounded-lg border border-white px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                Ver transfers
              </a>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto space-y-16 px-4 py-12">
        {loadError && (
          <p className="rounded-lg bg-white p-5 text-center text-red-700" role="alert">
            {pageCopy?.loadError || "Não foi possível carregar os passeios e transfers agora. Tente novamente mais tarde."}
          </p>
        )}

        {!toursEnabled && !transfersEnabled ? (
          <p className="rounded-lg bg-white p-8 text-center text-gray-700">
            {pageCopy?.unavailable || "Os passeios e transfers estão temporariamente indisponíveis."}
          </p>
        ) : (
          <>
            {toursEnabled && (
              <section id="passeios" aria-labelledby="passeios-heading">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <EditableHeading level={getHeadingLevel(pageCopy, "toursTitle", "h2")} id="passeios-heading" className="font-display text-3xl text-white">{pageCopy?.toursTitle || "Passeios"}</EditableHeading>
                    <p className="mt-2 text-white/80">{pageCopy?.toursIntro || "Experiências para descobrir Fortaleza e os destinos do Ceará."}</p>
                  </div>
                  <Link href="/passeios" className="font-semibold text-cyan-200 underline underline-offset-4 hover:text-white">
                    {pageCopy?.seeTours || "Ver todos os passeios"}
                  </Link>
                </div>
                {tours.length === 0 ? (
                  <p className="rounded-lg bg-white p-6 text-gray-700">{pageCopy?.noTours || "Nenhum passeio disponível no momento."}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tours.map((tour) => (
                      <article key={tour.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl">
                        <Link href={`/pacote/${tour.slug || tour.id}`} className="relative block aspect-square w-full overflow-hidden" aria-label={`Ver passeio: ${tour.name}`}>
                          {tour.mainImageUrl ? (
                            <Image
                              src={tour.mainImageUrl}
                              alt={tour.mainImageAlt || tour.name}
                              fill
                              unoptimized={!shouldOptimizeImage(tour.mainImageUrl)}
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">{pageCopy?.imagePlaceholder || "Sem imagem"}</div>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col p-6">
                          <EditableHeading level={getHeadingLevel(pageCopy, "cardTitle", "h3")} className="mb-2 text-xl font-bold text-gray-900">
                            <Link href={`/pacote/${tour.slug || tour.id}`} className="hover:text-primary-600" aria-label={`Ver passeio: ${tour.name}`}>{tour.name}</Link>
                          </EditableHeading>
                          <p className="mb-4 line-clamp-2 flex-1 text-gray-600">{tour.description}</p>
                          <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={16} aria-hidden="true" />
                            <span>{tour.duration || pageCopy?.durationFallback || 'Consulte'}</span>
                            <Users size={16} className="ml-3" aria-hidden="true" />
                            <span>{pageCopy?.groupLabel || "Grupos pequenos"}</span>
                          </div>
                          <Link
                            href={`/pacote/${tour.slug || tour.id}`}
                            className="rounded-lg bg-primary-600 px-4 py-2 text-center font-medium text-white transition hover:bg-primary-700"
                          >
                            Ver passeio
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {transfersEnabled && (
              <section id="transfers" aria-labelledby="transfers-heading">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <EditableHeading level={getHeadingLevel(pageCopy, "transfersTitle", "h2")} id="transfers-heading" className="font-display text-3xl text-white">{pageCopy?.transfersTitle || "Transfers"}</EditableHeading>
                    <p className="mt-2 text-white/80">{pageCopy?.transfersIntro || "Transporte confortável para seus deslocamentos em Fortaleza e região."}</p>
                  </div>
                  <Link href="/transfer" className="font-semibold text-cyan-200 underline underline-offset-4 hover:text-white">
                    {pageCopy?.seeTransfers || "Ver todos os transfers"}
                  </Link>
                </div>
                {transfers.length === 0 ? (
                  <p className="rounded-lg bg-white p-6 text-gray-700">{pageCopy?.noTransfers || "Nenhum transfer disponível no momento."}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {transfers.map((transfer) => (
                      <article key={transfer.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl">
                        <Link href={`/pacote/${transfer.slug || transfer.id}`} className="relative block h-48 w-full" aria-label={`Ver transfer: ${transfer.name}`}>
                          {transfer.imageUrl ? (
                            <Image
                              src={transfer.imageUrl}
                              alt={transfer.imageAlt || transfer.name}
                              fill
                              unoptimized={!shouldOptimizeImage(transfer.imageUrl)}
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">{pageCopy?.imagePlaceholder || "Sem imagem"}</div>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col p-6">
                          <EditableHeading level={getHeadingLevel(pageCopy, "cardTitle", "h3")} className="mb-2 text-xl font-bold text-gray-900">
                            <Link href={`/pacote/${transfer.slug || transfer.id}`} className="hover:text-primary-600" aria-label={`Ver transfer: ${transfer.name}`}>{transfer.name}</Link>
                          </EditableHeading>
                          <p className="mb-4 line-clamp-2 flex-1 text-gray-600">{transfer.description}</p>
                          <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                            <Car size={16} aria-hidden="true" />
                            <span>{transfer.vehicleType || pageCopy?.vehicleFallback || 'Consulte'}</span>
                            <Users size={16} className="ml-3" aria-hidden="true" />
                            <span>{transfer.capacity > 0 ? `${transfer.capacity} ${pageCopy?.capacitySuffix || "pessoas"}` : pageCopy?.capacityFallback || 'Consulte'}</span>
                          </div>
                          <Link
                            href={`/pacote/${transfer.slug || transfer.id}`}
                            className="rounded-lg bg-secondary-600 px-4 py-2 text-center font-medium text-white transition hover:bg-secondary-700"
                          >
                            Ver transfer
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
