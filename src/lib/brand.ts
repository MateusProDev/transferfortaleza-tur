export const BRAND_NAME = "Transfer Fortaleza Tur";
export const BRAND_SLUG = "transferfortalezatur";
export const BRAND_URL = "https://transferfortalezatur.com.br";

export function replaceLegacyBrand(value: string): string {
  return value
    .replace(/Passeio Legal/gi, BRAND_NAME)
    .replace(/passeio-legal/gi, "transfer-fortaleza-tur")
    .replace(/https?:\/\/(?:www\.)?passeiolegal\.com/gi, BRAND_URL);
}
