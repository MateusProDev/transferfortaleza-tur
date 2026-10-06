import { revalidatePath } from "next/cache";
import { invalidatePublicDataCache } from "@/lib/public-data-cache";

export function isValidBlogPost(value: unknown): value is Record<string, unknown> & {
  title: string;
  slug: string;
  summary: string;
  content: string;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const post = value as Record<string, unknown>;
  return typeof post.title === "string" && Boolean(post.title.trim())
    && typeof post.slug === "string" && Boolean(post.slug.trim())
    && typeof post.summary === "string" && Boolean(post.summary.trim())
    && typeof post.content === "string" && Boolean(post.content.trim());
}

export function revalidateBlogPages() {
  invalidatePublicDataCache("blog-posts");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
}
