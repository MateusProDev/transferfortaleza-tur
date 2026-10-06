import type { MetadataRoute } from "next";
import { getCachedBlogPosts, getCachedTours, getCachedTransfers } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/passeios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transfer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
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

  return [...staticPages, ...dynamicPages];
}
