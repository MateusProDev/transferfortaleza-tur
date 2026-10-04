import Image from "next/image";
import type { SiteSettings } from "@/types";

type ContentRecord = Record<string, unknown>;

interface HomeConfiguredSectionsProps {
  services: unknown;
  differentials: unknown;
  imageCarousel: unknown;
  transferBeberibe: unknown;
  settings: SiteSettings | null;
}

function asRecord(value: unknown): ContentRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as ContentRecord
    : {};
}

function text(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function items(value: unknown): ContentRecord[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function imageUrl(value: unknown): string {
  if (typeof value === "string") return value;
  const image = asRecord(value);
  return text(image.url, image.image, image.src);
}

function isActive(section: ContentRecord): boolean {
  return section.active !== false;
}

function whatsappHref(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function TransferBeberibeSection({
  value,
  whatsappNumber,
}: {
  value: unknown;
  whatsappNumber: string;
}) {
  const section = asRecord(value);
  if (Object.keys(section).length === 0 || !isActive(section)) return null;

  const blocks = items(section.blocks ?? section.sections);
  const title = text(section.title, section.titulo, section.heading);
  const description = text(section.description, section.descricao, section.subtitle, section.subtitulo);
  const buttonText = text(section.whatsappButtonText, section.botaoWhatsappTexto) || "Consultar pelo WhatsApp";
  const number = text(section.whatsappNumber, whatsappNumber);
  const tripadvisorLink = text(section.tripadvisorLink);
  const contentBlocks = blocks.length > 0
    ? blocks
    : title || description
      ? [{ title, description }]
      : [];

  if (contentBlocks.length === 0 && !tripadvisorLink) return null;

  return (
    <section className="bg-sky-50 py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {contentBlocks.map((block, index) => {
            const blockTitle = text(block.title, block.titulo, block.heading);
            const blockDescription = text(block.description, block.descricao, block.subtitle, block.subtitulo);
            if (!blockTitle && !blockDescription) return null;

            return (
              <div className="mb-6 text-center last:mb-0" key={text(block.id) || `beberibe-${index}`}>
                {blockTitle && <h2 className="mb-3 text-3xl font-bold text-gray-900">{blockTitle}</h2>}
                {blockDescription && <p className="mx-auto max-w-3xl text-gray-700">{blockDescription}</p>}
              </div>
            );
          })}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {number && (
              <a
                href={whatsappHref(number, "Olá! Gostaria de saber mais sobre o Transfer Beberibe.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
              >
                {buttonText}
              </a>
            )}
            {tripadvisorLink && (
              <a
                href={tripadvisorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-400 px-6 py-3 font-semibold text-gray-800 hover:bg-white"
              >
                Ver no TripAdvisor
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeConfiguredSections({
  services: servicesValue,
  differentials: differentialsValue,
  imageCarousel: imageCarouselValue,
  transferBeberibe,
  settings,
}: HomeConfiguredSectionsProps) {
  const services = asRecord(servicesValue);
  const differentials = asRecord(differentialsValue);
  const imageCarousel = asRecord(imageCarouselValue);
  const whatsappNumber = text(settings?.whatsappConfig?.number, settings?.contactInfo?.whatsapp);
  const serviceItems = items(services.services);
  const differentialItems = items(differentials.differentials);
  const gallery = Array.isArray(imageCarousel.images) ? imageCarousel.images : [];
  const collage = asRecord(differentials.collageImages);
  const collageImages = Object.entries(collage)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([id, value]) => ({ id, url: imageUrl(value), alt: text(asRecord(value).alt) }))
    .filter((image) => image.url);

  return (
    <>
      {isActive(services) && serviceItems.length > 0 && (
        <section className="bg-white py-14">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              {text(services.badge) && <p className="mb-2 font-semibold uppercase text-primary-700">{text(services.badge)}</p>}
              <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
                {text(services.title) || "Nossos serviços"}
              </h2>
              {text(services.subtitle) && <p className="mx-auto max-w-2xl text-gray-600">{text(services.subtitle)}</p>}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceItems.map((service, index) => {
                const title = text(service.title);
                const image = text(service.image);
                const link = text(service.link) || whatsappHref(whatsappNumber, `Olá! Gostaria de saber mais sobre ${title}.`);
                return (
                  <article
                    key={text(service.id) || `service-${index}`}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
                    style={service.color ? { borderTopColor: String(service.color), borderTopWidth: 4 } : undefined}
                  >
                    {image && (
                      <div className="relative h-48">
                        <Image src={image} alt={text(service.alt) || title} fill unoptimized sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
                      {text(service.description) && <p className="mb-4 text-gray-600">{text(service.description)}</p>}
                      {link && (
                        <a
                          href={link}
                          target={/^https?:\/\//i.test(link) ? "_blank" : undefined}
                          rel={/^https?:\/\//i.test(link) ? "noopener noreferrer" : undefined}
                          className="font-semibold text-primary-800 hover:text-primary-950"
                        >
                          {text(service.linkText) || "Saiba mais"}
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {isActive(differentials) && differentialItems.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2 lg:items-center">
            <div>
              {text(differentials.badge) && <p className="mb-2 font-semibold uppercase text-primary-700">{text(differentials.badge)}</p>}
              <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
                {text(differentials.title) || "Por que escolher nossos serviços"}
              </h2>
              {text(differentials.description) && <p className="mb-7 text-gray-600">{text(differentials.description)}</p>}
              <div className="grid gap-5 sm:grid-cols-2">
                {differentialItems.map((item, index) => (
                  <article key={text(item.id) || `differential-${index}`} className="rounded-lg bg-white p-5 shadow-sm">
                    {text(item.icon) && <span className="mb-3 block text-2xl text-primary-700">{text(item.icon)}</span>}
                    <h3 className="mb-2 font-semibold text-gray-900">{text(item.title)}</h3>
                    {text(item.description) && <p className="text-sm text-gray-600">{text(item.description)}</p>}
                  </article>
                ))}
              </div>
            </div>
            {collageImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {collageImages.map((image, index) => (
                  <div key={image.id} className={`relative min-h-36 overflow-hidden rounded-xl ${index === 0 ? "row-span-2 min-h-72" : ""}`}>
                    <Image src={image.url} alt={image.alt} fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isActive(imageCarousel) && gallery.length > 0 && (
        <section className="bg-white py-12" aria-label="Galeria de passeios">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto pb-3">
              {gallery.map((value, index) => {
                const image = asRecord(value);
                const url = imageUrl(value);
                if (!url) return null;
                return (
                  <div className="relative h-56 min-w-[75vw] overflow-hidden rounded-xl sm:min-w-[40vw] lg:min-w-[28vw]" key={text(image.id) || `gallery-${index}`}>
                    <Image src={url} alt={text(image.alt) || `Galeria de passeios ${index + 1}`} fill unoptimized sizes="(min-width: 1024px) 28vw, 75vw" className="object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <TransferBeberibeSection value={transferBeberibe} whatsappNumber={whatsappNumber} />
    </>
  );
}
