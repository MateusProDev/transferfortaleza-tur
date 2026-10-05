import { getCachedSiteSettings, getCachedTransfers } from '@/lib/public-data-cache';
import type { Transfer } from '@/types';
import TransfersClient from './TransfersClient';

export const revalidate = 300;

export default async function TransfersPage() {
  let transfers: Transfer[] = [];
  let sectionDisabled = false;
  let loadError = false;

  try {
    const [loadedTransfers, settings] = await Promise.all([
      getCachedTransfers(true),
      getCachedSiteSettings(),
    ]);
    transfers = loadedTransfers;
    sectionDisabled = settings?.sections?.transfersEnabled === false;
  } catch (error) {
    console.error('Error fetching transfers page data:', error);
    loadError = true;
  }

  return (
    <TransfersClient
      transfers={transfers}
      sectionDisabled={sectionDisabled}
      loadError={loadError}
    />
  );
}
