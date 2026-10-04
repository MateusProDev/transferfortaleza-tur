"use client";

import { useEffect } from 'react';
import { metaPixelEvents } from '@/utils/metaPixel';

interface TourTrackingProps {
  tourName: string;
  tourId: string;
}

export default function TourTracking({ tourName, tourId }: TourTrackingProps) {
  useEffect(() => {
    // Track ViewContent when tour page is loaded
    metaPixelEvents.customEvent('ViewTourDetail', {
      content_name: tourName,
      content_ids: [tourId],
      content_category: 'Tour'
    });
  }, [tourName, tourId]);

  return null; // This component doesn't render anything
}
