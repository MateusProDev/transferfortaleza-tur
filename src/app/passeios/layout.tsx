import type { Metadata } from "next";
import { getCachedSiteSettings, getCachedTours } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { getHomepageOpenGraphImage, normalizeOpenGraphImage, stripBrandSuffix, withBrandSuffix } from "@/lib/open-graph";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let image = "";
  try {
    const tours = await getCachedTours(true);
    image = tours.find((tour) => tour.mainImageUrl)?.mainImageUrl || "";
  } catch (error) {
    console.error("Error fetching a tour image for listing metadata:", error);
  }

  let title = "Passeios em Fortaleza e Ceará";
  let description = "Encontre passeios turísticos em Fortaleza e no Ceará, com roteiros para praias, dunas e destinos inesquecíveis. Consulte disponibilidade e reserve pelo WhatsApp.";
  try {
    const copy = (await getCachedSiteSettings())?.pageCopy?.tours;
    title = copy?.seoTitle || title;
    description = copy?.seoDescription || description;
  } catch (error) {
    console.error("Error fetching tours page copy for metadata:", error);
  }
  title = stripBrandSuffix(title);
  const fullTitle = withBrandSuffix(title);
  const ogImage = image ? normalizeOpenGraphImage(image) : await getHomepageOpenGraphImage();

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/passeios` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/passeios`,
      title: fullTitle,
      description,
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

export default function PasseiosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
