import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import Analytics from "@/components/seo/Analytics";
import { getSiteUrl } from "@/lib/site-url";
import { getCachedHomepageSeo } from "@/lib/public-data-cache";
import { normalizeOpenGraphImage } from "@/lib/open-graph";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { normalizeBrazilianPhone } from "@/lib/phone";

const baseUrl = getSiteUrl();
const shouldLoadAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
const configuredGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
const googleTagManagerId = /^GTM-[A-Z0-9]+$/.test(configuredGtmId) ? configuredGtmId : "";
const configuredGaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";
const googleAnalyticsId = /^G-[A-Z0-9]+$/.test(configuredGaId) ? configuredGaId : "";
const configuredAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID?.trim() || "";
const googleAdsTagId = /^\d+$/.test(configuredAdsId) ? `AW-${configuredAdsId}` : "";
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
const shouldTrackAnalytics = shouldLoadAnalytics
  && Boolean(googleTagManagerId || googleAnalyticsId || googleAdsTagId || metaPixelId);
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const defaultSiteTitle = "Transfer Fortaleza Tur - Passeios e Transfers";
const defaultSiteDescription = "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!";
const defaultSiteKeywords = [
  "tours",
  "transfers",
  "travel",
  "passeios",
  "turismo",
  "viagens",
  "excursões",
  "transfer fortaleza tur",
  "turismo brasil",
];

export async function generateMetadata(): Promise<Metadata> {
  let siteSeo: Record<string, unknown> | null = null;

  try {
    siteSeo = await getCachedHomepageSeo();
  } catch (error) {
    console.error("Error fetching site-wide SEO metadata:", error);
  }

  const title = typeof siteSeo?.title === "string" && siteSeo.title.trim()
    ? siteSeo.title.trim()
    : defaultSiteTitle;
  const description = typeof siteSeo?.description === "string" && siteSeo.description.trim()
    ? siteSeo.description.trim()
    : defaultSiteDescription;
  const keywords = Array.isArray(siteSeo?.keywords)
    ? siteSeo.keywords.filter((keyword): keyword is string => typeof keyword === "string")
    : defaultSiteKeywords;
  const ogImage = normalizeOpenGraphImage(siteSeo?.ogImage);
  const ogImageAlt = typeof siteSeo?.ogImageAlt === "string" && siteSeo.ogImageAlt.trim()
    ? siteSeo.ogImageAlt.trim()
    : title;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Transfer Fortaleza Tur",
    },
    description,
    keywords,
    authors: [{ name: "Transfer Fortaleza Tur" }],
    creator: "Transfer Fortaleza Tur",
    publisher: "Transfer Fortaleza Tur",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title,
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@transferfortalezatur",
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:logo" content={`${baseUrl}/android-icon-192x192.png`} />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${manrope.variable} ${dmSerifDisplay.variable} font-sans antialiased`}>
        <Analytics
          enabled={shouldTrackAnalytics}
          googleTagManagerId={googleTagManagerId}
          googleAnalyticsId={googleAnalyticsId}
          googleAdsTagId={googleAdsTagId}
          metaPixelId={metaPixelId}
        />

        <LocalBusinessJsonLd
          name="Transfer Fortaleza Tur"
          url={baseUrl}
          description="Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região com a Transfer Fortaleza Tur. Experiências únicas de turismo com conforto, segurança e profissionalismo."
          address={{
            street: process.env.NEXT_PUBLIC_BUSINESS_STREET || "Avenida Oceano Atlântico",
            number: process.env.NEXT_PUBLIC_BUSINESS_NUMBER || "683-685",
            neighborhood: process.env.NEXT_PUBLIC_BUSINESS_NEIGHBORHOOD || "Porto das Dunas",
            city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Aquiraz",
            state: process.env.NEXT_PUBLIC_BUSINESS_STATE || "CE",
            zip: process.env.NEXT_PUBLIC_BUSINESS_ZIP || "61700-000",
          }}
          phone={normalizeBrazilianPhone(process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+5585997314093")}
          email={process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "passeiolegalfortaleza@gmail.com"}
          areaServed={["Fortaleza", "Ceará"]}
        />
        <WebSiteJsonLd
          name="Transfer Fortaleza Tur"
          url={baseUrl}
          description="Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região com a Transfer Fortaleza Tur"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
