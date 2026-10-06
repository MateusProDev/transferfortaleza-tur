import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teste de GCLID",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TesteGclidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
