import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contato e Reservas",
  description: "Entre em contato com a Transfer Fortaleza Tur para reservar passeios e transfers em Fortaleza e região pelo WhatsApp.",
  alternates: { canonical: `${baseUrl}/contato` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/contato`,
    title: "Contato e Reservas | Transfer Fortaleza Tur",
    description: "Fale com a Transfer Fortaleza Tur e reserve seu passeio ou transfer em Fortaleza.",
  },
};

export default function LegacyContactPage() {
  return <ContactPage />;
}
