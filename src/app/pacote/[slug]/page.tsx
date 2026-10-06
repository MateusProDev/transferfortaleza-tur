import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import TourDetailPage from "@/app/passeios/[id]/page";
import TransferDetailPage from "@/app/transfer/[id]/page";
import { getCachedTours, getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

interface PageProps {
  params: { slug: string };
}

async function getPackage(slug: string) {
  const [tours, transfers] = await Promise.all([
    getCachedTours(true),
    getCachedTransfers(true),
  ]);

  const tour = tours.find((item) => item.slug === slug || item.id === slug);
  if (tour) return { type: "tour" as const, item: tour };

  const transfer = transfers.find((item) => item.slug === slug || item.id === slug);
  if (transfer) return { type: "transfer" as const, item: transfer };

  return null;
}

export const revalidate = 300;

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const [tours, transfers] = await Promise.all([
    getCachedTours(true),
    getCachedTransfers(true),
  ]);

  return Array.from(
    new Set([
      ...tours.map((tour) => tour.slug || tour.id),
      ...transfers.map((transfer) => transfer.slug || transfer.id),
    ])
  ).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getPackage(params.slug);
  if (!item) {
    return {
      title: "Pacote não encontrado",
      robots: "noindex, nofollow",
    };
  }

  const baseUrl = getSiteUrl();
  const slug = item.item.slug || item.item.id;
  const canonical = `${baseUrl}/pacote/${slug}`;
  const title = item.item.name;
  const description = item.item.description;
  const productImage = item.type === "tour" ? item.item.mainImageUrl : item.item.imageUrl;
  const image = productImage || `${baseUrl}/OG.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      title,
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function LegacyPackagePage({ params }: PageProps) {
  const item = await getPackage(params.slug);
  if (!item) notFound();

  const slug = item.item.slug || item.item.id;
  if (params.slug !== slug) {
    permanentRedirect(`/pacote/${slug}`);
  }

  if (item.type === "tour") {
    return <TourDetailPage params={{ id: slug }} />;
  }

  return <TransferDetailPage params={{ id: slug }} />;
}
