import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import TransferDetailPage from "@/app/transfer/[id]/page";
import { getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { normalizeOpenGraphImage, withBrandSuffix } from "@/lib/open-graph";

interface PageProps {
  params: { slug: string };
}

async function getTransfer(slug: string) {
  const transfers = await getCachedTransfers(true);
  return transfers.find((item) => item.slug === slug || item.id === slug);
}

export const revalidate = 86400;

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const transfers = await getCachedTransfers(true);
  return transfers.map((transfer) => ({ slug: transfer.slug || transfer.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const transfer = await getTransfer(params.slug);
  if (!transfer) {
    return {
      title: "Transfer não encontrado",
      robots: "noindex, nofollow",
    };
  }

  const baseUrl = getSiteUrl();
  const slug = transfer.slug || transfer.id;
  const canonical = `${baseUrl}/transfers/${slug}`;
  const title = transfer.name;
  const description = transfer.description;
  const image = transfer.imageUrl
    ? normalizeOpenGraphImage(transfer.imageUrl)
    : `${baseUrl}/android-icon-192x192.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      title: withBrandSuffix(title),
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(title),
      description,
      images: [image],
    },
  };
}

export default async function TransferSlugPage({ params }: PageProps) {
  const transfer = await getTransfer(params.slug);
  if (!transfer) notFound();

  const slug = transfer.slug || transfer.id;

  // Se o slug não bater, redireciona para o correto
  if (params.slug !== slug) {
    permanentRedirect(`/transfers/${slug}`);
  }

  // Renderiza a página existente usando o ID
  return <TransferDetailPage params={{ id: slug }} />;
}
