import { MapPin } from "lucide-react";
import { getGoogleMapsEmbedUrl, getGoogleMapsOpenUrl } from "@/lib/google-maps";

interface PackageLocationMapProps {
  location: string;
  packageName: string;
}

export default function PackageLocationMap({ location, packageName }: PackageLocationMapProps) {
  if (!location.trim()) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-5 flex items-center gap-2">
          <MapPin aria-hidden="true" className="text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Localização</h2>
        </div>
        <iframe
          title={`Mapa do local de ${packageName}`}
          src={getGoogleMapsEmbedUrl(location)}
          className="h-80 w-full rounded-xl border-0 shadow-md sm:h-96"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={getGoogleMapsOpenUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-medium text-primary-700 hover:text-primary-800"
        >
          <MapPin aria-hidden="true" size={18} className="text-red-600" />
          Abrir no Google Maps
        </a>
      </div>
    </section>
  );
}
