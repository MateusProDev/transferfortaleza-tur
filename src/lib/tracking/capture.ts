export type LeadTrackingData = {
  code: string;
  gclid?: string | null;
  utms: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
  };
  landingPage: string;
  userAgent: string;
  timestamp: string;
  consent: boolean;
};

const STORAGE_KEY = 'lead_tracking';
const COOKIE_KEY = 'lead_tracking';
const CONSENT_KEY = 'lgpd_consent';

const isBrowser = () => typeof window !== 'undefined';

export function generateLeadCode(input: string): string {
  const raw = input || `lead-${Date.now()}`;
  let hash = 0;

  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  }

  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let output = '';

  for (let i = 0; i < 6; i += 1) {
    const index = hash % alphabet.length;
    output += alphabet[index];
    hash = Math.floor(hash / alphabet.length);
  }

  return output.toUpperCase();
}

export function getSearchParamsObject(searchParams: URLSearchParams) {
  return {
    gclid: searchParams.get('gclid'),
    utms: {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term'),
    },
    landingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
  };
}

export function parseLeadTrackingFromStorage(): LeadTrackingData | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LeadTrackingData;
  } catch {
    return null;
  }
}

export function setLeadTracking(data: LeadTrackingData) {
  if (!isBrowser()) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax; Secure`;
}

export function getLeadTrackingCookie(): LeadTrackingData | null {
  if (!isBrowser()) return null;

  try {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${COOKIE_KEY}=`));

    if (!cookie) return null;

    const encoded = decodeURIComponent(cookie.split('=')[1]);
    return JSON.parse(encoded) as LeadTrackingData;
  } catch {
    return null;
  }
}

export function hasConsent(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(CONSENT_KEY) === 'true';
}

export function setConsent(value: boolean): void {
  if (!isBrowser()) return;
  localStorage.setItem(CONSENT_KEY, String(value));
}

export function shouldTrackFromUrl(searchParams: URLSearchParams): boolean {
  const existing = parseLeadTrackingFromStorage() || getLeadTrackingCookie();
  const next = getSearchParamsObject(searchParams);

  if (!next.gclid && !Object.values(next.utms).some(Boolean)) {
    return false;
  }

  if (existing && existing.gclid && next.gclid && existing.gclid === next.gclid) {
    return false;
  }

  return true;
}

export function buildLeadTrackingFromUrl(searchParams: URLSearchParams): LeadTrackingData | null {
  if (!isBrowser()) return null;

  const existing = parseLeadTrackingFromStorage() || getLeadTrackingCookie();
  const next = getSearchParamsObject(searchParams);

  if (!next.gclid && !Object.values(next.utms).some(Boolean)) {
    return null;
  }

  if (existing && existing.gclid && next.gclid && existing.gclid === next.gclid) {
    return existing;
  }

  const baseCode = next.gclid || `${JSON.stringify(next.utms)}:${Date.now()}`;

  const payload: LeadTrackingData = {
    code: generateLeadCode(baseCode),
    gclid: next.gclid ?? null,
    utms: next.utms,
    landingPage: next.landingPage,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    consent: true,
  };

  setLeadTracking(payload);
  return payload;
}

export function saveTrackingIfNeeded(searchParams: URLSearchParams) {
  if (!hasConsent()) return null;
  if (!shouldTrackFromUrl(searchParams)) {
    return parseLeadTrackingFromStorage() || getLeadTrackingCookie();
  }

  return buildLeadTrackingFromUrl(searchParams);
}
