import type { Metadata } from "next";
import { getCachedSiteSettings, getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { getHomepageOpenGraphImage, normalizeOpenGraphImage, stripBrandSuffix, withBrandSuffix } from "@/lib/open-graph";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let imageUrl = "";
  let title = "Transfer em Fortaleza e Ceará";
  let description = "Reserve transfer em Fortaleza e região com conforto e segurança. Transporte para aeroporto, hotéis e destinos turísticos do Ceará.";

  try {
    const [transfers, settings] = await Promise.all([
      getCachedTransfers(true),
      getCachedSiteSettings(),
    ]);
    imageUrl = transfers.find((transfer) => transfer.imageUrl)?.imageUrl || "";
    title = settings?.pageCopy?.transfers?.seoTitle || title;
    description = settings?.pageCopy?.transfers?.seoDescription || description;
  } catch (error) {
    console.error("Error fetching transfer image for metadata:", error);
  }
  title = stripBrandSuffix(title);
  const ogImage = imageUrl ? normalizeOpenGraphImage(imageUrl) : await getHomepageOpenGraphImage();
  const fullTitle = withBrandSuffix(title);

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/transfer` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/transfer`,
      title: fullTitle,
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: ogImage, alt: "Transfers em Fortaleza e Ceará" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export default function TransferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
