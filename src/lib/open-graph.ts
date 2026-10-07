import { BRAND_NAME } from "@/lib/brand";
import { getCachedHomepageSeo } from "@/lib/public-data-cache";

export const DEFAULT_OPEN_GRAPH_IMAGE = "https://transferfortaleza-tur.vercel.app/OG.png";

export function normalizeOpenGraphImage(image: unknown): string {
  if (typeof image !== "string" || !image.trim()) {
    return DEFAULT_OPEN_GRAPH_IMAGE;
  }

  try {
    const url = new URL(image.trim(), DEFAULT_OPEN_GRAPH_IMAGE);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
  } catch {
    return DEFAULT_OPEN_GRAPH_IMAGE;
  }

  return DEFAULT_OPEN_GRAPH_IMAGE;
}

export async function getHomepageOpenGraphImage(): Promise<string> {
  try {
    const homepageSeo = await getCachedHomepageSeo();
    return normalizeOpenGraphImage(homepageSeo?.ogImage);
  } catch (error) {
    console.error("Error fetching homepage Open Graph image:", error);
    return DEFAULT_OPEN_GRAPH_IMAGE;
  }
}

export function stripBrandSuffix(title: string): string {
  return title.replace(new RegExp(`\\s*[|–—-]\\s*${BRAND_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), "").trim();
}

export function withBrandSuffix(title: string): string {
  const cleanTitle = stripBrandSuffix(title);
  return cleanTitle ? `${cleanTitle} | ${BRAND_NAME}` : BRAND_NAME;
}
