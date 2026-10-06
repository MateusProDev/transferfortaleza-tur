import type { Metadata } from "next";
import { getCachedBlogPosts } from "@/lib/public-data-cache";
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

  const title = "Blog de Turismo | Transfer Fortaleza Tur";
  const description = "Dicas para conhecer Fortaleza, o Ceará e os melhores destinos turísticos.";

  return {
    title: "Blog de Turismo em Fortaleza e Ceará",
    description: "Dicas de turismo, praias, passeios e destinos no Ceará para planejar sua próxima viagem com a Transfer Fortaleza Tur.",
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
