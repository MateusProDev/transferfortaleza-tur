import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import TourDetailPage from "@/app/passeios/[id]/page";
import { getCachedTours } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { getHomepageOpenGraphImage, normalizeOpenGraphImage, withBrandSuffix } from "@/lib/open-graph";

interface PageProps {
  params: { slug: string };
}

async function getTour(slug: string) {
  const tours = await getCachedTours(true);
  return tours.find((item) => item.slug === slug || item.id === slug);
}

export const revalidate = 86400;

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const tours = await getCachedTours(true);
  return tours.map((tour) => ({ slug: tour.slug || tour.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tour = await getTour(params.slug);
  if (!tour) {
    return {
      title: "Passeio não encontrado",
      robots: "noindex, nofollow",
    };
  }

  const baseUrl = getSiteUrl();
  const slug = tour.slug || tour.id;
  const canonical = `${baseUrl}/passeios/${slug}`;
  const title = tour.name;
  const description = tour.description;
  const image = tour.mainImageUrl
    ? normalizeOpenGraphImage(tour.mainImageUrl)
    : await getHomepageOpenGraphImage();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      title: withBrandSuffix(title),
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(title),
      description,
      images: [image],
    },
  };
}

export default async function TourSlugPage({ params }: PageProps) {
  const tour = await getTour(params.slug);
  if (!tour) notFound();

  const slug = tour.slug || tour.id;

  // Se o slug não bater, redireciona para o correto
  if (params.slug !== slug) {
    permanentRedirect(`/passeios/${slug}`);
  }

  // Renderiza a página existente usando o ID
  return <TourDetailPage params={{ id: slug }} />;
}
