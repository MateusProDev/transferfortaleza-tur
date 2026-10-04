export const googleAdsConversion = {
  id: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || '11405399413',
  label: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || 'ZmQjCLeD4O0cEPWqwr4q',
  name: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_NAME || 'Lead WhatsApp - Passeios',
};

export function trackGoogleAdsLead({
  conversionId = googleAdsConversion.id,
  conversionLabel = googleAdsConversion.label,
  value = 0,
  transactionId,
}: {
  conversionId?: string;
  conversionLabel?: string;
  value?: number;
  transactionId?: string;
} = {}) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  const conversionData = {
    send_to: `${conversionId}/${conversionLabel}`,
    value,
    currency: 'BRL',
    ...(transactionId ? { transaction_id: transactionId } : {}),
  };

  if (typeof win.gtag === 'function') {
    win.gtag('event', 'contact', {
      method: 'whatsapp',
      value,
      currency: 'BRL',
      event_label: transactionId || 'lead_sem_codigo',
    });

    win.gtag('event', 'conversion', conversionData);
    return;
  }

  const img = new Image(1, 1);
  img.src = `https://www.googleadservices.com/pagead/conversion/${conversionId}/?label=${encodeURIComponent(conversionLabel)}&guid=ON&script=0&value=${value}`;
}
