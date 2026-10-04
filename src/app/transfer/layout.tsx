import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Transfer em Fortaleza e Ceará",
  description: "Reserve transfer em Fortaleza e região com conforto e segurança. Transporte para aeroporto, hotéis e destinos turísticos do Ceará.",
  alternates: { canonical: `${baseUrl}/transfer` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/transfer`,
    title: "Transfer em Fortaleza e Ceará | Passeio Legal",
    description: "Transfer para aeroporto, hotéis e destinos turísticos com conforto e segurança.",
  },
};

export default function TransferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
