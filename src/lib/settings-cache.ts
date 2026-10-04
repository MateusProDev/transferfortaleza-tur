import type { SiteSettings } from '@/types';

const SETTINGS_CACHE_KEY = 'passeio_legal_settings_cache';
const SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000;

export type SettingsCacheEntry<T> = {
  data: T;
  expiresAt: number;
};

export function getCachedSettings<T = unknown>(): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SettingsCacheEntry<T>;
    if (!parsed || typeof parsed.expiresAt !== 'number') return null;

    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(SETTINGS_CACHE_KEY);
      return null;
    }

    return parsed.data ?? null;
  } catch {
    return null;
  }
}

export function setCachedSettings<T = unknown>(data: T, ttlMs = SETTINGS_CACHE_TTL_MS) {
  if (typeof window === 'undefined') return;

  const entry: SettingsCacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttlMs,
  };

  window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(entry));
}

export async function fetchSettingsCached<T = SiteSettings>(fetcher: typeof fetch = fetch): Promise<T | null> {
  const cached = getCachedSettings<T>();
  if (cached) return cached;

  const response = await fetcher('/api/settings');
  if (!response.ok) return null;

  const data = (await response.json()) as T;
  setCachedSettings(data);
  return data;
}
