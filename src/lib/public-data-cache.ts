import { revalidateTag, unstable_cache } from "next/cache";
import { settingsService, tourService, transferService } from "@/lib/firestore";

export const getCachedSiteSettings = unstable_cache(
  () => settingsService.get(),
  ["site-settings"],
  { revalidate: 300, tags: ["site-settings"] }
);

export const getCachedTours = unstable_cache(
  (onlyActive = false) => tourService.getAll(onlyActive),
  ["tours"],
  { revalidate: 300, tags: ["tours"] }
);

export const getCachedTransfers = unstable_cache(
  (onlyActive = false) => transferService.getAll(onlyActive),
  ["transfers"],
  { revalidate: 300, tags: ["transfers"] }
);

export function invalidatePublicDataCache(tag: "site-settings" | "tours" | "transfers") {
  revalidateTag(tag);
}
