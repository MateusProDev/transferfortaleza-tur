import { revalidateTag, unstable_cache } from "next/cache";
import type * as Types from "@/types";
import {
  bannerService,
  blogService,
  faqService,
  firebaseService,
  googleReviewsService,
  homeContentService,
  settingsService,
  testimonialService,
} from "@/lib/firestore";
import {
  isTransferPackage,
  mapPackageToTour,
  mapPackageToTransfer,
  toPlainFirestoreValue,
} from "@/lib/firestore-content";

const PUBLIC_DATA_TTL_SECONDS = 24 * 60 * 60;

function restoreDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date(0);
}

function restoreDocumentDates<T extends { createdAt: Date; updatedAt: Date }>(document: T): T {
  return {
    ...document,
    createdAt: restoreDate(document.createdAt),
    updatedAt: restoreDate(document.updatedAt),
  };
}

const getCachedCatalogData = unstable_cache(
  async () => {
    const documents = await firebaseService.getMany<Record<string, unknown>>("pacotes");
    const plainDocuments = documents.map(
      (document) => toPlainFirestoreValue(document) as Record<string, unknown>,
    );
    return {
      tours: plainDocuments
        .filter((item) => !isTransferPackage(item))
        .map((item) => mapPackageToTour(String(item.id), item)),
      transfers: plainDocuments
        .filter(isTransferPackage)
        .map((item) => mapPackageToTransfer(String(item.id), item)),
    };
  },
  ["public-catalog"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["catalog"] }
);

export async function getCachedTours(onlyActive = false): Promise<Types.Tour[]> {
  const { tours } = await getCachedCatalogData();
  return tours
    .map(restoreDocumentDates)
    .filter((tour) => !onlyActive || tour.active)
    .sort((first, second) => {
      if (first.featured !== second.featured) return first.featured ? -1 : 1;
      if (first.featured && second.featured) {
        return (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER);
      }
      return first.name.localeCompare(second.name);
    });
}

export async function getCachedTransfers(onlyActive = false): Promise<Types.Transfer[]> {
  const { transfers } = await getCachedCatalogData();
  return transfers
    .map(restoreDocumentDates)
    .filter((transfer) => !onlyActive || transfer.active)
    .sort((first, second) => first.name.localeCompare(second.name));
}

const getCachedSiteSettingsData = unstable_cache(
  () => settingsService.get(),
  ["site-settings"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["site-settings", "site-content"] }
);

const getCachedBannersData = unstable_cache(
  () => bannerService.getAll(),
  ["public-banners"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["banners"] }
);

const getCachedTestimonialsData = unstable_cache(
  () => testimonialService.getAll(),
  ["public-testimonials"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["testimonials"] }
);

const getCachedGoogleReviewsData = unstable_cache(
  () => googleReviewsService.get(),
  ["public-google-reviews"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["site-content"] }
);

const getCachedHomeSectionsData = unstable_cache(
  () => homeContentService.getSections(),
  ["public-home-sections"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["site-content"] }
);

const getCachedBlogPostsData = unstable_cache(
  () => blogService.getAll(true),
  ["public-blog-posts"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["blog-posts"] }
);

const getCachedFaqContentData = unstable_cache(
  () => faqService.getHomeContent(),
  ["public-home-faq"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["faqs", "site-content"] }
);

const getCachedHomepageSeoData = unstable_cache(
  () => firebaseService.get<Record<string, unknown>>("content", "homeSeo"),
  ["public-home-seo"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["site-content"] }
);

export const getCachedSiteSettings = () => getCachedSiteSettingsData();
export const getCachedBanners = () => getCachedBannersData();
export const getCachedTestimonials = () => getCachedTestimonialsData();
export const getCachedGoogleReviews = () => getCachedGoogleReviewsData();
export const getCachedHomeSections = () => getCachedHomeSectionsData();
export async function getCachedBlogPosts() {
  const posts = await getCachedBlogPostsData();
  return posts.map((post) => ({
    ...restoreDocumentDates(post),
    publishedAt: restoreDate(post.publishedAt),
  }));
}
export const getCachedFaqContent = () => getCachedFaqContentData();
export const getCachedFaqItems = async () => (await getCachedFaqContentData()).faqs;
export const getCachedHomepageSeo = () => getCachedHomepageSeoData();

const getCachedTourByIdData = unstable_cache(
  (id: string) => firebaseService.get<Record<string, unknown>>("pacotes", id),
  ["public-tour-by-id"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["catalog"] }
);

const getCachedTransferByIdData = unstable_cache(
  (id: string) => firebaseService.get<Record<string, unknown>>("pacotes", id),
  ["public-transfer-by-id"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["catalog"] }
);

const getCachedBannerByIdData = unstable_cache(
  (id: string) => bannerService.getById(id),
  ["public-banner-by-id"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["banners"] }
);

const getCachedTestimonialByIdData = unstable_cache(
  (id: string) => testimonialService.getById(id),
  ["public-testimonial-by-id"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: ["testimonials"] }
);

export async function getCachedTourById(id: string) {
  const document = await getCachedTourByIdData(id);
  if (!document || isTransferPackage(document)) return null;
  return mapPackageToTour(id, document);
}

export async function getCachedTransferById(id: string) {
  const document = await getCachedTransferByIdData(id);
  if (!document || !isTransferPackage(document)) return null;
  return mapPackageToTransfer(id, document);
}

export const getCachedBannerById = (id: string) => getCachedBannerByIdData(id);
export const getCachedTestimonialById = (id: string) => getCachedTestimonialByIdData(id);

export function invalidatePublicDataCache(
  ...tags: Array<
    | "catalog"
    | "site-settings"
    | "site-content"
    | "banners"
    | "testimonials"
    | "blog-posts"
    | "faqs"
  >
) {
  for (const tag of tags) revalidateTag(tag);
}
