import type { Metadata } from "next";
import { defaultContactCopy } from "@/lib/site-copy";
import { getCachedSiteSettings } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const copy = { ...defaultContactCopy, ...settings?.pageCopy?.contact };

  return {
    title: copy.title,
    description: copy.introduction,
    alternates: { canonical: `${baseUrl}/contato` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/contato`,
      title: `${copy.title} | Transfer Fortaleza Tur`,
      description: copy.introduction,
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
