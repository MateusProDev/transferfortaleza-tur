import { BRAND_URL } from "@/lib/brand";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!configuredUrl) return BRAND_URL;

  try {
    const url = new URL(configuredUrl);
    const isLocalhost = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"].includes(url.hostname);
    if (isLocalhost) return BRAND_URL;
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
    }

    return url.origin;
  } catch (error) {
    console.error("Invalid NEXT_PUBLIC_APP_URL; using the configured brand URL:", error);
    return BRAND_URL;
  }
}
