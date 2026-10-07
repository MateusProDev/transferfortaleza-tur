import type { Metadata } from "next";
import { getCachedSiteSettings } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { getHomepageOpenGraphImage, stripBrandSuffix, withBrandSuffix } from "@/lib/open-graph";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let title = "Blog de Turismo em Fortaleza e Ceará";
  let description = "Dicas de turismo, praias, passeios e destinos no Ceará para planejar sua próxima viagem com a Transfer Fortaleza Tur.";
  try {
    const copy = (await getCachedSiteSettings())?.pageCopy?.blog;
    title = copy?.seoTitle || title;
    description = copy?.seoDescription || description;
  } catch (error) {
    console.error("Error fetching blog page copy for metadata:", error);
  }
  title = stripBrandSuffix(title);
  const fullTitle = withBrandSuffix(title);
  const ogImage = await getHomepageOpenGraphImage();

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/blog` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/blog`,
      title: fullTitle,
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
