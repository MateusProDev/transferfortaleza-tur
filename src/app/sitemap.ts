import type { MetadataRoute } from "next";
import { getCachedBlogPosts, getCachedTours, getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/passeios`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pacotes`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transfer`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const [tours, transfers, blogPosts] = await Promise.all([
    getCachedTours(true),
    getCachedTransfers(true),
    getCachedBlogPosts(),
  ]);
  const dynamicPages: MetadataRoute.Sitemap = [
    ...blogPosts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...tours.map((tour) => ({
      url: `${baseUrl}/pacote/${tour.slug || tour.id}`,
      lastModified: tour.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...transfers.map((transfer) => ({
      url: `${baseUrl}/pacote/${transfer.slug || transfer.id}`,
      lastModified: transfer.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const uniquePages = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const page of [...staticPages, ...dynamicPages]) {
    uniquePages.set(page.url, page);
  }
  return [...uniquePages.values()];
}
