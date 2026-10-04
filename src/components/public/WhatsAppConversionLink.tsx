"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { parseLeadTrackingFromStorage } from '@/lib/tracking/capture';
import { injectTrackingCodeIntoWhatsAppUrl } from '@/lib/tracking/whatsapp';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface WhatsAppConversionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  trackConversion?: boolean;
}

export function isWhatsAppUrl(url: string): boolean {
  return /(^|\/\/)(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(url);
}

export default function WhatsAppConversionLink({
  href,
  target,
  children,
  onClick,
  trackConversion = true,
  ...props
}: WhatsAppConversionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isWhatsAppUrl(href)) return;

    const isPrimaryClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPrimaryClick) return;

    event.preventDefault();
    onClick?.();

    const tracking = parseLeadTrackingFromStorage();
    const codeFromStorage = tracking?.code || null;
    const finalHref = injectTrackingCodeIntoWhatsAppUrl(href, codeFromStorage || undefined);

    if (codeFromStorage) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          event: 'clicou_whatsapp',
          code: codeFromStorage,
          gclid: tracking?.gclid || null,
          utms: tracking?.utms || {},
          landingPage: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => undefined);
    }

    if (trackConversion) {
      const eventLabel = codeFromStorage || 'lead_sem_codigo';
      const conversionKey = `google_ads_whatsapp_${eventLabel}`;

      if (!window.sessionStorage.getItem(conversionKey)) {
        window.sessionStorage.setItem(conversionKey, '1');

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'contact', {
            method: 'whatsapp',
            value: 1,
            currency: 'BRL',
            event_label: eventLabel,
          });

          window.gtag('event', 'conversion', {
            send_to: 'AW-11405399413/ZmQjCLeD4O0cEPWqwr4q',
            value: 1,
            currency: 'BRL',
            transaction_id: eventLabel,
          });
        }

      }

      if (target === '_blank') {
        window.open(finalHref, '_blank', 'noopener,noreferrer');
        return;
      }

      window.location.href = finalHref;
      return;
    }

    if (target === '_blank') {
      window.open(finalHref, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.href = finalHref;
  };
  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
