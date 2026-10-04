import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Passeios em Fortaleza e Ceará",
  description: "Encontre passeios turísticos em Fortaleza e no Ceará, com roteiros para praias, dunas e destinos inesquecíveis. Consulte disponibilidade e reserve pelo WhatsApp.",
  alternates: { canonical: `${baseUrl}/passeios` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/passeios`,
    title: "Passeios em Fortaleza e Ceará | Passeio Legal",
    description: "Roteiros turísticos para conhecer as melhores praias e destinos do Ceará.",
  },
};

export default function PasseiosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
