import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getCachedSiteSettings, getCachedTours } from "@/lib/public-data-cache";
import { Clock, Check, X, Users, AlertCircle, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import TourConversionBar from "@/components/public/TourConversionBar";
import TourTrustBadges from "@/components/public/TourTrustBadges";
import TourFAQ from "@/components/public/TourFAQ";
import RecommendedTours from "@/components/public/RecommendedTours";
import TourTracking from "@/components/public/TourTracking";
import DetailGallery from "@/components/public/DetailGallery";
import * as Types from "@/types";
import { getSiteUrl } from "@/lib/site-url";
import { getHomepageOpenGraphImage, normalizeOpenGraphImage, withBrandSuffix } from "@/lib/open-graph";
import MarkdownDescription from "@/components/public/MarkdownDescription";
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from "@/components/public/EditableHeading";

interface PageProps {
  params: { id: string };
}

export const revalidate = 300;

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  try {
    const tours = await getCachedTours(true);
    return tours.map((tour) => ({ id: tour.slug || tour.id }));
  } catch (error) {
    console.error("Error generating tour pages:", error);
    return [];
  }
}

const getTour = cache(async (id: string): Promise<Types.Tour | null> => {
  try {
    const tours = await getCachedTours(false);
    return tours.find((tour) => tour.slug === id || tour.id === id) || null;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const tour = await getTour(params.id);

  if (!tour) {
    return {
      title: "Passeio não encontrado",
      robots: "noindex, nofollow",
    };
  }

  // SEO: Title otimizado (até 60 caracteres)
  const title = tour.name.length > 50 ? tour.name.substring(0, 50) + "..." : tour.name;

  // SEO: Description persuasiva com CTA (até 160 caracteres)
  const description = tour.description 
    ? tour.description.length > 140 
      ? tour.description.substring(0, 140) + "... Reserve agora!" 
      : tour.description + " Reserve agora!"
    : `Reserve ${tour.name} em Fortaleza. Passeio turístico com guia, transporte inclusivo. Garantia de satisfação. Reserve agora!`;

  // SEO: Keywords baseadas no nome do tour
  const keywords = [
    tour.name.toLowerCase(),
    "passeios fortaleza",
    "turismo ceará",
    "transfer fortaleza tur",
    "passeio fortaleza",
    "excursão fortaleza",
  ].join(", ");
  const image = tour.mainImageUrl
    ? normalizeOpenGraphImage(tour.mainImageUrl)
    : await getHomepageOpenGraphImage();

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/pacote/${params.id}`,
      title: withBrandSuffix(tour.name),
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{
        url: image,
        alt: `${tour.name} - Passeio turístico em Fortaleza`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(tour.name),
      description,
      images: [image],
    },
    alternates: {
      canonical: `${baseUrl}/pacote/${params.id}`,
    },
  };
}

export default async function PasseioDetailPage({ params }: PageProps) {
  const baseUrl = getSiteUrl();
  const tour = await getTour(params.id);

  if (!tour) {
    notFound();
  }

  const [allTours, settings] = await Promise.all([
    getCachedTours(true),
    getCachedSiteSettings(),
  ]);
  const relatedTours = tour.recommendedTourIds?.length
    ? tour.recommendedTourIds
        .map((id) => allTours.find((item) => item.id === id))
        .filter((item): item is Types.Tour => Boolean(item && item.id !== tour.id))
        .slice(0, 3)
    : allTours.filter((item) => item.id !== tour.id).slice(0, 3);
  const galleryImages = [
    {
      id: "main",
      url: tour.mainImageUrl,
      alt: tour.mainImageAlt,
      order: 0,
    },
    ...(tour.galleryImages || []),
  ].filter((image) => image.url);

  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Passeios", url: `${baseUrl}/passeios` },
    { name: tour.name, url: `${baseUrl}/pacote/${params.id}` },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <Header />
      
      {/* Track tour view */}
      <TourTracking tourName={tour.name} tourId={tour.id} />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      {/* SEO: JSON-LD Product Schema enriquecido */}
      {tour.mainImageUrl && tour.price > 0 && (
        <ProductJsonLd
          name={tour.name}
          description={tour.description}
          image={tour.mainImageUrl}
          price={tour.price}
          url={`${baseUrl}/pacote/${params.id}`}
        />
      )}

      {/* CTA Sticky Bar - aparece após scroll */}
      <TourConversionBar 
        tourName={tour.name}
        whatsappNumber={settings?.whatsappConfig?.number}
      />

      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/passeios"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
            aria-label="Voltar para lista de passeios"
          >
            {settings?.pageCopy?.tourDetails?.backLink || "← Voltar para passeios"}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda - Imagens */}
            <div>
              <DetailGallery
                images={galleryImages}
                alt={`${tour.name} - Passeio turístico em Fortaleza e região`}
                featured={tour.featured}
              />
            </div>

            {/* Coluna Direita - Conteúdo */}
            <div>
              {/* Badge de disponibilidade */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {settings?.pageCopy?.tourDetails?.availability || "Disponível para reserva"}
                </span>
                {tour.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={14} />
                    {settings?.pageCopy?.tourDetails?.featured || "Mais vendido"}
                  </span>
                )}
              </div>

              {isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "productName") && <EditableHeading level={getHeadingLevel(settings?.pageCopy?.tourDetails, "productName", "h1")} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {tour.name}
              </EditableHeading>}
              
              {/* Informações rápidas */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock size={18} className="text-blue-600" />
                  <span className="font-medium">{tour.duration || 'Consulte'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <Users size={18} className="text-blue-600" />
                  <span className="font-medium">{settings?.pageCopy?.tourDetails?.groupLabel || "Grupo pequeno"}</span>
                </div>
              </div>

              {/* Gatilho de escassez */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <EditableHeading level={getHeadingLevel(settings?.pageCopy?.tourDetails, "urgencyTitle", "h3")} className="font-semibold text-orange-900 text-sm">{settings?.pageCopy?.tourDetails?.urgencyTitle || "Últimas vagas disponíveis"}</EditableHeading>
                  <p className="text-xs text-orange-700 mt-1">{settings?.pageCopy?.tourDetails?.urgencyText || "Reserve agora para garantir sua vaga neste passeio exclusivo."}</p>
                </div>
              </div>

              {/* Descrição */}
              {isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "aboutSection") && <div className="mb-8">
                <EditableHeading level={getHeadingLevel(settings?.pageCopy?.tourDetails, "aboutTitle", "h2")} className="text-xl font-bold text-gray-900 mb-3">{settings?.pageCopy?.tourDetails?.aboutTitle || "Sobre este passeio"}</EditableHeading>
                {isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "productDescription") && <p className="text-gray-600 leading-relaxed">{tour.description}</p>}
              </div>}

              {tour.longDescription && isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "productLongDescription") && (
                <div className="mb-8">
                  <details className="group">
                    <summary className="cursor-pointer text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                      {settings?.pageCopy?.tourDetails?.fullDescription || "Ler descrição completa"}
                      <ChevronDown size={18} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <MarkdownDescription content={tour.longDescription} className="mt-4 text-gray-600 leading-relaxed" />
                  </details>
                </div>
              )}

              {/* O que está incluído */}
              {tour.includesItems && tour.includesItems.length > 0 && isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "includesSection") && (
                <div className="mb-8">
                  <EditableHeading level={getHeadingLevel(settings?.pageCopy?.tourDetails, "includesTitle", "h2")} className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check size={22} className="text-green-600" />
                    {settings?.pageCopy?.tourDetails?.includesTitle || "O que está incluído"}
                  </EditableHeading>
                  <ul className="space-y-3">
                    {tour.includesItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600">
                        <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* O que não está incluído */}
              {tour.excludesItems && tour.excludesItems.length > 0 && isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "excludesSection") && (
                <div className="mb-8">
                  <EditableHeading level={getHeadingLevel(settings?.pageCopy?.tourDetails, "excludesTitle", "h2")} className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <X size={22} className="text-red-600" />
                    {settings?.pageCopy?.tourDetails?.excludesTitle || "O que não está incluído"}
                  </EditableHeading>
                  <ul className="space-y-3">
                    {tour.excludesItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600">
                        <X size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selos de Confiança */}
      <TourTrustBadges copy={settings?.pageCopy?.tourDetails} />

      {/* FAQ */}
      {isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "faqSection") && <TourFAQ faqs={tour.faqs} title={settings?.pageCopy?.tourDetails?.faqTitle} titleLevel={getHeadingLevel(settings?.pageCopy?.tourDetails, "faqTitle", "h2")} titleEnabled={isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "faqTitle")} />}

      {/* Passeios Recomendados */}
      {isCopyFieldEnabled(settings?.pageCopy?.tourDetails, "relatedSection") && <RecommendedTours tours={relatedTours} copy={settings?.pageCopy?.tourDetails} />}

      <Footer />
    </main>
  );
}