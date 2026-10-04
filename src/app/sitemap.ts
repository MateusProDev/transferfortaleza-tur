import type { MetadataRoute } from "next";
import { adminDb } from "@/lib/firebase-admin";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

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
    if (adminDb) {
      const blogSnapshot = await adminDb
        .collection("blog")
        .where("published", "==", true)
        .get();

      blogSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.slug) return;
        dynamicPages.push({
          url: `${baseUrl}/blog/${data.slug}`,
          lastModified: data.updatedAt?.toDate?.() ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      });

      const toursSnapshot = await adminDb
        .collection("tours")
        .where("active", "==", true)
        .get();

      toursSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        dynamicPages.push({
          url: `${baseUrl}/passeios/${data.slug || doc.id}`,
          lastModified: data.updatedAt?.toDate?.() ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        });
      });

      const transfersSnapshot = await adminDb
        .collection("transfers")
        .where("active", "==", true)
        .get();

      transfersSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        dynamicPages.push({
          url: `${baseUrl}/transfer/${data.slug || doc.id}`,
          lastModified: data.updatedAt?.toDate?.() ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching dynamic pages for sitemap:", error);
  }

  return [...staticPages, ...dynamicPages];
}
