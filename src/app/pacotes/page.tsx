import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Clock, Users, MapPin, Star } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Footer from '@/components/public/Footer';
import Header from '@/components/public/Header';
import { getCachedSiteSettings, getCachedTours, getCachedTransfers } from '@/lib/public-data-cache';
import { shouldOptimizeImage } from '@/lib/image-optimization';
import { getSiteUrl } from '@/lib/site-url';
import { getHomepageOpenGraphImage, normalizeOpenGraphImage, stripBrandSuffix, withBrandSuffix } from '@/lib/open-graph';
import type { SitePageCopy, Tour, Transfer } from '@/types';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from '@/components/public/EditableHeading';

export const revalidate = 86400;

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let copy: Partial<SitePageCopy> | undefined;
  let image = "";
  try {
    const [settings, tours, transfers] = await Promise.all([
      getCachedSiteSettings(),
      getCachedTours(true),
      getCachedTransfers(true),
    ]);
    copy = settings?.pageCopy?.packages;
    image = tours.find((tour) => tour.mainImageUrl)?.mainImageUrl
      || transfers.find((transfer) => transfer.imageUrl)?.imageUrl
      || "";
  } catch (error) {
    console.error('Error fetching package page metadata:', error);
  }
  const title = stripBrandSuffix(copy?.seoTitle || 'Passeios e Transfers em Fortaleza');
  const description = copy?.seoDescription || 'Explore passeios e transfers em Fortaleza e região. Encontre experiências, transporte e reserve sua próxima viagem.';
  const ogImage = image ? normalizeOpenGraphImage(image) : await getHomepageOpenGraphImage();
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/pacotes` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/pacotes`,
      siteName: "Transfer Fortaleza Tur",
      title: withBrandSuffix(title),
      description,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(title),
      description,
      images: [ogImage],
    },
  };
}

export default async function PacotesPage() {
  let tours: Tour[] = [];
  let transfers: Transfer[] = [];
  let toursEnabled = true;
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
  } catch (error) {
    console.error('Error fetching packages page data:', error);
    loadError = true;
  }

  const breadcrumbItems = [
    { name: 'Início', url: baseUrl },
    { name: 'Passeios e Transfers', url: `${baseUrl}/pacotes` },
  ];
  const showTours = toursEnabled && isCopyFieldEnabled(pageCopy, "toursSection");
  const showTransfers = isCopyFieldEnabled(pageCopy, "transfersSection");

  return (
    <main className="min-h-screen bg-[#0F3A4A] pt-24">
      <Header />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBIMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          {isCopyFieldEnabled(pageCopy, "title") && (
            <EditableHeading level={getHeadingLevel(pageCopy, "title", "h1")} className="font-display mb-4 text-4xl md:text-5xl lg:text-6xl font-bold">
              {pageCopy?.title || "Passeios e Transfers"}
            </EditableHeading>
          )}
          {isCopyFieldEnabled(pageCopy, "intro") && (
            <p className="max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed">
              {pageCopy?.intro || "Encontre passeios para conhecer Fortaleza e região, além de transfers para viajar com conforto."}
            </p>
          )}
          <nav aria-label="Categorias" className="mt-8 flex flex-wrap gap-3">
            {showTours && (
              <a href="#passeios" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary-700 transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:scale-105">
                <Clock className="h-5 w-5" />
                Ver passeios
              </a>
            )}
            {showTransfers && (
              <a href="#transfers" className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-lg hover:scale-105">
                <Car className="h-5 w-5" />
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

        {!showTours && !showTransfers ? (
          <p className="rounded-lg bg-white p-8 text-center text-gray-700">
            {pageCopy?.unavailable || "Os passeios e transfers estão temporariamente indisponíveis."}
          </p>
        ) : (
          <>
            {showTours && (
              <section id="passeios" aria-labelledby="passeios-heading" className="space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"></div>
                      {isCopyFieldEnabled(pageCopy, "toursTitle") && (
                        <EditableHeading level={getHeadingLevel(pageCopy, "toursTitle", "h2")} id="passeios-heading" className="font-display text-3xl md:text-4xl font-bold text-white">
                          {pageCopy?.toursTitle || "Passeios"}
                        </EditableHeading>
                      )}
                    </div>
                    {isCopyFieldEnabled(pageCopy, "toursIntro") && (
                      <p className="mt-3 text-lg text-white/70 max-w-2xl">{pageCopy?.toursIntro || "Experiências para descobrir Fortaleza e os destinos do Ceará."}</p>
                    )}
                  </div>
                  <Link href="/passeios" className="group inline-flex items-center gap-2 font-semibold text-cyan-300 transition-all duration-300 hover:text-white hover:gap-3">
                    {pageCopy?.seeTours || "Ver todos os passeios"}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                {tours.length === 0 ? (
                  <p className="rounded-lg bg-white p-6 text-gray-700">{pageCopy?.noTours || "Nenhum passeio disponível no momento."}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {tours.map((tour) => (
                      <article key={tour.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <Link href={`/passeios/${tour.slug || tour.id}`} className="relative block aspect-[4/3] w-full overflow-hidden" aria-label={`Ver passeio: ${tour.name}`}>
                          {tour.mainImageUrl ? (
                            <Image
                              src={tour.mainImageUrl}
                              alt={tour.mainImageAlt || tour.name}
                              fill
                              unoptimized={!shouldOptimizeImage(tour.mainImageUrl)}
                              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600">
                              <MapPin className="h-12 w-12" />
                            </div>
                          )}
                          {tour.featured && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                              <Star className="h-3 w-3 fill-white" />
                              Destaque
                            </div>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col p-5">
                          {isCopyFieldEnabled(pageCopy, "cardTitle") && (
                            <EditableHeading level={getHeadingLevel(pageCopy, "cardTitle", "h3")} className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                              <Link href={`/passeios/${tour.slug || tour.id}`} className="hover:text-primary-600 transition-colors" aria-label={`Ver passeio: ${tour.name}`}>
                                {tour.name}
                              </Link>
                            </EditableHeading>
                          )}
                          {tour.location && (
                            <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 text-primary-500" />
                              <span className="line-clamp-1">{tour.location}</span>
                            </div>
                          )}
                          {isCopyFieldEnabled(pageCopy, "cardDescription") && (
                            <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 leading-relaxed">{tour.description}</p>
                          )}
                          <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
                            {tour.duration && (
                              <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                                <Clock className="h-3.5 w-3.5 text-primary-500" />
                                <span>{tour.duration}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                              <Users className="h-3.5 w-3.5 text-primary-500" />
                              <span>{pageCopy?.groupLabel || "Grupos"}</span>
                            </div>
                          </div>
                          <Link
                            href={`/passeios/${tour.slug || tour.id}`}
                            className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-center font-semibold text-white transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg"
                          >
                            Ver detalhes
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {showTransfers && (
              <section id="transfers" aria-labelledby="transfers-heading" className="space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-600"></div>
                      {isCopyFieldEnabled(pageCopy, "transfersTitle") && (
                        <EditableHeading level={getHeadingLevel(pageCopy, "transfersTitle", "h2")} id="transfers-heading" className="font-display text-3xl md:text-4xl font-bold text-white">
                          {pageCopy?.transfersTitle || "Transfers"}
                        </EditableHeading>
                      )}
                    </div>
                    {isCopyFieldEnabled(pageCopy, "transfersIntro") && (
                      <p className="mt-3 text-lg text-white/70 max-w-2xl">{pageCopy?.transfersIntro || "Transporte confortável para seus deslocamentos em Fortaleza e região."}</p>
                    )}
                  </div>
                  <Link href="/transfer" className="group inline-flex items-center gap-2 font-semibold text-cyan-300 transition-all duration-300 hover:text-white hover:gap-3">
                    {pageCopy?.seeTransfers || "Ver todos os transfers"}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                {transfers.length === 0 ? (
                  <p className="rounded-lg bg-white p-6 text-gray-700">{pageCopy?.noTransfers || "Nenhum transfer disponível no momento."}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {transfers.map((transfer) => (
                      <article key={transfer.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <Link href={`/transfers/${transfer.slug || transfer.id}`} className="relative block aspect-[4/3] w-full overflow-hidden" aria-label={`Ver transfer: ${transfer.name}`}>
                          {transfer.imageUrl ? (
                            <Image
                              src={transfer.imageUrl}
                              alt={transfer.imageAlt || transfer.name}
                              fill
                              unoptimized={!shouldOptimizeImage(transfer.imageUrl)}
                              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-600">
                              <Car className="h-12 w-12" />
                            </div>
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col p-5">
                          {isCopyFieldEnabled(pageCopy, "cardTitle") && (
                            <EditableHeading level={getHeadingLevel(pageCopy, "cardTitle", "h3")} className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                              <Link href={`/transfers/${transfer.slug || transfer.id}`} className="hover:text-secondary-600 transition-colors" aria-label={`Ver transfer: ${transfer.name}`}>
                                {transfer.name}
                              </Link>
                            </EditableHeading>
                          )}
                          {isCopyFieldEnabled(pageCopy, "cardDescription") && (
                            <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 leading-relaxed">{transfer.description}</p>
                          )}
                          <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
                            {transfer.vehicleType && (
                              <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                                <Car className="h-3.5 w-3.5 text-secondary-500" />
                                <span className="line-clamp-1">{transfer.vehicleType}</span>
                              </div>
                            )}
                            {transfer.capacity > 0 && (
                              <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                                <Users className="h-3.5 w-3.5 text-secondary-500" />
                                <span>{transfer.capacity} {pageCopy?.capacitySuffix || "pessoas"}</span>
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/transfers/${transfer.slug || transfer.id}`}
                            className="w-full rounded-xl bg-gradient-to-r from-secondary-600 to-secondary-700 px-4 py-2.5 text-center font-semibold text-white transition-all duration-300 hover:from-secondary-700 hover:to-secondary-800 hover:shadow-lg"
                          >
                            Ver detalhes
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

        {/* Instagram Section */}
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
          <div className="container mx-auto px-4 text-center">
            {isCopyFieldEnabled(pageCopy, "instagramTitle") && <EditableHeading level={getHeadingLevel(pageCopy, "instagramTitle", "h2")} className="text-3xl font-bold text-gray-900 mb-4">
              {pageCopy?.instagramTitle || "Veja mais momentos incríveis dos nossos clientes!"}
            </EditableHeading>}
            {isCopyFieldEnabled(pageCopy, "instagramSubtitle") && <p className="text-gray-600 mb-6">
              {pageCopy?.instagramSubtitle || "Siga nosso Instagram e acompanhe nossos passeios e transfers"}
            </p>}
            <a
              href="https://instagram.com/transferfortalezatur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {pageCopy?.instagramButton || "@TransferFortalezaTur"}
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
