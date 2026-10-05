import type { MetadataRoute } from "next";
import { blogService, tourService, transferService } from "@/lib/firestore";
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
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [tours, transfers, blogPosts] = await Promise.all([
      tourService.getAll(true),
      transferService.getAll(true),
      blogService.getAll(true),
    ]);

    blogPosts.forEach((post) => {
      if (!post.slug) return;
      dynamicPages.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    tours.forEach((tour) => {
      dynamicPages.push({
        url: `${baseUrl}/passeios/${tour.slug || tour.id}`,
        lastModified: tour.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    transfers.forEach((transfer) => {
      dynamicPages.push({
        url: `${baseUrl}/transfer/${transfer.slug || transfer.id}`,
        lastModified: transfer.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

  } catch (error) {
    console.error("Error fetching dynamic pages for sitemap:", error);
  }

  return [...staticPages, ...dynamicPages];
}
