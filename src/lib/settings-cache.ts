import type { SiteSettings } from '@/types';

const SETTINGS_CACHE_KEY = 'passeio_legal_settings_cache';
const SETTINGS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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

function readCachedSettingsEntry<T = unknown>(): SettingsCacheEntry<T> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SettingsCacheEntry<T>;
    if (!parsed || typeof parsed.expiresAt !== 'number' || parsed.data == null) return null;
    return parsed;
  } catch (error) {
    console.warn('Unable to read cached site settings:', error);
    return null;
  }
}

export function getCachedSettings<T = unknown>(): T | null {
  const cached = readCachedSettingsEntry<T>();
  if (!cached || Date.now() > cached.expiresAt) return null;
  return cached.data;
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
  const stale = readCachedSettingsEntry<T>()?.data ?? null;

  const version = cacheVersion;
  if (
    pendingSettingsRequest?.version === version
    && pendingSettingsRequest.fetcher === fetcher
  ) {
    return pendingSettingsRequest.promise as Promise<T | null>;
  }

  const promise = (async () => {
    let response: Response;
    try {
      response = await fetcher('/api/settings', { cache: 'no-store' });
    } catch (error) {
      if (stale !== null) {
        console.warn('Unable to refresh site settings; using the saved copy:', error);
        return stale;
      }
      throw error;
    }

    if (!response.ok) {
      console.error(`Unable to fetch site settings: HTTP ${response.status}`);
      return stale;
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
