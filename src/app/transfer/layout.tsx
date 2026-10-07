import type { Metadata } from "next";
import { getCachedSiteSettings, getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let imageUrl = `${baseUrl}/OG.png`;
  let title = "Transfer em Fortaleza e Ceará | Transfer Fortaleza Tur";
  let description = "Reserve transfer em Fortaleza e região com conforto e segurança. Transporte para aeroporto, hotéis e destinos turísticos do Ceará.";

  try {
    const [transfers, settings] = await Promise.all([
      getCachedTransfers(true),
      getCachedSiteSettings(),
    ]);
    imageUrl = transfers.find((transfer) => transfer.imageUrl)?.imageUrl || imageUrl;
    title = settings?.pageCopy?.transfers?.seoTitle || title;
    description = settings?.pageCopy?.transfers?.seoDescription || description;
  } catch (error) {
    console.error("Error fetching transfer image for metadata:", error);
  }

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/transfer` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/transfer`,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Transfer Fortaleza Tur - Transfers em Fortaleza e Ceará",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function TransferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
