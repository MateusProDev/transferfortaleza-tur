import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { faqService, transferService } from "@/lib/firestore";
import { Car, Check, ChevronDown, Users, X } from "lucide-react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import * as Types from "@/types";
import DetailGallery from "@/components/public/DetailGallery";
import WhatsAppConversionLink from "@/components/public/WhatsAppConversionLink";
import TransferConversionBar from "@/components/public/TransferConversionBar";
import FAQ from "@/components/public/FAQ";
import { getSiteUrl } from "@/lib/site-url";
import RecommendedTransfers from "@/components/public/RecommendedTransfers";

interface PageProps {
  params: { id: string };
}

export const revalidate = 300;

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  try {
    const transfers = await transferService.getAll(true);
    return transfers.map((transfer) => ({ id: transfer.slug || transfer.id }));
  } catch (error) {
    console.error("Error generating transfer pages:", error);
    return [];
  }
}

const getTransfer = cache(async (id: string): Promise<Types.Transfer | null> => {
  try {
    // Tenta buscar pelo slug primeiro, se não encontrar tenta pelo ID
    const transfer = await transferService.getBySlug(id);
    if (transfer) return transfer;
    return await transferService.getById(id);
  } catch (error) {
    console.error("Error fetching transfer:", error);
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const transfer = await getTransfer(params.id);

  if (!transfer) {
    return {
      title: "Transfer não encontrado",
      robots: "noindex, nofollow",
    };
  }

  const description = transfer.description || `Solicite um orçamento para ${transfer.name} com a Passeio Legal.`;

  return {
    title: transfer.name,
    description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/transfer/${params.id}`,
      title: transfer.name,
      description,
      siteName: "Passeio Legal",
      images: transfer.imageUrl ? [
        {
          url: transfer.imageUrl,
          width: 1200,
          height: 630,
          alt: transfer.imageAlt || transfer.name,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: transfer.name,
      description,
      images: transfer.imageUrl ? [transfer.imageUrl] : [],
    },
    alternates: {
      canonical: `${baseUrl}/transfer/${params.id}`,
    },
  };
}

export default async function TransferDetailPage({ params }: PageProps) {
  const transfer = await getTransfer(params.id);

  if (!transfer) {
    notFound();
  }

  const baseUrl = getSiteUrl();
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Transfer", url: `${baseUrl}/transfer` },
    { name: transfer.name, url: `${baseUrl}/transfer/${params.id}` },
  ];
  const galleryImages = [
    {
      id: "main",
      url: transfer.imageUrl,
      alt: transfer.imageAlt,
      order: 0,
    },
    ...(transfer.galleryImages || []),
  ].filter((image) => image.url);
  const faqs = await faqService.getAll();
  const transferFaqs = Array.isArray(transfer.faqs)
    ? transfer.faqs.filter((faq) => faq.question?.trim() && faq.answer?.trim())
    : [];
  const includesItems = Array.isArray(transfer.includesItems) ? transfer.includesItems.filter(Boolean) : [];
  const excludesItems = Array.isArray(transfer.excludesItems) ? transfer.excludesItems.filter(Boolean) : [];
  const relatedTransfers = transfer.recommendedTransferIds?.length
    ? await transferService.getRecommended(transfer.recommendedTransferIds, transfer.id, 3)
    : await transferService.getRelated(transfer.id, 3);
  const whatsappUrl = `https://wa.me/5585997314093?text=${encodeURIComponent(`Olá, gostaria de saber mais sobre o transfer: ${transfer.name}`)}`;

  return (
    <main className="min-h-screen pt-24 pb-20">
      <Header />
      <TransferConversionBar transferName={transfer.name} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <section className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/transfer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium transition-colors"
          >
            ← Voltar para transfer
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <DetailGallery
              images={galleryImages}
              alt={`${transfer.imageAlt || transfer.name} - Transfer em Fortaleza e região`}
              featured={transfer.featuredOnHome}
            />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Disponível para orçamento
                </span>
                {transfer.featuredOnHome && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Destaque
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                {transfer.name.trim()}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <Car size={22} className="text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Veículo</p>
                    <p className="font-semibold text-gray-900">{transfer.vehicleType || "Consulte"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <Users size={22} className="text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Capacidade</p>
                    <p className="font-semibold text-gray-900">
                      {transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : "Consulte"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-7">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Sobre este transfer</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{transfer.description}</p>
              </div>

              {transfer.longDescription && (
                <details className="group mb-7">
                  <summary className="cursor-pointer text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
                    Ver detalhes completos
                    <ChevronDown size={18} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                    {transfer.longDescription}
                  </p>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <WhatsAppConversionLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
                >
                  Solicitar orçamento pelo WhatsApp
                </WhatsAppConversionLink>
                <Link
                  href="#contact"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
                >
                  Fale conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(includesItems.length > 0 || excludesItems.length > 0) && (
        <section className="border-y border-gray-200 bg-gray-50 py-12">
          <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-2">
            {includesItems.length > 0 && (
              <div>
                <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <Check size={22} className="text-green-600" /> O que está incluído
                </h2>
                <ul className="space-y-3">
                  {includesItems.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-start gap-3 text-gray-700">
                      <Check size={19} className="mt-0.5 shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {excludesItems.length > 0 && (
              <div>
                <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <X size={22} className="text-red-600" /> O que não está incluído
                </h2>
                <ul className="space-y-3">
                  {excludesItems.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-start gap-3 text-gray-700">
                      <X size={19} className="mt-0.5 shrink-0 text-red-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {transferFaqs.length > 0 ? (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Perguntas sobre este transfer</h2>
            <div className="mx-auto max-w-3xl space-y-3">
              {transferFaqs.map((faq, index) => (
                <details key={`${faq.question}-${index}`} className="group rounded-lg border border-gray-200">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-gray-900">
                    {faq.question}
                    <ChevronDown size={20} className="shrink-0 text-primary-600 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="border-t border-gray-200 px-5 py-4 leading-relaxed text-gray-600 whitespace-pre-line">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <FAQ faqs={faqs} />
      )}

      <RecommendedTransfers transfers={relatedTransfers} />
      <Footer />
    </main>
  );
}
