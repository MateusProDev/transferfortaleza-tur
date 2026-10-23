export async function getAdminApiError(
  response: Response,
  fallback: string,
): Promise<Error> {
  const result: unknown = await response.json().catch(() => null);
  const message = result && typeof result === "object" && "error" in result
    && typeof result.error === "string"
    ? result.error
    : `${fallback} (HTTP ${response.status}).`;

  return new Error(message);
}
