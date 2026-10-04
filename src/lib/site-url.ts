const officialUrl = "https://www.passeiolegal.com";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (!configuredUrl || configuredUrl.includes("seu-dominio.vercel.app")) {
    return officialUrl;
  }

  return configuredUrl;
}
