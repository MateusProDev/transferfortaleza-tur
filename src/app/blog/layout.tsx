import type { Metadata } from "next";
import { getCachedBlogPosts, getCachedSiteSettings } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  let image = `${baseUrl}/OG.png`;
  try {
    const posts = await getCachedBlogPosts();
    image = posts.find((post) => post.published && post.imageUrl)?.imageUrl || image;
  } catch (error) {
    console.error("Error fetching a blog image for listing metadata:", error);
  }

  let title = "Blog de Turismo em Fortaleza e Ceará";
  let description = "Dicas de turismo, praias, passeios e destinos no Ceará para planejar sua próxima viagem com a Transfer Fortaleza Tur.";
  try {
    const copy = (await getCachedSiteSettings())?.pageCopy?.blog;
    title = copy?.seoTitle || title;
    description = copy?.seoDescription || description;
  } catch (error) {
    console.error("Error fetching blog page copy for metadata:", error);
  }

  return {
    title,
    alternates: { canonical: `${baseUrl}/blog` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}/blog`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
