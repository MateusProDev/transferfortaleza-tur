"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface AnalyticsProps {
  enabled: boolean;
  googleTagManagerId: string;
  googleAnalyticsId: string;
  googleAdsTagId: string;
  metaPixelId: string;
}

export default function Analytics({
  enabled,
  googleTagManagerId,
  googleAnalyticsId,
  googleAdsTagId,
  metaPixelId,
}: AnalyticsProps) {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);
  const useGoogleTagManager = Boolean(googleTagManagerId);

  useEffect(() => {
    const updateConsent = () => {
      setConsented(localStorage.getItem("lgpd_consent") === "true");
    };

    updateConsent();
    window.addEventListener("lgpd-consent-changed", updateConsent);
    return () => window.removeEventListener("lgpd-consent-changed", updateConsent);
  }, []);

  useEffect(() => {
    if (!enabled || !consented) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

    if (useGoogleTagManager) {
      window.dataLayer.push({ event: "page_view", page_path: pathname });
      return;
    }

    if (googleAnalyticsId || googleAdsTagId) {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [consented, enabled, googleAdsTagId, googleAnalyticsId, pathname, useGoogleTagManager]);

  useEffect(() => {
    if (!enabled || !consented) return;

    const handleWhatsAppClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || !/(^|\/\/)(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(link.href)) return;

      const eventData = {
        link_url: link.href,
        link_text: link.textContent?.trim() || link.getAttribute("aria-label") || "WhatsApp",
      };

      window.dataLayer = window.dataLayer || [];
      if (useGoogleTagManager) {
        window.dataLayer.push({ event: "whatsapp_click", ...eventData });
      } else if (googleAnalyticsId || googleAdsTagId) {
        window.gtag?.("event", "whatsapp_click", eventData);
      }
      window.fbq?.("track", "Contact", eventData);
    };

    document.addEventListener("click", handleWhatsAppClick, true);
    return () => document.removeEventListener("click", handleWhatsAppClick, true);
  }, [consented, enabled, googleAdsTagId, googleAnalyticsId, useGoogleTagManager]);

  if (!enabled || !consented) return null;

  return (
    <>
      {googleTagManagerId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
        </Script>
      )}

      {!googleTagManagerId && (googleAnalyticsId || googleAdsTagId) && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId || googleAdsTagId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-tag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              ${googleAnalyticsId ? `gtag('config', '${googleAnalyticsId}', { send_page_view: false });` : ''}
              ${googleAdsTagId ? `gtag('config', '${googleAdsTagId}');` : ''}
            `}
          </Script>
        </>
      )}

      {metaPixelId && (
        <Script id="meta-pixel-queue" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
