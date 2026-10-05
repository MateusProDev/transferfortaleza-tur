export const LEADS_ENABLED = false;

export function leadsDisabledResponse() {
  return Response.json({ error: "Sistema de leads desativado" }, { status: 410 });
}
