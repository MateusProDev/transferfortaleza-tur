export function injectTrackingCodeIntoWhatsAppUrl(rawUrl: string, code?: string) {
  if (!code) return rawUrl;

  try {
    const url = new URL(rawUrl);
    const textParam = url.searchParams.get('text');
    const prefix = `🔎 Código de referência: ${code}`;

    if (textParam) {
      const finalText = textParam.includes(prefix) ? textParam : `${prefix}\n\n${textParam}`;
      url.searchParams.set('text', finalText);
      return url.toString();
    }

    return rawUrl;
  } catch {
    if (rawUrl.includes('text=')) {
      const separator = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${separator}text=${encodeURIComponent(`🔎 Código de referência: ${code}`)}`;
    }

    return rawUrl;
  }
}
