import { tourService, settingsService } from '@/lib/firestore';
import PasseiosClient from './PasseiosClient';
import type { Tour } from '@/types';

export const revalidate = 300;

async function getPageData(): Promise<{ tours: Tour[]; sectionDisabled: boolean; loadError: boolean }> {
  try {
    const [tours, settings] = await Promise.all([
      tourService.getAll(false),
      settingsService.get(),
    ]);

    return {
      tours,
      sectionDisabled: settings?.sections?.toursEnabled === false,
      loadError: false,
    };
  } catch (error) {
    console.error('Error fetching tours page data:', error);
    return { tours: [], sectionDisabled: false, loadError: true };
  }
}

export default async function PasseiosPage() {
  const pageData = await getPageData();
  return <PasseiosClient {...pageData} />;
}
