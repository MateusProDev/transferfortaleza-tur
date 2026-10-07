import { getCachedSiteSettings, getCachedTours } from '@/lib/public-data-cache';
import PasseiosClient from './PasseiosClient';
import type { Tour } from '@/types';
import type { SitePageCopy } from '@/types';

export const revalidate = 300;

async function getPageData(): Promise<{
  tours: Tour[];
  sectionDisabled: boolean;
  loadError: boolean;
  copy?: Partial<SitePageCopy>;
}> {
  try {
    const [tours, settings] = await Promise.all([
      getCachedTours(false),
      getCachedSiteSettings(),
    ]);

    return {
      tours,
      sectionDisabled: settings?.sections?.toursEnabled === false,
      loadError: false,
      copy: settings?.pageCopy?.tours,
    };
  } catch (error) {
    console.error('Error fetching tours page data:', error);
    return { tours: [], sectionDisabled: false, loadError: true, copy: undefined };
  }
}

export default async function PasseiosPage() {
  const pageData = await getPageData();
  return <PasseiosClient {...pageData} />;
}
