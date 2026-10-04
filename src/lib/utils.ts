import { z } from "zod";

// Validation Schemas
export const bannerSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional(),
  imageUrl: z.string().url("URL da imagem inválida"),
  imageAlt: z.string().min(1, "Alt text é obrigatório"),
  buttonText: z.string().min(1, "Texto do botão é obrigatório"),
  buttonLink: z.string().url("URL do botão inválida"),
  order: z.number().int().min(0),
  active: z.boolean(),
});

export const tourSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  longDescription: z.string().optional(),
  mainImageUrl: z.string().url("URL da imagem inválida"),
  mainImageAlt: z.string().min(1, "Alt text é obrigatório"),
  galleryImages: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string(),
      order: z.number().int(),
    })
  ),
  price: z.number().positive("Preço deve ser maior que zero"),
  duration: z.string().min(1, "Duração é obrigatória"),
  includesItems: z.array(z.string()),
  excludesItems: z.array(z.string()),
  featured: z.boolean(),
  active: z.boolean(),
});

export const transferSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrl: z.string().url("URL da imagem inválida"),
  imageAlt: z.string().min(1, "Alt text é obrigatório"),
  price: z.number().positive("Preço deve ser maior que zero"),
  vehicleType: z.string().min(1, "Tipo de veículo é obrigatório"),
  capacity: z.number().int().positive("Capacidade deve ser maior que zero"),
  active: z.boolean(),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Nome é obrigatório"),
  clientPhoto: z.string().url("URL da foto inválida"),
  clientPhotoAlt: z.string().min(1, "Alt text é obrigatório"),
  text: z.string().min(10, "Depoimento deve ter pelo menos 10 caracteres"),
  rating: z.number().int().min(1).max(5),
  active: z.boolean(),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  summary: z.string().min(10, "Resumo deve ter pelo menos 10 caracteres"),
  content: z.string().min(50, "Conteúdo deve ter pelo menos 50 caracteres"),
  imageUrl: z.string().url("URL da imagem inválida"),
  imageAlt: z.string().min(1, "Alt text é obrigatório"),
  author: z.string().optional(),
  published: z.boolean(),
  publishedAt: z.date().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(5, "Pergunta deve ter pelo menos 5 caracteres"),
  answer: z.string().min(10, "Resposta deve ter pelo menos 10 caracteres"),
  order: z.number().int().min(0),
  active: z.boolean(),
});

// Formatting utilities
export function formatPrice(price: number, locale = "pt-BR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function formatDate(date: Date, locale = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDatetime(date: Date, locale = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// String utilities
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateSlug(title: string): string {
  return slugify(title);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// URL utilities
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function buildShareUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string>
): string {
  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
}

// Array utilities
export function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Rating/Stars utilities
export function getStarArray(rating: number): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

// Object utilities
export function omit<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

// Error handling
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Retry logic
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Retry failed");
}
