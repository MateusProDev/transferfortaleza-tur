import type { Metadata } from "next";
import { getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let imageUrl = `${baseUrl}/OG.png`;

  try {
    const transfers = await getCachedTransfers(true);
    imageUrl = transfers.find((transfer) => transfer.imageUrl)?.imageUrl || imageUrl;
  } catch (error) {
    console.error("Error fetching transfer image for metadata:", error);
  }

  return {
    title: "Transfer em Fortaleza e Ceará",
    description: "Reserve transfer em Fortaleza e região com conforto e segurança. Transporte para aeroporto, hotéis e destinos turísticos do Ceará.",
    alternates: { canonical: `${baseUrl}/transfer` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/transfer`,
      title: "Transfer em Fortaleza e Ceará | Transfer Fortaleza Tur",
      description: "Transfer para aeroporto, hotéis e destinos turísticos com conforto e segurança.",
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
      title: "Transfer em Fortaleza e Ceará | Transfer Fortaleza Tur",
      description: "Transfer para aeroporto, hotéis e destinos turísticos com conforto e segurança.",
      images: [imageUrl],
    },
  };
}

export default function TransferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
