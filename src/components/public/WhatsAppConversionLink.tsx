"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

interface WhatsAppConversionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export function isWhatsAppUrl(url: string): boolean {
  return /(^|\/\/)(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(url);
}

export default function WhatsAppConversionLink({
  href,
  children,
  ...props
}: WhatsAppConversionLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
