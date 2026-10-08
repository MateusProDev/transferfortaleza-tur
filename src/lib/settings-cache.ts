import type { SiteSettings } from '@/types';

const SETTINGS_CACHE_KEY = 'passeio_legal_settings_cache';
const SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000;

let cacheVersion = 0;
let pendingSettingsRequest: {
  version: number;
  fetcher: typeof fetch;
  promise: Promise<unknown | null>;
} | null = null;

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
  } catch (error) {
    console.warn('Unable to read cached site settings:', error);
    return null;
  }
}

export function setCachedSettings<T = unknown>(data: T, ttlMs = SETTINGS_CACHE_TTL_MS) {
  if (typeof window === 'undefined') return;

  const entry: SettingsCacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttlMs,
  };

  try {
    window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(entry));
  } catch (error) {
    console.warn('Unable to cache site settings in this browser:', error);
  }
}

export function clearCachedSettings() {
  cacheVersion += 1;
  pendingSettingsRequest = null;
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(SETTINGS_CACHE_KEY);
  } catch (error) {
    console.error("Unable to clear cached site settings:", error);
  }
}

export async function fetchSettingsCached<T = SiteSettings>(fetcher: typeof fetch = fetch): Promise<T | null> {
  const cached = getCachedSettings<T>();
  if (cached !== null) return cached;

  const version = cacheVersion;
  if (
    pendingSettingsRequest?.version === version
    && pendingSettingsRequest.fetcher === fetcher
  ) {
    return pendingSettingsRequest.promise as Promise<T | null>;
  }

  const promise = (async () => {
    const response = await fetcher('/api/settings');
    if (!response.ok) {
      console.error(`Unable to fetch site settings: HTTP ${response.status}`);
      return null;
    }

    const data: unknown = await response.json();
    if (version === cacheVersion) setCachedSettings(data);
    return data;
  })();
  pendingSettingsRequest = { version, fetcher, promise };

  try {
    return await promise as T | null;
  } finally {
    if (pendingSettingsRequest?.promise === promise) {
      pendingSettingsRequest = null;
    }
  }
}
