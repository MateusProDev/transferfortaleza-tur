function extractCoordinates(value: string): string | null {
  const exactCoordinates = value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i);
  if (exactCoordinates) {
    const latitude = Number(exactCoordinates[1]);
    const longitude = Number(exactCoordinates[2]);
    if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) return `${latitude},${longitude}`;
  }

  const viewportCoordinates = value.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (viewportCoordinates) {
    const latitude = Number(viewportCoordinates[1]);
    const longitude = Number(viewportCoordinates[2]);
    if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) return `${latitude},${longitude}`;
  }

  return null;
}

export function getGoogleMapsQuery(location: string): string {
  const value = location.trim();
  if (!value) return "";

  const coordinates = extractCoordinates(value);
  if (coordinates) return coordinates;

  try {
    const url = new URL(value);
    const query = url.searchParams.get("query")
      || url.searchParams.get("q")
      || url.searchParams.get("destination")
      || url.searchParams.get("daddr")
      || url.searchParams.get("ll");
    if (query) return query;

    const placeMatch = url.pathname.match(/\/place\/([^/]+)/i);
    if (placeMatch) return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
  } catch {
    // A plain address is also a valid location.
  }

  return value;
}

export function getGoogleMapsEmbedUrl(location: string): string {
  const query = getGoogleMapsQuery(location);
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function getGoogleMapsOpenUrl(location: string): string {
  const query = getGoogleMapsQuery(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
