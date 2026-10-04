"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveTrackingIfNeeded } from '@/lib/tracking/capture';

function TrackingProviderInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const captureTracking = () => {
      if (localStorage.getItem('lgpd_consent') !== 'true') return;

      const data = saveTrackingIfNeeded(new URLSearchParams(searchParams.toString()));
      if (!data) return;

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: data.code,
          gclid: data.gclid,
          utms: data.utms,
          landingPage: data.landingPage,
          userAgent: data.userAgent,
        }),
      }).catch(() => undefined);
    };

    captureTracking();
    window.addEventListener('lgpd-consent-changed', captureTracking);
    return () => window.removeEventListener('lgpd-consent-changed', captureTracking);
  }, []);

  return null;
}

export default function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingProviderInner />
    </Suspense>
  );
}
