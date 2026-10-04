import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contato e Reservas",
  description: "Entre em contato com a Passeio Legal para reservar passeios e transfers em Fortaleza e região pelo WhatsApp.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/contact`,
    title: "Contato e Reservas | Passeio Legal",
    description: "Fale com a Passeio Legal e reserve seu passeio ou transfer em Fortaleza.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
