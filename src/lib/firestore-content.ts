import type { Banner, BlogPost, FAQ, GalleryImage, GoogleReviewsContent, SiteSettings, Testimonial, Tour, TourFAQ, Transfer } from "@/types";

type FirestoreDocument = Record<string, unknown>;
type CatalogKind = "tour" | "transfer";

function asDocument(value: unknown): FirestoreDocument {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as FirestoreDocument)
    : {};
}

export function toPlainFirestoreValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toPlainFirestoreValue);

  if (value && typeof value === "object" && "toDate" in value) {
    const convert = (value as { toDate?: unknown }).toDate;
    if (typeof convert === "function") {
      const date = convert.call(value);
      if (date instanceof Date && !Number.isNaN(date.getTime())) return date.toISOString();
    }
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toPlainFirestoreValue(item)]),
    );
  }

  return value;
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      const record = asDocument(item);
      return firstString(record.name, record.nome, record.title, record.titulo, record.text, record.value, record.url);
    })
    .filter(Boolean);
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;

  const parsed = Number(value.trim().replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function minimumVehiclePrice(value: unknown): number | undefined {
  const prices = Array.isArray(value) ? value : Object.values(asDocument(value));
  const numericPrices = prices
    .map((item) => {
      const record = asDocument(item);
      return asNumber(record.price ?? record.preco ?? record.valor ?? item);
    })
    .filter((price): price is number => price !== undefined && price >= 0);

  return numericPrices.length > 0 ? Math.min(...numericPrices) : undefined;
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const convert = (value as { toDate?: unknown }).toDate;
    if (typeof convert === "function") {
      const date = convert.call(value);
      if (date instanceof Date && !Number.isNaN(date.getTime())) return date;
    }
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date(0);
}

function toBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return defaultValue;
}

function sourceImages(record: FirestoreDocument): GalleryImage[] {
  const images = Array.isArray(record.imagens)
    ? record.imagens
    : Array.isArray(record.galleryImages)
      ? record.galleryImages
      : [];
  const alts = asStrings(record.imagensAlt);

  return images.flatMap((image, index) => {
    const imageRecord = asDocument(image);
    const url = typeof image === "string"
      ? image.trim()
      : firstString(imageRecord.url, imageRecord.imagem, imageRecord.src, imageRecord.imageUrl);
    if (!url) return [];

    return [{
      id: firstString(imageRecord.id) || `image-${index}`,
      url,
      alt: firstString(imageRecord.alt, imageRecord.imagemAlt, alts[index]),
      order: index,
    }];
  });
}

function sourceFaqs(value: unknown): TourFAQ[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const record = asDocument(item);
    const question = firstString(record.question, record.pergunta);
    const answer = firstString(record.answer, record.resposta);
    return question && answer ? [{ question, answer }] : [];
  });
}

function sourceRecommendations(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => typeof item === "string" ? item : firstString(asDocument(item).id)).filter(Boolean)
    : [];
}

function packageIsActive(record: FirestoreDocument): boolean {
  const active = record.ativo ?? record.active;
  return toBoolean(active, true);
}

export function isTransferPackage(value: unknown): boolean {
  const record = asDocument(value);
  const categories = [
    ...asStrings(Array.isArray(record.categoria) ? record.categoria : [record.categoria]),
    ...asStrings(record.categorias),
    firstString(record.tipo),
  ]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const hasVehiclePricing = minimumVehiclePrice(record.precoPorVeiculo) !== undefined;
  const hasVehicles = Array.isArray(record.veiculos) && record.veiculos.length > 0;
  const hasServedLocations = Array.isArray(record.locaisAtendidos) && record.locaisAtendidos.length > 0;

  return /\btransfer(?:s)?\b/.test(categories)
    || /\btransporte\b/.test(categories)
    || hasVehiclePricing
    || hasVehicles
    || toBoolean(record.isIdaEVolta)
    || hasServedLocations;
}

export function mapPackageToTour(id: string, value: unknown): Tour {
  const record = asDocument(value);
  const images = sourceImages(record);
  const mainImageUrl = firstString(record.imagem, record.mainImageUrl, images[0]?.url);
  const mainImageAlt = firstString(
    record.imagemAlt,
    record.mainImageAlt,
    asStrings(record.imagensAlt)[0],
    images[0]?.alt,
  );
  const description = firstString(record.descricaoCurta, record.description, record.descricao);
  const longDescription = firstString(record.descricao, record.longDescription, description);
  const featured = toBoolean(record.destaque ?? record.featured);
  const price = asNumber(record.preco ?? record.price) ?? minimumVehiclePrice(record.precoPorVeiculo) ?? 0;
  const galleryImages = images.filter((image) => image.url !== mainImageUrl);
  const includesItems = [...new Set([...asStrings(record.comodidades), ...asStrings(record.vantagens)])];

  return {
    ...record,
    id,
    slug: firstString(record.slug) || undefined,
    order: asNumber(record.ordem ?? record.order),
    recommendedTourIds: sourceRecommendations(record.pacotesRecomendados ?? record.recommendedTourIds),
    faqs: sourceFaqs(record.faq ?? record.faqs),
    name: firstString(record.titulo, record.name) || "Pacote",
    description,
    longDescription,
    mainImageUrl,
    mainImageAlt,
    galleryImages,
    price,
    duration: firstString(record.duracao, record.duration),
    includesItems,
    excludesItems: asStrings(record.exclusoes ?? record.excludesItems),
    featured,
    active: packageIsActive(record),
    createdAt: toDate(record.createdAt),
    updatedAt: toDate(record.updatedAt),
  } as Tour;
}

export function mapPackageToTransfer(id: string, value: unknown): Transfer {
  const record = asDocument(value);
  const images = sourceImages(record);
  const mainImageUrl = firstString(record.imagem, record.imageUrl, record.mainImageUrl, images[0]?.url);
  const mainImageAlt = firstString(
    record.imagemAlt,
    record.imageAlt,
    record.mainImageAlt,
    asStrings(record.imagensAlt)[0],
    images[0]?.alt,
  );
  const description = firstString(record.descricaoCurta, record.description, record.descricao);
  const vehicleRecords = Array.isArray(record.veiculos) ? record.veiculos.map(asDocument) : [];
  const capacities = vehicleRecords
    .map((vehicle) => asNumber(vehicle.capacidade ?? vehicle.capacity ?? vehicle.lugares))
    .filter((capacity): capacity is number => capacity !== undefined);
  const vehicleNames = vehicleRecords.length > 0
    ? vehicleRecords.map((vehicle) => firstString(vehicle.nome, vehicle.name, vehicle.modelo, vehicle.tipo)).filter(Boolean)
    : asStrings(record.veiculos);
  const featured = toBoolean(record.destaque ?? record.featuredOnHome ?? record.featured);
  const galleryImages = images.filter((image) => image.url !== mainImageUrl);

  return {
    ...record,
    id,
    slug: firstString(record.slug) || undefined,
    order: asNumber(record.ordem ?? record.order),
    recommendedTransferIds: sourceRecommendations(record.pacotesRecomendados ?? record.recommendedTransferIds),
    featuredOnHome: featured,
    name: firstString(record.titulo, record.name) || "Transfer",
    description,
    longDescription: firstString(record.descricao, record.longDescription, description),
    imageUrl: mainImageUrl,
    imageAlt: mainImageAlt,
    galleryImages,
    includesItems: [...new Set([...asStrings(record.comodidades), ...asStrings(record.vantagens)])],
    excludesItems: asStrings(record.exclusoes ?? record.excludesItems),
    faqs: sourceFaqs(record.faq ?? record.faqs),
    price: minimumVehiclePrice(record.precoPorVeiculo) ?? asNumber(record.preco ?? record.price),
    vehicleType: vehicleNames.join(", "),
    capacity: asNumber(record.capacidade ?? record.capacity) ?? Math.max(0, ...capacities),
    active: packageIsActive(record),
    createdAt: toDate(record.createdAt),
    updatedAt: toDate(record.updatedAt),
  } as Transfer;
}

function has(input: FirestoreDocument, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined;
}

export function mapCatalogInputToPackage(value: object, kind: CatalogKind, isCreate = false): FirestoreDocument {
  const input = Object.assign({}, value) as FirestoreDocument;
  const result: FirestoreDocument = {};
  const copy = (inputKey: string, outputKey: string, transform: (value: unknown) => unknown = (item) => item) => {
    if (has(input, inputKey)) result[outputKey] = transform(input[inputKey]);
  };

  copy("name", "titulo");
  copy("slug", "slug");
  copy("description", "descricaoCurta");
  copy("longDescription", "descricao");
  copy("duration", "duracao");
  copy("price", "preco");
  copy("includesItems", "comodidades");
  copy("excludesItems", "exclusoes");
  copy("active", "ativo");
  copy("order", "ordem");
  copy("faqs", "faq", (items) => Array.isArray(items)
    ? items.map((item) => {
        const faq = asDocument(item);
        return { pergunta: firstString(faq.question, faq.pergunta), resposta: firstString(faq.answer, faq.resposta) };
      })
    : []);

  const featuredKey = kind === "transfer" && has(input, "featuredOnHome") ? "featuredOnHome" : "featured";
  if (has(input, featuredKey)) result.destaque = input[featuredKey];
  else if (kind === "transfer") copy("featuredOnHome", "destaque");

  const recommendationsKey = kind === "transfer" ? "recommendedTransferIds" : "recommendedTourIds";
  copy(recommendationsKey, "pacotesRecomendados");

  const imageInputKey = kind === "transfer" ? "imageUrl" : "mainImageUrl";
  const imageAltInputKey = kind === "transfer" ? "imageAlt" : "mainImageAlt";
  if (has(input, imageInputKey) || has(input, "galleryImages")) {
    const images = Array.isArray(input.galleryImages) ? input.galleryImages : [];
    const mainImageUrl = firstString(input[imageInputKey], asDocument(images[0]).url);
    const remainingImages = images
      .map((image) => asDocument(image))
      .filter((image) => firstString(image.url) && image.url !== mainImageUrl);
    result.imagens = [
      ...(mainImageUrl ? [mainImageUrl] : []),
      ...remainingImages.map((image) => firstString(image.url)),
    ];
    result.imagensAlt = [
      firstString(input[imageAltInputKey], asDocument(images[0]).alt),
      ...remainingImages.map((image) => firstString(image.alt)),
    ];
  }

  if (kind === "transfer") {
    if (has(input, "vehicleType")) result.veiculos = asStrings([input.vehicleType]);
    copy("capacity", "capacidade");
    if (isCreate) {
      result.categoria = "transfer";
      result.categorias = ["transfer"];
    }
  } else if (isCreate) {
    result.categoria = "passeio";
    result.categorias = ["passeio"];
  }

  return result;
}

export function mapBannerDocument(id: string, value: unknown): Banner {
  const record = asDocument(value);

  return {
    ...record,
    id,
    title: firstString(record.titulo, record.title),
    subtitle: firstString(record.subtitulo, record.subtitle),
    description: firstString(record.descricao, record.description),
    location: firstString(record.localizacao, record.location),
    imageUrl: firstString(record.imagem, record.imageUrl),
    imageAlt: firstString(record.imagemAlt, record.imageAlt),
    buttonText: firstString(record.botaoTexto, record.buttonText),
    buttonLink: firstString(record.botaoLink, record.buttonLink),
    secondaryButtonText: firstString(record.botaoSecundarioTexto, record.secondaryButtonText),
    secondaryButtonLink: firstString(record.botaoSecundarioLink, record.secondaryButtonLink),
    order: asNumber(record.ordem ?? record.order) ?? Number.MAX_SAFE_INTEGER,
    active: toBoolean(record.ativo ?? record.active),
    createdAt: toDate(record.createdAt),
    updatedAt: toDate(record.updatedAt),
  } as Banner;
}

export function mapBannerInputToDocument(value: object): FirestoreDocument {
  const input = Object.assign({}, value) as FirestoreDocument;
  const result: FirestoreDocument = {};
  const fields: Array<[string, string]> = [
    ["title", "titulo"],
    ["subtitle", "subtitulo"],
    ["description", "descricao"],
    ["location", "localizacao"],
    ["imageUrl", "imagem"],
    ["imageAlt", "imagemAlt"],
    ["buttonText", "botaoTexto"],
    ["buttonLink", "botaoLink"],
    ["secondaryButtonText", "botaoSecundarioTexto"],
    ["secondaryButtonLink", "botaoSecundarioLink"],
    ["order", "ordem"],
    ["active", "ativo"],
  ];

  for (const [inputKey, outputKey] of fields) {
    if (has(input, inputKey)) result[outputKey] = input[inputKey];
  }

  return result;
}

export function mapHomeFaqDocument(value: unknown): FAQ[] {
  const record = asDocument(value);
  const entries = Array.isArray(record.faq) ? record.faq : [];

  return entries.flatMap((item, index) => {
    const faq = asDocument(item);
    const question = firstString(faq.pergunta, faq.question);
    const answer = firstString(faq.resposta, faq.answer);
    return question && answer
      ? [{
          id: firstString(faq.id) || `home-faq-${index}`,
          question,
          answer,
          order: index,
          active: true,
          createdAt: toDate(record.updatedAt),
          updatedAt: toDate(record.updatedAt),
        }]
      : [];
  });
}

export function mapGoogleReviewsDocument(value: unknown): GoogleReviewsContent {
  const record = asDocument(value);
  const reviews = Array.isArray(record.reviews)
    ? record.reviews.flatMap((item, index) => {
        const review = asDocument(item);
        const name = firstString(review.name);
        const text = firstString(review.text);
        if (!name || !text) return [];

        const dateValue = review.date;
        const date = typeof dateValue === "string"
          ? dateValue
          : dateValue
            ? toDate(dateValue).toLocaleDateString("pt-BR")
            : "";

        return [{
          id: firstString(review.id) || `google-review-${index}`,
          name,
          photo: firstString(review.photo),
          photoAlt: firstString(review.photoAlt),
          rating: Math.min(5, Math.max(0, asNumber(review.rating) ?? 5)),
          text,
          date,
        }];
      })
    : [];

  return {
    active: toBoolean(record.active),
    title: firstString(record.title),
    subtitle: firstString(record.subtitle),
    badge: firstString(record.badge),
    autoplay: toBoolean(record.autoplay),
    autoplayDelay: Math.max(1000, asNumber(record.autoplayDelay) ?? 6000),
    googleUrl: firstString(record.googleUrl),
    reviews,
  };
}

export function mapTestimonialDocument(id: string, value: unknown): Testimonial {
  const record = asDocument(value);

  return {
    ...record,
    id,
    clientName: firstString(record.nomeCliente, record.clientName),
    clientPhoto: firstString(record.fotoCliente, record.clientPhoto),
    clientPhotoAlt: firstString(record.fotoClienteAlt, record.clientPhotoAlt),
    text: firstString(record.comentario, record.text),
    rating: asNumber(record.nota ?? record.rating) ?? 5,
    destination: firstString(record.destino, record.destination),
    active: toBoolean(record.ativo ?? record.active, true),
    createdAt: toDate(record.createdAt),
    updatedAt: toDate(record.updatedAt),
  } as Testimonial;
}

export function mapBlogPostDocument(id: string, value: unknown): BlogPost {
  const record = asDocument(value);

  return {
    ...record,
    id,
    title: firstString(record.title, record.titulo),
    slug: firstString(record.slug),
    summary: firstString(record.excerpt, record.summary, record.descricaoCurta),
    content: firstString(record.content, record.conteudo),
    imageUrl: firstString(record.featuredImage, record.imageUrl, record.imagem),
    imageAlt: firstString(record.featuredImageAlt, record.imageAlt, record.imagemAlt),
    author: firstString(record.author, record.autor),
    views: asNumber(record.views) ?? 0,
    published: toBoolean(record.published ?? record.publicado),
    publishedAt: toDate(record.publishedAt ?? record.createdAt),
    createdAt: toDate(record.createdAt),
    updatedAt: toDate(record.updatedAt),
  } as BlogPost;
}

export function mapTestimonialInputToDocument(value: object): FirestoreDocument {
  const input = Object.assign({}, value) as FirestoreDocument;
  const result: FirestoreDocument = {};
  const fields: Array<[string, string]> = [
    ["clientName", "nomeCliente"],
    ["clientPhoto", "fotoCliente"],
    ["clientPhotoAlt", "fotoClienteAlt"],
    ["text", "comentario"],
    ["rating", "nota"],
    ["destination", "destino"],
    ["active", "ativo"],
  ];

  for (const [inputKey, outputKey] of fields) {
    if (has(input, inputKey)) result[outputKey] = input[inputKey];
  }

  return result;
}

export function mapBlogPostInputToDocument(value: object): FirestoreDocument {
  const input = Object.assign({}, value) as FirestoreDocument;
  const result: FirestoreDocument = {};
  const fields: Array<[string, string]> = [
    ["title", "title"],
    ["slug", "slug"],
    ["summary", "excerpt"],
    ["content", "content"],
    ["imageUrl", "featuredImage"],
    ["imageAlt", "featuredImageAlt"],
    ["author", "author"],
    ["published", "published"],
    ["publishedAt", "publishedAt"],
    ["views", "views"],
    ["category", "category"],
    ["tags", "tags"],
    ["seo", "seo"],
  ];

  for (const [inputKey, outputKey] of fields) {
    if (has(input, inputKey)) result[outputKey] = input[inputKey];
  }

  return result;
}

export function mapSiteSettings(
  settingsValue: unknown,
  whatsappValue: unknown,
  headerValue: unknown,
  footerValue: unknown,
  seoValue: unknown,
): SiteSettings | null {
  const settings = asDocument(settingsValue);
  const whatsapp = asDocument(whatsappValue);
  const header = asDocument(headerValue);
  const footer = asDocument(footerValue);
  const seo = asDocument(seoValue);

  if (![settingsValue, whatsappValue, headerValue, footerValue, seoValue].some(Boolean)) return null;

  const oldContact = asDocument(settings.contactInfo);
  const footerContact = asDocument(footer.contact);
  const footerLinks = Array.isArray(footer.quickLinks)
    ? footer.quickLinks
      .map((value, index) => {
        const link = asDocument(value);
        const url = firstString(link.url, link.href);
        const label = firstString(link.label, link.title);
        return url && label
          ? {
              id: firstString(link.id) || `footer-link-${index}`,
              label,
              url,
              active: link.active !== false,
            }
          : null;
      })
      .filter((link): link is NonNullable<typeof link> => Boolean(link))
    : [];
  const oldWhatsappConfig = asDocument(settings.whatsappConfig);
  const oldSeo = asDocument(settings.seoSettings);
  const sections = asDocument(settings.sections);
  const socialSource = footer.social;
  const socialRecords: FirestoreDocument[] = Array.isArray(socialSource)
    ? socialSource.map((item) => asDocument(item))
    : Object.entries(asDocument(socialSource)).map(([platform, item]) =>
        Object.assign({ platform }, asDocument(item))
      );
  const socialLinks = socialRecords.flatMap((item, index) => {
    const platform = firstString(item.platform, item.name, item.network).toLowerCase();
    const normalizedPlatform = platform === "facebook" || platform === "instagram"
      || platform === "whatsapp" || platform === "youtube" || platform === "twitter"
      ? platform
      : null;
    const url = firstString(item.link, item.url, item.href);
    return normalizedPlatform && url
      ? [{ id: firstString(item.id) || `social-${index}`, platform: normalizedPlatform, url, icon: firstString(item.icon) || undefined }]
      : [];
  });

  return {
    ...settings,
    id: firstString(settings.id) || "site",
    headerLogo: firstString(header.logoUrl, settings.headerLogo),
    headerLogoAlt: firstString(header.logoAlt, settings.headerLogoAlt),
    menuLinks: Array.isArray(settings.menuLinks) ? settings.menuLinks as SiteSettings["menuLinks"] : [],
    footerLinks,
    footerLogo: firstString(footer.logoUrl, settings.footerLogo, header.logoUrl),
    footerLogoAlt: firstString(footer.logoAlt, settings.footerLogoAlt, header.logoAlt),
    socialLinks: socialLinks.length > 0
      ? socialLinks
      : Array.isArray(settings.socialLinks) ? settings.socialLinks as SiteSettings["socialLinks"] : [],
    contactInfo: {
      email: firstString(footerContact.email, oldContact.email),
      phone: firstString(footerContact.phone, oldContact.phone),
      whatsapp: firstString(whatsapp.number, oldWhatsappConfig.number, oldContact.whatsapp),
      address: firstString(footerContact.address, oldContact.address),
      city: firstString(oldContact.city),
      state: firstString(oldContact.state),
      zipCode: firstString(oldContact.zipCode),
      ...(typeof oldContact.latitude === "number" ? { latitude: oldContact.latitude } : {}),
      ...(typeof oldContact.longitude === "number" ? { longitude: oldContact.longitude } : {}),
    },
    seoSettings: {
      siteTitle: firstString(seo.title, oldSeo.siteTitle),
      siteDescription: firstString(seo.description, oldSeo.siteDescription),
      keywords: asStrings(seo.keywords).length > 0 ? asStrings(seo.keywords) : asStrings(oldSeo.keywords),
      ogImage: firstString(seo.ogImage, oldSeo.ogImage),
      twitterHandle: firstString(oldSeo.twitterHandle) || undefined,
    },
    whatsappConfig: {
      number: firstString(whatsapp.number, oldWhatsappConfig.number, oldContact.whatsapp),
      defaultMessage: firstString(oldWhatsappConfig.defaultMessage),
    },
    primaryColor: firstString(settings.primaryColor) || "#0f766e",
    secondaryColor: firstString(settings.secondaryColor) || "#0284c7",
    sections: {
      toursEnabled: toBoolean(sections.toursEnabled, true),
      transfersEnabled: toBoolean(sections.transfersEnabled, true),
    },
    ...(settings.aboutSection ? { aboutSection: settings.aboutSection as SiteSettings["aboutSection"] } : {}),
    companyName: firstString(footer.companyName, settings.companyName),
    footerText: firstString(footer.text, settings.footerText),
    footerCnpj: firstString(footer.cnpj, settings.footerCnpj),
    footerCopyright: firstString(footer.copyrightText, settings.footerCopyright),
    footerDeveloperName: firstString(footer.developerName, settings.footerDeveloperName),
    footerDeveloperUrl: firstString(footer.developerUrl, settings.footerDeveloperUrl),
    footerCertificationImage: firstString(footer.certificationImage, settings.footerCertificationImage),
    footerCertificationAlt: firstString(footer.certificationAlt, settings.footerCertificationAlt),
    footerPaymentImage: firstString(footer.paymentImage, settings.footerPaymentImage),
    footerPaymentAlt: firstString(footer.paymentAlt, settings.footerPaymentAlt),
    footerSecurityImage: firstString(footer.securityImage, settings.footerSecurityImage),
    footerSecurityAlt: firstString(footer.securityAlt, settings.footerSecurityAlt),
    updatedAt: toDate(settings.updatedAt ?? footer.updatedAt ?? header.updatedAt),
  } as SiteSettings;
}
