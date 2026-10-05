import { BRAND_URL } from "@/lib/brand";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configuredUrl?.includes("localhost")) {
    return configuredUrl;
  }

  return BRAND_URL;
}
