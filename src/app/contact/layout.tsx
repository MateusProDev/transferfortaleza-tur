import type { Metadata } from "next";
import { defaultContactCopy } from "@/lib/site-copy";
import { getCachedSiteSettings } from "@/lib/public-data-cache";
import { getHomepageOpenGraphImage, stripBrandSuffix, withBrandSuffix } from "@/lib/open-graph";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const copy = { ...defaultContactCopy, ...settings?.pageCopy?.contact };
  const title = stripBrandSuffix(copy.title);
  const image = await getHomepageOpenGraphImage();

  return {
    title,
    description: copy.introduction,
    alternates: { canonical: `${baseUrl}/contato` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/contato`,
      title: withBrandSuffix(title),
      description: copy.introduction,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: image, alt: "Transfer Fortaleza Tur - Passeios e Transfers em Fortaleza" }],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(title),
      description: copy.introduction,
      images: [image],
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
