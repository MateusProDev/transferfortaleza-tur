import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "./providers";
import "./globals.css";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site-url";
import TrackingProvider from "@/components/TrackingProvider";
import CookieBanner from "@/components/CookieBanner";

const baseUrl = getSiteUrl();
const shouldLoadAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
const googleAdsTagId = `AW-${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || "11405399413"}`;
const googleTagId = process.env.NEXT_PUBLIC_GA_ID || googleAdsTagId;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Passeio Legal - Tours e Transfers",
    template: "%s | Passeio Legal",
  },
  description: "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!",
  keywords: ["tours", "transfers", "travel", "passeios", "turismo", "viagens", "excursões", "passeio legal", "turismo brasil"],
  authors: [{ name: "Passeio Legal" }],
  creator: "Passeio Legal",
  publisher: "Passeio Legal",
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    title: "Passeio Legal - Tours e Transfers",
    description: "Descubra os melhores passeios e transfers",
    siteName: "Passeio Legal",
    images: [
      {
        url: `${baseUrl}/OG.png`,
        width: 1200,
        height: 630,
        alt: "Passeio Legal - Tours e Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passeio Legal",
    description: "Descubra os melhores passeios e transfers",
    images: [`${baseUrl}/OG.png`],
    creator: "@passeiolegal",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

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
      <body className="antialiased">
        {shouldLoadAnalytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-tag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleTagId}');
                ${googleTagId !== googleAdsTagId ? `gtag('config', '${googleAdsTagId}');` : ''}
              `}
            </Script>
          </>
        )}

        {shouldLoadAnalytics && process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel-queue" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        <LocalBusinessJsonLd
          name="Passeio Legal"
          url={baseUrl}
          description="Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região com a Passeio Legal. Experiências únicas de turismo com conforto, segurança e profissionalismo."
          address={{
            street: process.env.NEXT_PUBLIC_BUSINESS_STREET || "Avenida Oceano Atlântico",
            number: process.env.NEXT_PUBLIC_BUSINESS_NUMBER || "683-685",
            neighborhood: process.env.NEXT_PUBLIC_BUSINESS_NEIGHBORHOOD || "Porto das Dunas",
            city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Aquiraz",
            state: process.env.NEXT_PUBLIC_BUSINESS_STATE || "CE",
            zip: process.env.NEXT_PUBLIC_BUSINESS_ZIP || "61700-000",
          }}
          phone={process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+5585997314093"}
          email={process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "passeiolegalfortaleza@gmail.com"}
        />
        <WebSiteJsonLd
          name="Passeio Legal"
          url={baseUrl}
          description="Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região com a Passeio Legal"
        />
        <Suspense fallback={null}>
          <TrackingProvider />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <CookieBanner />
      </body>
    </html>
  );
}
