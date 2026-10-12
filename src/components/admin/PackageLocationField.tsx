"use client";

import { getGoogleMapsEmbedUrl } from "@/lib/google-maps";

interface PackageLocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PackageLocationField({ value, onChange }: PackageLocationFieldProps) {
  const trimmedValue = value.trim();

  return (
    <div className="space-y-2">
      <label htmlFor="package-location" className="block text-sm font-medium">
        Localização no mapa (opcional)
      </label>
      <input
        id="package-location"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border px-3 py-2"
        placeholder="Digite um endereço ou cole um link do Google Maps"
      />
      <p className="text-sm text-muted-foreground">
        O mapa será exibido na página deste pacote com o marcador do local.
      </p>
      {trimmedValue && (
        <iframe
          title="Prévia do local do pacote"
          src={getGoogleMapsEmbedUrl(trimmedValue)}
          className="h-64 w-full rounded-lg border"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
