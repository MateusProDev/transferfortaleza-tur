"use client";

import { useEffect, useState } from 'react';
import { fetchSettingsCached } from '@/lib/settings-cache';
import { defaultPublicPageCopy } from '@/lib/site-copy';
import type { SitePageCopy } from '@/types';
import EditableHeading, { getHeadingLevel } from '@/components/public/EditableHeading';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [copy, setCopy] = useState<SitePageCopy>(defaultPublicPageCopy.cookie);

  useEffect(() => {
    const consent = localStorage.getItem('lgpd_consent');
    setVisible(consent === null);
    fetchSettingsCached()
      .then((settings) => {
        if (settings?.pageCopy?.cookie) {
          const nextCopy = { ...defaultPublicPageCopy.cookie };
          for (const [key, value] of Object.entries(settings.pageCopy.cookie)) {
            if (typeof value === 'string') nextCopy[key] = value;
          }
          setCopy(nextCopy);
        }
      })
      .catch((error) => {
        console.error('Error loading cookie consent copy:', error);
      });
  }, []);

  const accept = () => {
    localStorage.setItem('lgpd_consent', 'true');
    window.dispatchEvent(new Event('lgpd-consent-changed'));
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('lgpd_consent', 'false');
    window.dispatchEvent(new Event('lgpd-consent-changed'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-700">
          <EditableHeading level={getHeadingLevel(copy, 'title', 'h2')} className="font-semibold text-slate-900">{copy.title}</EditableHeading>
          <p>
            {copy.message}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {copy.refusalMessage}
            <a href="/politica-de-privacidade" className="ml-1 underline hover:text-slate-700">
              {copy.privacyLink}
            </a>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {copy.rejectButton}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-[#0b5d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#094a2f]"
          >
            {copy.acceptButton}
          </button>
        </div>
      </div>
    </div>
  );
}
