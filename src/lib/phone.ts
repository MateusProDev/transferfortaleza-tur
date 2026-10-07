export function normalizeBrazilianPhone(phone: string): string {
  let trimmedPhone = phone.trim();
  let isWhatsAppNumber = false;

  try {
    const url = new URL(trimmedPhone);
    if (url.hostname === "wa.me") {
      trimmedPhone = url.pathname.split("/").filter(Boolean)[0] || "";
      isWhatsAppNumber = true;
    } else if (url.hostname === "api.whatsapp.com") {
      trimmedPhone = url.searchParams.get("phone") || "";
      isWhatsAppNumber = true;
    }
  } catch {
    // The input is a phone number rather than a URL.
  }

  const digits = trimmedPhone.replace(/\D/g, "");

  if (
    digits.startsWith("1")
    && (/^\+1/.test(trimmedPhone) || (isWhatsAppNumber && digits.length === 12))
  ) {
    return `55${digits.slice(1)}`;
  }

  return digits.startsWith("55") ? digits : `55${digits}`;
}
