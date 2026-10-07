"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { defaultContactCopy, defaultPublicPageCopy } from "@/lib/site-copy";
import type { ContactPageCopy } from "@/types";
import { clearCachedSettings } from "@/lib/settings-cache";

const defaultAboutSection = {
  title: "Sobre a Transfer Fortaleza Tur",
  pageIntro: "Conheça nossa história e compromisso com proporcionar experiências inesquecíveis",
  historyTitle: "Nossa História",
  description: "Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo.",
  missionTitle: "Nossa Missão",
  missionText: "Proporcionar experiências turísticas únicas e memoráveis, com segurança, conforto e profissionalismo, superando as expectativas de nossos clientes em cada jornada.",
  visionTitle: "Nossa Visão",
  visionText: "Ser reconhecidos como a melhor empresa de turismo da região, sinônimo de qualidade, confiança e experiências transformadoras.",
  valuesTitle: "Nossos Valores",
  values: [
    "Segurança em primeiro lugar",
    "Qualidade e excelência no atendimento",
    "Transparência e honestidade",
    "Respeito ao meio ambiente e às comunidades locais",
    "Inovação constante em nossos serviços",
    "Paixão pelo que fazemos",
  ],
  statsTitle: "Nossos Números",
  whyChooseTitle: "Por Que Escolher a Transfer Fortaleza Tur?",
  benefits: [
    { title: "Guias Experientes", description: "Profissionais qualificados e apaixonados por mostrar o melhor de cada destino." },
    { title: "Veículos Confortáveis", description: "Frota moderna e bem conservada para garantir seu conforto durante as viagens." },
    { title: "Roteiros Exclusivos", description: "Passeios cuidadosamente planejados para oferecer experiências autênticas." },
    { title: "Atendimento 24h", description: "Suporte completo antes, durante e após sua viagem." },
  ],
  stats: [
    { value: 10, label: "Anos de Experiência" },
    { value: 5000, label: "Clientes Satisfeitos" },
    { value: 100, label: "Destinos" },
  ],
};

const defaultMenuLinks = [
  { id: "packages", label: "Pacotes", url: "/pacotes", order: 0, active: true },
  { id: "tours", label: "Passeios", url: "/passeios", order: 1, active: true },
  { id: "transfers", label: "Transfer", url: "/transfer", order: 2, active: true },
  { id: "blog", label: "Blog", url: "/blog", order: 3, active: true },
  { id: "about", label: "Sobre", url: "/sobre", order: 4, active: true },
  { id: "contact", label: "Contato", url: "/contato", order: 5, active: true },
];

const defaultFooterLinks = [
  { id: "packages", label: "Pacotes", url: "/pacotes", active: true },
  { id: "blog", label: "Blog", url: "/blog", active: true },
  { id: "transfers", label: "Transfers", url: "/transfer", active: true },
  { id: "privacy", label: "Política", url: "/politica-de-privacidade", active: true },
  { id: "contact", label: "Contato", url: "/contato", active: true },
];

const contactCopyLabels: Record<keyof ContactPageCopy, string> = {
  title: "Título principal",
  introduction: "Introdução",
  detailsTitle: "Título das informações de contato",
  phoneLabel: "Rótulo do telefone",
  whatsappLabel: "Rótulo do WhatsApp",
  whatsappFallback: "Texto alternativo do WhatsApp",
  whatsappButton: "Botão do WhatsApp",
  emailLabel: "Rótulo do e-mail de contato",
  addressLabel: "Rótulo do endereço",
  hoursTitle: "Título do horário de atendimento",
  weekdayHours: "Horário de segunda a sexta",
  saturdayHours: "Horário de sábado",
  sundayHours: "Horário de domingo",
  formTitle: "Título do formulário",
  successGreeting: "Mensagem de sucesso",
  successInstructions: "Instruções após o envio",
  successPopupHint: "Orientação para abrir o WhatsApp",
  successButton: "Botão para abrir o WhatsApp",
  nameLabel: "Rótulo do nome",
  namePlaceholder: "Exemplo para o nome",
  emailFormLabel: "Rótulo do e-mail no formulário",
  emailPlaceholder: "Exemplo para o e-mail",
  phoneFormLabel: "Rótulo do telefone no formulário",
  phonePlaceholder: "Exemplo para o telefone",
  messageLabel: "Rótulo da mensagem",
  messagePlaceholder: "Exemplo para a mensagem",
  submitButton: "Botão de envio",
  submittingButton: "Texto durante o envio",
  whatsappGreeting: "Mensagem inicial do WhatsApp",
  submitError: "Mensagem de erro",
};

const multilineContactCopy = new Set<keyof ContactPageCopy>([
  "introduction",
  "successInstructions",
  "successPopupHint",
  "whatsappGreeting",
  "submitError",
]);

const contactHeadingDefaults: Partial<Record<keyof ContactPageCopy, string>> = {
  title: "h1",
  detailsTitle: "h2",
  phoneLabel: "h3",
  whatsappLabel: "h3",
  emailLabel: "h3",
  addressLabel: "h3",
  hoursTitle: "h3",
  formTitle: "h2",
};

const contactVisibilityFields = new Set<keyof ContactPageCopy>([
  "title", "introduction", "detailsTitle", "phoneLabel", "whatsappLabel", "emailLabel",
  "addressLabel", "hoursTitle", "formTitle", "successInstructions", "successPopupHint",
]);

const pageCopyGroups = [
  {
    key: "home",
    title: "Página inicial",
    description: "Textos das seções, chamadas e botões exibidos na página inicial.",
    fields: [
      ["heroTitle", "Título alternativo do banner", false],
      ["heroSubtitle", "Texto alternativo do banner", true],
      ["toursSectionTitle", "Título da seção principal de passeios", false],
      ["destinationsBadge", "Rótulo acima do título principal", false],
      ["toursSectionIntro", "Introdução da seção principal de passeios", true],
      ["toursTitle", "Título da lista de passeios", false],
      ["toursIntro", "Introdução da lista de passeios", true],
      ["toursButton", "Botão para ver todos os passeios", false],
      ["toursImagePlaceholder", "Texto sem imagem nos passeios", false],
      ["toursDurationFallback", "Duração não informada nos passeios", false],
      ["toursGroupLabel", "Texto do tamanho do grupo nos passeios", false],
      ["tourFeaturedBadge", "Selo de passeio em destaque", false],
      ["tourReserveButton", "Botão de reserva pelo WhatsApp", false],
      ["tourDetailsButton", "Botão de detalhes do passeio", false],
      ["moreToursTitle", "Título de mais passeios", false],
      ["moreToursIntro", "Introdução de mais passeios", true],
      ["transfersTitle", "Título dos transfers", false],
      ["transfersIntro", "Introdução dos transfers", true],
      ["transfersButton", "Botão para ver todos os transfers", false],
      ["transfersImagePlaceholder", "Texto sem imagem nos transfers", false],
      ["transfersVehicleFallback", "Veículo não informado nos transfers", false],
      ["transfersCapacityFallback", "Capacidade não informada nos transfers", false],
      ["transfersCapacitySuffix", "Unidade da capacidade nos transfers", false],
      ["transferDetailsButton", "Botão de detalhes do transfer", false],
      ["transferWhatsappButton", "Botão do WhatsApp no transfer", false],
      ["homeRelatedTitle", "Título de transfers recomendados", false],
      ["homeRelatedIntro", "Introdução de transfers recomendados", true],
      ["homeRelatedSeeAll", "Link para todos os transfers recomendados", false],
      ["homeRelatedCardButton", "Botão dos transfers recomendados", false],
      ["blogTitle", "Título do blog", false],
      ["blogIntro", "Introdução do blog", true],
      ["blogButton", "Botão para ver todos os artigos", false],
      ["testimonialsTitle", "Título dos depoimentos", false],
      ["testimonialsIntro", "Introdução dos depoimentos", true],
      ["faqTitle", "Título das perguntas frequentes", false],
      ["faqIntro", "Introdução das perguntas frequentes", true],
    ],
  },
  {
    key: "tours",
    title: "Página de passeios",
    description: "Textos, filtros e SEO da listagem /passeios.",
    fields: [
      ["title", "Título da página", false], ["intro", "Introdução", true],
      ["disabledTitle", "Título de seção desativada", false], ["disabledMessage", "Mensagem de seção desativada", true],
      ["searchPlaceholder", "Campo de busca", false], ["filtersButton", "Botão de filtros", false],
      ["durationFilterLabel", "Filtro de duração", false], ["anyDuration", "Todas as durações", false],
      ["shortDuration", "Opção de duração curta", false], ["mediumDuration", "Opção de duração média", false],
      ["longDuration", "Opção de duração longa", false], ["featuredOnly", "Filtro de destaques", false],
      ["foundSingular", "Contagem singular", false], ["foundPlural", "Contagem plural", false],
      ["loadError", "Erro ao carregar", true], ["noResults", "Nenhum resultado", true],
      ["clearFilters", "Limpar filtros", false], ["imagePlaceholder", "Texto sem imagem", false],
      ["durationFallback", "Duração não informada", false], ["groupLabel", "Texto do tamanho do grupo", false],
      ["detailsButton", "Botão de detalhes", false], ["seoTitle", "Título SEO", false],
      ["seoDescription", "Descrição SEO", true],
    ],
  },
  {
    key: "transfers",
    title: "Página de transfers",
    description: "Textos, mensagens e SEO da listagem /transfer.",
    fields: [
      ["title", "Título da página", false], ["intro", "Introdução", true],
      ["searchPlaceholder", "Campo de busca", false], ["foundSingular", "Contagem singular", false],
      ["foundPlural", "Contagem plural", false], ["loadError", "Erro ao carregar", true],
      ["disabledMessage", "Mensagem de seção desativada", true],
      ["noResults", "Nenhum resultado", true], ["clearFilters", "Limpar filtros", false],
      ["imagePlaceholder", "Texto sem imagem", false], ["vehicleFallback", "Veículo não informado", false],
      ["capacityFallback", "Capacidade não informada", false], ["detailsButton", "Botão de detalhes", false],
      ["seoTitle", "Título SEO", false], ["seoDescription", "Descrição SEO", true],
    ],
  },
  {
    key: "packages",
    title: "Página conjunta de passeios e transfers",
    description: "Conteúdo e SEO da página /pacotes.",
    fields: [
      ["title", "Título da página", false], ["intro", "Introdução", true],
      ["toursTitle", "Título da seção de passeios", false], ["toursIntro", "Introdução da seção de passeios", true],
      ["transfersTitle", "Título da seção de transfers", false], ["transfersIntro", "Introdução da seção de transfers", true],
      ["seeTours", "Link para todos os passeios", false], ["seeTransfers", "Link para todos os transfers", false],
      ["noTours", "Mensagem sem passeios", false], ["noTransfers", "Mensagem sem transfers", false],
      ["unavailable", "Mensagem de seções indisponíveis", true], ["loadError", "Erro ao carregar", true],
      ["imagePlaceholder", "Texto sem imagem", false], ["durationFallback", "Duração não informada", false],
      ["groupLabel", "Texto do tamanho do grupo", false], ["capacityFallback", "Capacidade não informada", false],
      ["vehicleFallback", "Veículo não informado", false], ["capacitySuffix", "Unidade da capacidade", false],
      ["seoTitle", "Título SEO", false], ["seoDescription", "Descrição SEO", true],
    ],
  },
  {
    key: "blog",
    title: "Blog",
    description: "Textos da listagem e SEO do blog.",
    fields: [
      ["title", "Título da página", false], ["intro", "Introdução", true],
      ["noPosts", "Mensagem sem artigos", false], ["readArticlePrefix", "Texto do link de leitura", false],
      ["readTimeSuffix", "Unidade do tempo de leitura", false], ["imagePlaceholder", "Texto sem imagem", false],
      ["emptyImageAlt", "Texto alternativo da imagem vazia", false], ["seoTitle", "Título SEO", false],
      ["seoDescription", "Descrição SEO", true],
    ],
  },
  {
    key: "testimonials",
    title: "Depoimentos",
    description: "Títulos e textos exibidos junto aos depoimentos.",
    fields: [
      ["title", "Título", false], ["intro", "Introdução", true],
      ["imagePlaceholder", "Texto sem foto", false],
    ],
  },
  {
    key: "faq",
    title: "Perguntas frequentes",
    description: "Textos da seção de perguntas frequentes da página inicial.",
    fields: [
      ["title", "Título", false], ["intro", "Introdução", true], ["noItems", "Mensagem sem perguntas", false],
    ],
  },
  {
    key: "tourDetails",
    title: "Detalhe de passeio",
    description: "Rótulos e textos padrão usados nas páginas individuais dos passeios.",
    fields: [
      ["backLink", "Link de retorno", false], ["availability", "Selo de disponibilidade", false],
      ["featured", "Selo de destaque", false], ["groupLabel", "Tamanho do grupo", false],
      ["urgencyTitle", "Título do aviso de vagas", false], ["urgencyText", "Texto do aviso de vagas", true],
      ["aboutTitle", "Título da descrição", false], ["fullDescription", "Link da descrição completa", false],
      ["includesTitle", "Título dos itens incluídos", false], ["excludesTitle", "Título dos itens não incluídos", false],
      ["faqTitle", "Título das perguntas", false],
      ["trust1Title", "Selo 1 — título", false], ["trust1Description", "Selo 1 — descrição", true],
      ["trust2Title", "Selo 2 — título", false], ["trust2Description", "Selo 2 — descrição", true],
      ["trust3Title", "Selo 3 — título", false], ["trust3Description", "Selo 3 — descrição", true],
      ["trust4Title", "Selo 4 — título", false], ["trust4Description", "Selo 4 — descrição", true],
      ["relatedTitle", "Título dos passeios recomendados", false],
      ["relatedIntro", "Introdução dos passeios recomendados", true],
      ["relatedSeeAll", "Link para todos os passeios", false],
      ["relatedCardButton", "Botão dos cards recomendados", false],
      ["durationFallback", "Duração não informada", false],
    ],
  },
  {
    key: "transferDetails",
    title: "Detalhe de transfer",
    description: "Rótulos padrão usados nas páginas individuais dos transfers.",
    fields: [
      ["backLink", "Link de retorno", false], ["availability", "Selo de disponibilidade", false],
      ["featured", "Selo de destaque", false], ["vehicleLabel", "Rótulo do veículo", false],
      ["capacityLabel", "Rótulo da capacidade", false], ["capacitySuffix", "Unidade da capacidade", false],
      ["aboutTitle", "Título da descrição", false], ["fullDescription", "Link da descrição completa", false],
      ["quoteButton", "Botão de orçamento", false], ["contactButton", "Botão de contato", false],
      ["includesTitle", "Título dos itens incluídos", false], ["excludesTitle", "Título dos itens não incluídos", false],
      ["faqTitle", "Título das perguntas", false],
      ["relatedTitle", "Título dos transfers recomendados", false],
      ["relatedIntro", "Introdução dos transfers recomendados", true],
      ["relatedSeeAll", "Link para todos os transfers", false],
      ["relatedCardButton", "Botão dos cards recomendados", false],
    ],
  },
  {
    key: "privacy",
    title: "Política de privacidade",
    description: "Edite o texto publicado na página de privacidade. Confirme as informações legais antes de publicar.",
    fields: [
      ["brandLabel", "Nome exibido acima do título", false], ["title", "Título da página", false],
      ["updatedLabel", "Rótulo da data de atualização", false], ["updatedDate", "Data de atualização", false],
      ["section1Title", "Seção 1 — título", false], ["section1First", "Seção 1 — primeiro parágrafo", true],
      ["section1Second", "Seção 1 — segundo parágrafo", true], ["section2Title", "Seção 2 — título", false],
      ["section2Body", "Seção 2 — conteúdo", true], ["section3Title", "Seção 3 — título", false],
      ["section3Body", "Seção 3 — conteúdo", true], ["section4Title", "Seção 4 — título", false],
      ["section4Body", "Seção 4 — conteúdo", true], ["section5Title", "Seção 5 — título", false],
      ["section5Body", "Seção 5 — conteúdo", true], ["seoTitle", "Título SEO", false],
      ["seoDescription", "Descrição SEO", true],
    ],
  },
  {
    key: "cookie",
    title: "Aviso de cookies e consentimento",
    description: "Edite os textos do aviso sem alterar como a autorização é armazenada ou aplicada.",
    fields: [
      ["title", "Título do aviso", false], ["message", "Mensagem principal", true],
      ["refusalMessage", "Texto sobre recusa", true], ["privacyLink", "Link para a política", false],
      ["rejectButton", "Botão para recusar", false], ["acceptButton", "Botão para aceitar", false],
    ],
  },
] as const;

function getDefaultHeadingLevel(page: string, field: string) {
  if (
    field === "heroTitle" ||
    field === "disabledTitle" ||
    field === "productName" ||
    (field === "title" && ["tours", "transfers", "packages", "blog", "privacy"].includes(page))
  ) {
    return "h1";
  }
  if (field === "toursTitle" || field === "urgencyTitle" || /^trust\dTitle$/.test(field)) {
    return "h3";
  }
  return "h2";
}

const headingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function HeadingLevelControl({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value?: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
      <span>{label}</span>
      <select
        value={value || fallback}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
      >
        {headingLevels.map((level) => (
          <option key={level} value={level}>{level.toUpperCase()}</option>
        ))}
      </select>
    </label>
  );
}

function VisibilityControl({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled?: string | boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
      <input
        type="checkbox"
        checked={enabled !== false && enabled !== "false"}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary-600"
      />
      {label}
    </label>
  );
}

function isVisibilityEditableField(field: string, multiline: boolean): boolean {
  if (field === "seoTitle" || field === "seoDescription") return false;
  return field === "title" || field === "disabledTitle" || field === "heroTitle" ||
    field.endsWith("Title") ||
    (multiline && /(intro|subtitle|description|body|first|second|text|message)$/i.test(field));
}

const cardHeadingControls: Record<string, Array<{ key: string; label: string; fallback: string }>> = {
  home: [
    { key: "tourCardTitleHeadingLevel", label: "Título dos cards de passeios", fallback: "h4" },
    { key: "transferCardTitleHeadingLevel", label: "Título dos cards de transfers", fallback: "h3" },
    { key: "blogCardTitleHeadingLevel", label: "Título dos cards de artigos", fallback: "h3" },
  ],
  tours: [
    { key: "cardTitleHeadingLevel", label: "Título dos cards de passeios", fallback: "h2" },
  ],
  transfers: [
    { key: "cardTitleHeadingLevel", label: "Título dos cards de transfers", fallback: "h2" },
  ],
  blog: [
    { key: "blogCardTitleHeadingLevel", label: "Título dos cards de artigos", fallback: "h2" },
  ],
  packages: [
    { key: "cardTitleHeadingLevel", label: "Título dos cards de passeios e transfers", fallback: "h3" },
  ],
  tourDetails: [
    { key: "cardTitleHeadingLevel", label: "Título dos cards recomendados", fallback: "h3" },
  ],
  transferDetails: [
    { key: "cardTitleHeadingLevel", label: "Título dos cards recomendados", fallback: "h3" },
  ],
};

const cardVisibilityControls: Record<string, Array<{ key: string; label: string }>> = {
  home: [
    { key: "tourCardTitleEnabled", label: "Títulos dos cards de passeios" },
    { key: "tourCardDescriptionEnabled", label: "Descrições dos cards de passeios" },
    { key: "transferCardTitleEnabled", label: "Títulos dos cards de transfers" },
    { key: "transferCardDescriptionEnabled", label: "Descrições dos cards de transfers" },
    { key: "blogCardTitleEnabled", label: "Títulos dos cards de artigos" },
    { key: "blogCardDescriptionEnabled", label: "Descrições dos cards de artigos" },
  ],
  tours: [
    { key: "cardTitleEnabled", label: "Títulos dos cards" },
    { key: "cardDescriptionEnabled", label: "Descrições dos cards" },
  ],
  transfers: [
    { key: "cardTitleEnabled", label: "Títulos dos cards" },
    { key: "cardDescriptionEnabled", label: "Descrições dos cards" },
  ],
  blog: [
    { key: "blogCardTitleEnabled", label: "Títulos dos cards de artigos" },
    { key: "blogCardDescriptionEnabled", label: "Descrições dos cards de artigos" },
  ],
  packages: [
    { key: "cardTitleEnabled", label: "Títulos dos cards" },
    { key: "cardDescriptionEnabled", label: "Descrições dos cards" },
  ],
  tourDetails: [{ key: "cardTitleEnabled", label: "Títulos dos cards recomendados" }],
  transferDetails: [{ key: "cardTitleEnabled", label: "Títulos dos cards recomendados" }],
};

const sectionVisibilityControls: Record<string, Array<{ key: string; label: string }>> = {
  home: [
    { key: "heroSectionEnabled", label: "Banner principal" },
    { key: "toursSectionEnabled", label: "Seção principal de passeios" },
    { key: "moreToursSectionEnabled", label: "Seção de mais passeios" },
    { key: "transfersSectionEnabled", label: "Seção de transfers" },
    { key: "homeRelatedSectionEnabled", label: "Transfers recomendados" },
    { key: "blogSectionEnabled", label: "Seção do blog" },
    { key: "testimonialsSectionEnabled", label: "Seção de depoimentos" },
    { key: "faqSectionEnabled", label: "Seção de perguntas frequentes" },
  ],
  packages: [
    { key: "toursSectionEnabled", label: "Seção de passeios" },
    { key: "transfersSectionEnabled", label: "Seção de transfers" },
  ],
  tours: [{ key: "listingSectionEnabled", label: "Lista de passeios" }],
  transfers: [{ key: "listingSectionEnabled", label: "Lista de transfers" }],
  blog: [{ key: "listingSectionEnabled", label: "Lista de artigos" }],
  privacy: [
    { key: "section1SectionEnabled", label: "Seção 1 da política" },
    { key: "section2SectionEnabled", label: "Seção 2 da política" },
    { key: "section3SectionEnabled", label: "Seção 3 da política" },
    { key: "section4SectionEnabled", label: "Seção 4 da política" },
    { key: "section5SectionEnabled", label: "Seção 5 da política" },
  ],
  tourDetails: [
    { key: "aboutSectionEnabled", label: "Descrição do passeio" },
    { key: "includesSectionEnabled", label: "Itens incluídos" },
    { key: "excludesSectionEnabled", label: "Itens não incluídos" },
    { key: "faqSectionEnabled", label: "Perguntas frequentes" },
    { key: "relatedSectionEnabled", label: "Passeios recomendados" },
  ],
  transferDetails: [
    { key: "aboutSectionEnabled", label: "Descrição do transfer" },
    { key: "includesSectionEnabled", label: "Itens incluídos" },
    { key: "excludesSectionEnabled", label: "Itens não incluídos" },
    { key: "faqSectionEnabled", label: "Perguntas frequentes" },
    { key: "relatedSectionEnabled", label: "Transfers recomendados" },
  ],
};

interface SiteSeo {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogImageAlt: string;
}

const defaultSiteSeo: SiteSeo = {
  title: "Passeios e Transfers em Fortaleza e Região",
  description: "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!",
  keywords: "passeios fortaleza, tours fortaleza, transfer fortaleza, turismo ceará",
  ogImage: "",
  ogImageAlt: "",
};

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteSeo, setSiteSeo] = useState<SiteSeo>(defaultSiteSeo);
  const [siteSeoLoading, setSiteSeoLoading] = useState(true);
  const [siteSeoSaving, setSiteSeoSaving] = useState(false);
  const [siteSeoError, setSiteSeoError] = useState("");

  useEffect(() => {
    fetchSettings();
    void fetchSiteSeo();
  }, []);

  const fetchSiteSeo = async () => {
    setSiteSeoLoading(true);
    setSiteSeoError("");
    try {
      const response = await fetch("/api/admin/site-seo", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Falha ao carregar os metadados.");

      setSiteSeo({
        title: data.title || defaultSiteSeo.title,
        description: data.description || defaultSiteSeo.description,
        keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : defaultSiteSeo.keywords,
        ogImage: data.ogImage || "",
        ogImageAlt: data.ogImageAlt || "",
      });
    } catch (error) {
      console.error("Error fetching site SEO:", error);
      const message = error instanceof Error ? error.message : "Falha ao carregar os metadados.";
      setSiteSeoError(message);
      toast.error(message);
    } finally {
      setSiteSeoLoading(false);
    }
  };

  const handleSaveSiteSeo = async () => {
    setSiteSeoSaving(true);
    try {
      const response = await fetch("/api/admin/site-seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...siteSeo,
          keywords: siteSeo.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Falha ao salvar os metadados.");

      clearCachedSettings();
      toast.success("Metadados do site salvos.");
    } catch (error) {
      console.error("Error saving site SEO:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao salvar os metadados.");
    } finally {
      setSiteSeoSaving(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      setSettings({
        ...data,
        aboutSection: {
          ...defaultAboutSection,
          ...data?.aboutSection,
          stats: data?.aboutSection?.stats?.length
            ? data.aboutSection.stats
            : defaultAboutSection.stats,
        },
        pageCopy: {
          ...data?.pageCopy,
          contact: { ...defaultContactCopy, ...data?.pageCopy?.contact },
          ...Object.fromEntries(
            Object.entries(defaultPublicPageCopy).map(([key, defaults]) => [
              key,
              { ...defaults, ...data?.pageCopy?.[key] },
            ]),
          ),
        },
        menuLinks: data?.menuLinks?.length ? data.menuLinks : defaultMenuLinks,
        footerLinks: data?.footerLinks?.length ? data.footerLinks : defaultFooterLinks,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          menuLinks: settings.menuLinks || defaultMenuLinks,
          footerLinks: settings.footerLinks || defaultFooterLinks,
        }),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      clearCachedSettings();
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Configurações do site</h1>
        <p className="text-muted-foreground">
          Edite as informações gerais em uma única tela. Use os atalhos para ir direto à área desejada
          e salve as alterações no final da página.
        </p>
      </div>

      <nav aria-label="Atalhos das configurações" className="flex flex-wrap gap-2">
        {[
          ["#marca", "Marca e logos"],
          ["#seo", "Metadados e SEO"],
          ["#navegacao", "Menu do site"],
          ["#contato", "Contato"],
          ["#rodape", "Rodapé"],
          ["#redes-sociais", "Redes sociais"],
          ["#textos-contato", "Textos da página Contato"],
          ["#inicio", "Página inicial"],
          ["#textos-publicos", "Textos de todas as páginas"],
          ["#sobre-empresa", "Sobre a empresa"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {label}
          </a>
        ))}
      </nav>

      <Card id="marca" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Marca e logos</CardTitle>
          <CardDescription>
            Escolha a imagem usada no cabeçalho e no rodapé. O texto alternativo descreve a imagem para leitores de tela.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Logo do cabeçalho</label>
            <ImageUpload
              currentImage={settings?.headerLogo}
              currentAlt={settings?.headerLogoAlt || ""}
              label=""
              compact
              onImageUpload={(url, alt) => setSettings((current: any) => ({
                ...current,
                headerLogo: url,
                headerLogoAlt: alt || current?.headerLogoAlt || "",
              }))}
              onAltChange={(headerLogoAlt) => setSettings((current: any) => ({ ...current, headerLogoAlt }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Logo do rodapé</label>
            <ImageUpload
              currentImage={settings?.footerLogo}
              currentAlt={settings?.footerLogoAlt || ""}
              label=""
              compact
              onImageUpload={(url, alt) => setSettings((current: any) => ({
                ...current,
                footerLogo: url,
                footerLogoAlt: alt || current?.footerLogoAlt || "",
              }))}
              onAltChange={(footerLogoAlt) => setSettings((current: any) => ({ ...current, footerLogoAlt }))}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Se não houver uma logo própria para o rodapé, será usada a logo do cabeçalho.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card id="seo" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Metadados e SEO do site</CardTitle>
          <CardDescription>
            Esses dados definem o padrão de título, descrição, palavras-chave e imagem usados nos resultados de busca e
            compartilhamentos. Páginas e artigos com SEO próprio continuam usando seus metadados específicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {siteSeoLoading ? (
            <p className="text-sm text-muted-foreground">Carregando metadados...</p>
          ) : siteSeoError ? (
            <div role="alert" className="space-y-2 text-sm text-red-700">
              <p>{siteSeoError}</p>
              <Button type="button" variant="outline" onClick={() => void fetchSiteSeo()}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label htmlFor="site-seo-title" className="text-sm font-medium">Título padrão do site</label>
                <Input
                  id="site-seo-title"
                  maxLength={160}
                  value={siteSeo.title}
                  onChange={(event) => setSiteSeo({ ...siteSeo, title: event.target.value })}
                  placeholder="Passeios e Transfers em Fortaleza e Região"
                />
                <p className="text-xs text-muted-foreground">Até 160 caracteres. As páginas com título próprio não são alteradas.</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="site-seo-description" className="text-sm font-medium">Descrição padrão</label>
                <textarea
                  id="site-seo-description"
                  maxLength={320}
                  rows={3}
                  value={siteSeo.description}
                  onChange={(event) => setSiteSeo({ ...siteSeo, description: event.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Resumo do site exibido nos resultados de busca."
                />
                <p className="text-xs text-muted-foreground">Até 320 caracteres. Páginas com descrição própria mantêm seu texto.</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="site-seo-keywords" className="text-sm font-medium">Palavras-chave</label>
                <Input
                  id="site-seo-keywords"
                  value={siteSeo.keywords}
                  onChange={(event) => setSiteSeo({ ...siteSeo, keywords: event.target.value })}
                  placeholder="passeios Fortaleza, transfer Fortaleza, turismo Ceará"
                />
                <p className="text-xs text-muted-foreground">Separe os termos por vírgula.</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Imagem para compartilhamento (Open Graph)</label>
                <ImageUpload
                  currentImage={siteSeo.ogImage}
                  currentAlt={siteSeo.ogImageAlt}
                  label=""
                  onImageUpload={(url, alt) => setSiteSeo((current) => ({ ...current, ogImage: url, ogImageAlt: alt || current.ogImageAlt }))}
                  onAltChange={(ogImageAlt) => setSiteSeo((current) => ({ ...current, ogImageAlt }))}
                />
                <p className="text-xs text-muted-foreground">Imagem horizontal recomendada: 1200 × 630 px. O texto ALT também será usado nos metadados de compartilhamento.</p>
              </div>
              <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
                <Button type="button" onClick={handleSaveSiteSeo} disabled={siteSeoSaving}>
                  {siteSeoSaving ? "Salvando..." : "Salvar metadados"}
                </Button>
                <Button type="button" variant="outline" onClick={() => void fetchSiteSeo()} disabled={siteSeoSaving}>
                  Descartar alterações
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card id="navegacao" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Menu do site</CardTitle>
          <CardDescription>
            Edite separadamente os links do cabeçalho e os atalhos do rodapé. Isso não altera as páginas nem seus endereços.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Links do cabeçalho</h3>
            <p className="text-sm text-muted-foreground">Aparecem na navegação principal do site.</p>
            {(settings?.menuLinks || defaultMenuLinks).map((link: any, index: number) => (
              <fieldset key={link.id || index} className="grid min-w-0 gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
                <legend className="px-1 text-xs font-medium text-muted-foreground">Link {index + 1}</legend>
                <label className="min-w-0 space-y-1 text-sm">
                  <span className="block font-medium">Texto exibido</span>
                  <Input
                    placeholder="Ex.: Passeios"
                    value={link.label || ""}
                    onChange={(e) => {
                      const links = [...settings.menuLinks];
                      links[index] = { ...link, label: e.target.value };
                      setSettings({ ...settings, menuLinks: links });
                    }}
                  />
                </label>
                <label className="min-w-0 space-y-1 text-sm">
                  <span className="block font-medium">Endereço da página</span>
                  <Input
                    placeholder="Ex.: /passeios"
                    value={link.url || ""}
                    onChange={(e) => {
                      const links = [...settings.menuLinks];
                      links[index] = { ...link, url: e.target.value };
                      setSettings({ ...settings, menuLinks: links });
                    }}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={link.active !== false}
                    onChange={(e) => {
                      const links = [...settings.menuLinks];
                      links[index] = { ...link, active: e.target.checked };
                      setSettings({ ...settings, menuLinks: links });
                    }}
                  />
                  Exibir
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSettings({
                    ...settings,
                    menuLinks: settings.menuLinks.filter((_: unknown, itemIndex: number) => itemIndex !== index),
                  })}
                >
                  Remover link
                </Button>
              </fieldset>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings({
                ...settings,
                menuLinks: [...(settings.menuLinks || []), {
                  id: `menu-${Date.now()}`, label: "", url: "/", order: settings.menuLinks?.length || 0, active: true,
                }],
              })}
            >
              Adicionar link ao cabeçalho
            </Button>
          </div>

          <div className="space-y-3 border-t pt-5">
            <h3 className="font-medium">Atalhos do rodapé</h3>
            <p className="text-sm text-muted-foreground">Aparecem na área de links no final das páginas.</p>
            {(settings?.footerLinks || defaultFooterLinks).map((link: any, index: number) => (
              <fieldset key={link.id || index} className="grid min-w-0 gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
                <legend className="px-1 text-xs font-medium text-muted-foreground">Atalho {index + 1}</legend>
                <label className="min-w-0 space-y-1 text-sm">
                  <span className="block font-medium">Texto exibido</span>
                  <Input
                    placeholder="Ex.: Contato"
                    value={link.label || ""}
                    onChange={(e) => {
                      const links = [...settings.footerLinks];
                      links[index] = { ...link, label: e.target.value };
                      setSettings({ ...settings, footerLinks: links });
                    }}
                  />
                </label>
                <label className="min-w-0 space-y-1 text-sm">
                  <span className="block font-medium">Endereço da página</span>
                  <Input
                    placeholder="Ex.: /contato"
                    value={link.url || ""}
                    onChange={(e) => {
                      const links = [...settings.footerLinks];
                      links[index] = { ...link, url: e.target.value };
                      setSettings({ ...settings, footerLinks: links });
                    }}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={link.active !== false}
                    onChange={(e) => {
                      const links = [...settings.footerLinks];
                      links[index] = { ...link, active: e.target.checked };
                      setSettings({ ...settings, footerLinks: links });
                    }}
                  />
                  Exibir
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSettings({
                    ...settings,
                    footerLinks: settings.footerLinks.filter((_: unknown, itemIndex: number) => itemIndex !== index),
                  })}
                >
                  Remover atalho
                </Button>
              </fieldset>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings({
                ...settings,
                footerLinks: [...(settings.footerLinks || []), {
                  id: `footer-${Date.now()}`, label: "", url: "/", active: true,
                }],
              })}
            >
              Adicionar link ao rodapé
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card id="contato" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Contato do negócio</CardTitle>
          <CardDescription>
            Dados exibidos nas informações de contato do rodapé e da página Contato. Os textos e rótulos dessa página ficam na seção “Textos da página Contato”.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="contato@example.com"
              value={settings?.contactInfo?.email || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: {
                    ...settings?.contactInfo,
                    email: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <Input
              placeholder="(85) 99999-9999"
              value={settings?.contactInfo?.phone || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: {
                    ...settings?.contactInfo,
                    phone: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">WhatsApp para contato</label>
            <p className="mb-2 text-xs text-muted-foreground">
              Número exibido nas informações de contato. O botão/ícone do rodapé usa este número se não houver um link de WhatsApp próprio.
            </p>
            <Input
              placeholder="(85) 99999-9999"
              value={settings?.contactInfo?.whatsapp || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: {
                    ...settings?.contactInfo,
                    whatsapp: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Endereço</label>
            <Input
              value={settings?.contactInfo?.address || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contactInfo: { ...settings?.contactInfo, address: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card id="rodape" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Textos e selos do rodapé</CardTitle>
          <CardDescription>
            Personalize a identificação, os textos legais, créditos e imagens exibidos no final das páginas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da empresa no rodapé</label>
            <p className="mb-2 text-xs text-muted-foreground">
              Aparece junto aos direitos autorais; não altera a logo nem o título de SEO.
            </p>
            <Input
              value={settings?.companyName || ""}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto de apresentação do rodapé</label>
            <textarea
              className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={settings?.footerText || ""}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">CNPJ exibido no rodapé</label>
            <Input
              value={settings?.footerCnpj || "64.042.188/0001-13"}
              onChange={(e) => setSettings({ ...settings, footerCnpj: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto de direitos autorais</label>
            <Input
              value={settings?.footerCopyright || "Todos os direitos reservados."}
              onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Crédito de desenvolvimento</label>
              <Input
                value={settings?.footerDeveloperName || "TURVIA"}
                onChange={(e) => setSettings({ ...settings, footerDeveloperName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Link do crédito</label>
              <Input
                value={settings?.footerDeveloperUrl || "https://turvia.com.br"}
                onChange={(e) => setSettings({ ...settings, footerDeveloperUrl: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-md border p-4">
            <h3 className="font-medium">Links externos de avaliações e segurança</h3>
            <label className="block space-y-1 text-sm">
              <span>Título da área</span>
              <Input
                value={settings?.footerTrustLinksTitle || "Avaliações e segurança"}
                onChange={(e) => setSettings({ ...settings, footerTrustLinksTitle: e.target.value })}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 text-sm">
                <span>Texto do TripAdvisor</span>
                <Input
                  value={settings?.footerTripadvisorLabel || "Avalie no TripAdvisor"}
                  onChange={(e) => setSettings({ ...settings, footerTripadvisorLabel: e.target.value })}
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span>Link do TripAdvisor</span>
                <Input
                  value={settings?.footerTripadvisorUrl || ""}
                  onChange={(e) => setSettings({ ...settings, footerTripadvisorUrl: e.target.value })}
                  placeholder="https://..."
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span>Texto de verificação</span>
                <Input
                  value={settings?.footerGoogleSafeBrowsingLabel || "Verificação Google Safe Browsing"}
                  onChange={(e) => setSettings({ ...settings, footerGoogleSafeBrowsingLabel: e.target.value })}
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span>Link de verificação</span>
                <Input
                  value={settings?.footerGoogleSafeBrowsingUrl || ""}
                  onChange={(e) => setSettings({ ...settings, footerGoogleSafeBrowsingUrl: e.target.value })}
                  placeholder="https://..."
                />
              </label>
            </div>
          </div>
          {([
            ["footerCertificationImage", "footerCertificationAlt", "Selo Cadastur", "/cadastur.png", "Cadastur"],
            ["footerPaymentImage", "footerPaymentAlt", "Formas de pagamento", "/pagamentos.png", "Formas de pagamento"],
            ["footerSecurityImage", "footerSecurityAlt", "Selo de segurança", "/seguranca.png", "Site certificado e seguro"],
          ] as const).map(([imageKey, altKey, label, fallbackImage, fallbackAlt]) => (
            <div key={imageKey} className="grid gap-3 rounded-md border p-3 md:grid-cols-[auto_1fr]">
              <div>
                <label className="mb-2 block text-sm font-medium">{label}</label>
                <ImageUpload
                  currentImage={settings?.[imageKey] || fallbackImage}
                  currentAlt={settings?.[altKey] || fallbackAlt}
                  label=""
                  compact
                  onImageUpload={(url, alt) => setSettings((current: any) => ({
                    ...current,
                    [imageKey]: url,
                    [altKey]: alt || current?.[altKey] || fallbackAlt,
                  }))}
                  onAltChange={(alt) => setSettings((current: any) => ({ ...current, [altKey]: alt }))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card id="redes-sociais" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Redes sociais</CardTitle>
          <CardDescription>
            Cadastre os links dos ícones sociais do rodapé. Se não houver um link de WhatsApp aqui, o ícone usa o número de “Contato do negócio”.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(settings?.socialLinks || []).map((link: any, index: number) => (
            <fieldset key={link.id || index} className="grid min-w-0 gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
              <legend className="px-1 text-xs font-medium text-muted-foreground">Rede social {index + 1}</legend>
              <label className="space-y-1 text-sm">
                <span className="block font-medium">Plataforma</span>
                <select
                  aria-label={`Rede social ${index + 1}`}
                  value={link.platform || "instagram"}
                  onChange={(event) => {
                    const socialLinks = [...settings.socialLinks];
                    socialLinks[index] = { ...link, platform: event.target.value };
                    setSettings({ ...settings, socialLinks });
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {[
                    ["facebook", "Facebook"],
                    ["instagram", "Instagram"],
                    ["whatsapp", "WhatsApp"],
                    ["youtube", "YouTube"],
                    ["twitter", "X (Twitter)"],
                  ].map(([platform, label]) => (
                    <option key={platform} value={platform}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="min-w-0 space-y-1 text-sm">
                <span className="block font-medium">Link ou endereço</span>
                <Input
                  aria-label={`URL da rede social ${index + 1}`}
                  placeholder="https://..."
                  value={link.url || ""}
                  onChange={(event) => {
                    const socialLinks = [...settings.socialLinks];
                    socialLinks[index] = { ...link, url: event.target.value };
                    setSettings({ ...settings, socialLinks });
                  }}
                />
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSettings({
                  ...settings,
                  socialLinks: settings.socialLinks.filter((_: unknown, itemIndex: number) => itemIndex !== index),
                })}
              >
                Remover rede
              </Button>
            </fieldset>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setSettings({
              ...settings,
              socialLinks: [...(settings.socialLinks || []), {
                id: `social-${Date.now()}`,
                platform: "instagram",
                url: "",
              }],
            })}
          >
            Adicionar rede social
          </Button>
        </CardContent>
      </Card>

      <Card id="textos-contato" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Textos da página de contato</CardTitle>
          <CardDescription>
            Edite o que está escrito na página /contato: títulos, horários, rótulos, mensagens e botões. Os dados reais (telefone, e-mail, WhatsApp e endereço) ficam em “Contato do negócio”.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(contactCopyLabels) as Array<keyof ContactPageCopy>).map((key) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium">{contactCopyLabels[key]}</label>
              {multilineContactCopy.has(key) ? (
                <textarea
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings?.pageCopy?.contact?.[key] || ""}
                  onChange={(event) => setSettings({
                    ...settings,
                    pageCopy: {
                      ...settings.pageCopy,
                      contact: {
                        ...defaultContactCopy,
                        ...settings.pageCopy?.contact,
                        [key]: event.target.value,
                      },
                    },
                  })}
                />
              ) : (
                <Input
                  value={settings?.pageCopy?.contact?.[key] || ""}
                  onChange={(event) => setSettings({
                    ...settings,
                    pageCopy: {
                      ...settings.pageCopy,
                      contact: {
                        ...defaultContactCopy,
                        ...settings.pageCopy?.contact,
                        [key]: event.target.value,
                      },
                    },
                  })}
                />
              )}
              {contactVisibilityFields.has(key) && (
                <VisibilityControl
                  label={`Exibir ${key === "introduction" || key === "successInstructions" || key === "successPopupHint" ? "texto" : "título"}`}
                  enabled={settings?.pageCopy?.contact?.[`${key}Enabled`]}
                  onChange={(enabled) => setSettings({
                    ...settings,
                    pageCopy: {
                      ...settings.pageCopy,
                      contact: {
                        ...defaultContactCopy,
                        ...settings.pageCopy?.contact,
                        [`${key}Enabled`]: String(enabled),
                      },
                    },
                  })}
                />
              )}
              {contactHeadingDefaults[key] && (
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span>Nível do título:</span>
                  <select
                    value={settings?.pageCopy?.contact?.[`${key}HeadingLevel`] || contactHeadingDefaults[key]}
                    onChange={(event) => setSettings({
                      ...settings,
                      pageCopy: {
                        ...settings.pageCopy,
                        contact: {
                          ...defaultContactCopy,
                          ...settings.pageCopy?.contact,
                          [`${key}HeadingLevel`]: event.target.value,
                        },
                      },
                    })}
                    className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                  >
                    {["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => (
                      <option key={level} value={level}>{level.toUpperCase()}</option>
                    ))}
                    <fieldset className="space-y-3 rounded-md border p-3 sm:col-span-2">
                      <legend className="px-1 text-sm font-semibold text-gray-700">Exibição das áreas de contato</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          ["detailsSectionEnabled", "Informações de contato"],
                          ["hoursSectionEnabled", "Horários de atendimento"],
                          ["formSectionEnabled", "Formulário"],
                        ].map(([key, label]) => (
                          <VisibilityControl
                            key={key}
                            label={`Exibir ${label.toLowerCase()}`}
                            enabled={settings?.pageCopy?.contact?.[key]}
                            onChange={(enabled) => setSettings({
                              ...settings,
                              pageCopy: {
                                ...settings.pageCopy,
                                contact: {
                                  ...defaultContactCopy,
                                  ...settings.pageCopy?.contact,
                                  [key]: String(enabled),
                                },
                              },
                            })}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </select>
                </label>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card id="inicio" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Seções da página inicial</CardTitle>
          <CardDescription>Escolha se os blocos de passeios e transfers aparecem na página inicial.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="home-tours-enabled" className="text-sm font-medium">Passeios</label>
              <p className="text-xs text-muted-foreground">Mostrar seção de passeios no site</p>
            </div>
            <input
              id="home-tours-enabled"
              type="checkbox"
              checked={settings?.sections?.toursEnabled ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sections: {
                    ...settings?.sections,
                    toursEnabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="home-transfers-enabled" className="text-sm font-medium">Transfers</label>
              <p className="text-xs text-muted-foreground">Mostrar seção de transfer no site</p>
            </div>
            <input
              id="home-transfers-enabled"
              type="checkbox"
              checked={settings?.sections?.transfersEnabled ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sections: {
                    ...settings?.sections,
                    transfersEnabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card id="textos-publicos" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Textos e detalhes das páginas públicas</CardTitle>
          <CardDescription>
            Edite títulos, descrições, rótulos, mensagens e SEO por página. Escolha H1–H6 para os títulos sem alterar o visual; por acessibilidade e SEO, use normalmente um H1 principal e H2/H3 nas seções. Campos vazios usam o texto padrão; os dados dos cards são editados nas áreas de Passeios, Transfers e Blog.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pageCopyGroups.map((group) => {
            const defaults = defaultPublicPageCopy[group.key];
            const currentCopy = settings?.pageCopy?.[group.key] || {};
            return (
              <details
                key={group.key}
                open={group.key === "home"}
                className="rounded-lg border border-gray-200"
              >
                <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-900 hover:bg-gray-50">
                  {group.title}
                  <span className="mt-1 block text-sm font-normal text-gray-500">{group.description}</span>
                </summary>
                <div className="grid gap-4 border-t p-4 md:grid-cols-2">
                  {group.fields.map(([fieldKey, label, multiline]) => {
                    const isHeading = fieldKey !== "seoTitle" &&
                      (fieldKey === "title" || fieldKey === "disabledTitle" || fieldKey.endsWith("Title"));
                    const isVisibilityEditable = isVisibilityEditableField(fieldKey, multiline);
                    const defaultLevel = getDefaultHeadingLevel(group.key, fieldKey);
                    const value = currentCopy[fieldKey] ?? defaults[fieldKey];
                    const updateCopy = (key: string, nextValue: string) =>
                      setSettings({
                        ...settings,
                        pageCopy: {
                          ...settings?.pageCopy,
                          [group.key]: {
                            ...currentCopy,
                            [key]: nextValue,
                          },
                        },
                      });

                    return (
                      <div key={fieldKey} className={multiline ? "md:col-span-2" : ""}>
                        <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                          <span>{label}</span>
                          {multiline ? (
                            <textarea
                              rows={3}
                              value={value}
                              onChange={(event) => updateCopy(fieldKey, event.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal"
                            />
                          ) : (
                            <Input
                              value={value}
                              onChange={(event) => updateCopy(fieldKey, event.target.value)}
                            />
                          )}
                        </label>
                        {isHeading && (
                          <label className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                            <span>Nível do título:</span>
                            <select
                              value={currentCopy[`${fieldKey}HeadingLevel`] || defaultLevel}
                              onChange={(event) => updateCopy(`${fieldKey}HeadingLevel`, event.target.value)}
                              className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                            >
                              {["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => (
                                <option key={level} value={level}>{level.toUpperCase()}</option>
                              ))}
                            </select>
                          </label>
                        )}
                        {isVisibilityEditable && (
                          <VisibilityControl
                            label={`Exibir ${isHeading ? "título" : "texto"}`}
                            enabled={currentCopy[`${fieldKey}Enabled`]}
                            onChange={(enabled) => updateCopy(`${fieldKey}Enabled`, String(enabled))}
                          />
                        )}
                      </div>
                    );
                  })}
                  {cardHeadingControls[group.key] && (
                    <div className="grid gap-3 rounded-md bg-gray-50 p-3 md:col-span-2 sm:grid-cols-2">
                      {cardHeadingControls[group.key].map((control) => (
                        <HeadingLevelControl
                          key={control.key}
                          label={control.label}
                          fallback={control.fallback}
                          value={currentCopy[control.key]}
                          onChange={(value) =>
                            setSettings({
                              ...settings,
                              pageCopy: {
                                ...settings?.pageCopy,
                                [group.key]: { ...currentCopy, [control.key]: value },
                              },
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                  {cardVisibilityControls[group.key] && (
                    <fieldset className="space-y-3 rounded-md border p-3 md:col-span-2">
                      <legend className="px-1 text-sm font-semibold text-gray-700">Exibição dos títulos e descrições dos cards</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {cardVisibilityControls[group.key].map((control) => (
                          <VisibilityControl
                            key={control.key}
                            label={`Exibir ${control.label.toLowerCase()}`}
                            enabled={currentCopy[control.key]}
                            onChange={(enabled) =>
                              setSettings({
                                ...settings,
                                pageCopy: {
                                  ...settings?.pageCopy,
                                  [group.key]: { ...currentCopy, [control.key]: String(enabled) },
                                },
                              })
                            }
                          />
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {sectionVisibilityControls[group.key] && (
                    <fieldset className="space-y-3 rounded-md border p-3 md:col-span-2">
                      <legend className="px-1 text-sm font-semibold text-gray-700">Exibição de seções e listas</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {sectionVisibilityControls[group.key].map((control) => (
                          <VisibilityControl
                            key={control.key}
                            label={`Exibir ${control.label.toLowerCase()}`}
                            enabled={currentCopy[control.key]}
                            onChange={(enabled) =>
                              setSettings({
                                ...settings,
                                pageCopy: {
                                  ...settings?.pageCopy,
                                  [group.key]: { ...currentCopy, [control.key]: String(enabled) },
                                },
                              })
                            }
                          />
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {(group.key === "tourDetails" || group.key === "transferDetails") && (
                    <div className="grid gap-3 rounded-md bg-gray-50 p-3 md:col-span-2 sm:grid-cols-2">
                      <HeadingLevelControl
                        label={`Nível do título do ${group.key === "tourDetails" ? "passeio" : "transfer"}`}
                        fallback="h1"
                        value={currentCopy.productNameHeadingLevel}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            pageCopy: {
                              ...settings?.pageCopy,
                              [group.key]: { ...currentCopy, productNameHeadingLevel: value },
                            },
                          })
                        }
                      />
                      {[
                        ["productNameEnabled", "título do produto"],
                        ["productDescriptionEnabled", "descrição do produto"],
                        ["productLongDescriptionEnabled", "descrição completa do produto"],
                      ].map(([key, label]) => (
                        <VisibilityControl
                          key={key}
                          label={`Exibir ${label}`}
                          enabled={currentCopy[key]}
                          onChange={(enabled) =>
                            setSettings({
                              ...settings,
                              pageCopy: {
                                ...settings?.pageCopy,
                                [group.key]: { ...currentCopy, [key]: String(enabled) },
                              },
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </CardContent>
      </Card>

      <Card id="sobre-empresa" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Conteúdo da página “Sobre a empresa”</CardTitle>
          <CardDescription>
            Todos os campos deste bloco alimentam a página /sobre. Eles não são os metadados de SEO nem os textos do rodapé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título principal da página</label>
            <Input
              placeholder="Sobre a Transfer Fortaleza Tur"
              value={settings?.aboutSection?.title || defaultAboutSection.title}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings?.aboutSection, title: e.target.value },
                })
              }
            />
            <HeadingLevelControl
              label="Nível do título principal"
              fallback="h1"
              value={settings?.aboutSection?.titleHeadingLevel}
              onChange={(value) => setSettings({
                ...settings,
                aboutSection: { ...settings?.aboutSection, titleHeadingLevel: value },
              })}
            />
            <VisibilityControl
              label="Exibir título principal"
              enabled={settings?.aboutSection?.titleEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings?.aboutSection, titleEnabled: String(enabled) },
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto de apresentação</label>
            <textarea
              className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={settings?.aboutSection?.pageIntro || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, pageIntro: e.target.value },
                })
              }
            />
            <VisibilityControl
              label="Exibir texto de apresentação"
              enabled={settings?.aboutSection?.pageIntroEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, pageIntroEnabled: String(enabled) },
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Título da seção de história</label>
            <Input
              value={settings?.aboutSection?.historyTitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, historyTitle: e.target.value },
                })
              }
            />
            <HeadingLevelControl
              label="Nível do título da história"
              fallback="h2"
              value={settings?.aboutSection?.historyTitleHeadingLevel}
              onChange={(value) => setSettings({
                ...settings,
                aboutSection: { ...settings?.aboutSection, historyTitleHeadingLevel: value },
              })}
            />
            <VisibilityControl
              label="Exibir seção de história"
              enabled={settings?.aboutSection?.historySectionEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings?.aboutSection, historySectionEnabled: String(enabled) },
              })}
            />
            <VisibilityControl
              label="Exibir título da história"
              enabled={settings?.aboutSection?.historyTitleEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, historyTitleEnabled: String(enabled) },
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">História da empresa</label>
            <textarea
              className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Conte a história da empresa"
              value={settings?.aboutSection?.description || defaultAboutSection.description}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings?.aboutSection, description: e.target.value },
                })
              }
            />
            <VisibilityControl
              label="Exibir descrição da história"
              enabled={settings?.aboutSection?.descriptionEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings?.aboutSection, descriptionEnabled: String(enabled) },
              })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(settings?.aboutSection?.stats || defaultAboutSection.stats).map((stat: { value: number; label: string }, index: number) => {
            return (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium">Indicador {index + 1}</p>
                  <label className="block space-y-1 text-sm">
                    <span>Número</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Ex.: 10"
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                        stats[index] = { ...stats[index], value: Number(e.target.value) };
                        setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                      }}
                    />
                  </label>
                  <label className="block space-y-1 text-sm">
                    <span>Legenda exibida abaixo do número</span>
                    <Input
                      placeholder="Ex.: Anos de experiência"
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                        stats[index] = { ...stats[index], label: e.target.value };
                        setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                      stats.splice(index, 1);
                      setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                    }}
                  >
                    Remover indicador
                  </Button>
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings({
                ...settings,
                aboutSection: {
                  ...settings?.aboutSection,
                  stats: [...(settings?.aboutSection?.stats || defaultAboutSection.stats), { value: 0, label: "" }],
                },
              })}
            >
              Adicionar indicador
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título da missão</label>
              <Input
                value={settings?.aboutSection?.missionTitle || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionTitle: e.target.value },
                })}
              />
              <HeadingLevelControl
                label="Nível do título da missão"
                fallback="h3"
                value={settings?.aboutSection?.missionTitleHeadingLevel}
                onChange={(value) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionTitleHeadingLevel: value },
                })}
              />
              <VisibilityControl
                label="Exibir seção da missão"
                enabled={settings?.aboutSection?.missionSectionEnabled}
                onChange={(enabled) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionSectionEnabled: String(enabled) },
                })}
              />
              <label className="block text-sm font-medium">Texto da missão</label>
              <textarea
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings?.aboutSection?.missionText || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionText: e.target.value },
                })}
              />
              <VisibilityControl
                label="Exibir texto da missão"
                enabled={settings?.aboutSection?.missionTextEnabled}
                onChange={(enabled) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionTextEnabled: String(enabled) },
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Título da visão</label>
              <Input
                value={settings?.aboutSection?.visionTitle || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionTitle: e.target.value },
                })}
              />
              <HeadingLevelControl
                label="Nível do título da visão"
                fallback="h3"
                value={settings?.aboutSection?.visionTitleHeadingLevel}
                onChange={(value) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionTitleHeadingLevel: value },
                })}
              />
              <VisibilityControl
                label="Exibir seção da visão"
                enabled={settings?.aboutSection?.visionSectionEnabled}
                onChange={(enabled) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionSectionEnabled: String(enabled) },
                })}
              />
              <label className="block text-sm font-medium">Texto da visão</label>
              <textarea
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings?.aboutSection?.visionText || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionText: e.target.value },
                })}
              />
              <VisibilityControl
                label="Exibir texto da visão"
                enabled={settings?.aboutSection?.visionTextEnabled}
                onChange={(enabled) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionTextEnabled: String(enabled) },
                })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Título dos valores</label>
            <Input
              value={settings?.aboutSection?.valuesTitle || ""}
              onChange={(e) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, valuesTitle: e.target.value },
              })}
            />
            <HeadingLevelControl
              label="Nível do título dos valores"
              fallback="h3"
              value={settings?.aboutSection?.valuesTitleHeadingLevel}
              onChange={(value) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, valuesTitleHeadingLevel: value },
              })}
            />
            <VisibilityControl
              label="Exibir título dos valores"
              enabled={settings?.aboutSection?.valuesTitleEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, valuesTitleEnabled: String(enabled) },
              })}
            />
            <VisibilityControl
              label="Exibir seção de valores"
              enabled={settings?.aboutSection?.valuesSectionEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, valuesSectionEnabled: String(enabled) },
              })}
            />
            <label className="text-sm font-medium">Valores (um por linha)</label>
            <textarea
              className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={(settings?.aboutSection?.values || []).join("\n")}
              onChange={(e) => setSettings({
                ...settings,
                aboutSection: {
                  ...settings.aboutSection,
                  values: e.target.value.split("\n"),
                },
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Título dos números</label>
            <Input
              value={settings?.aboutSection?.statsTitle || ""}
              onChange={(e) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, statsTitle: e.target.value },
              })}
            />
            <HeadingLevelControl
              label="Nível do título dos números"
              fallback="h2"
              value={settings?.aboutSection?.statsTitleHeadingLevel}
              onChange={(value) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, statsTitleHeadingLevel: value },
              })}
            />
            <VisibilityControl
              label="Exibir título dos números"
              enabled={settings?.aboutSection?.statsTitleEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, statsTitleEnabled: String(enabled) },
              })}
            />
            <VisibilityControl
              label="Exibir seção de números"
              enabled={settings?.aboutSection?.statsSectionEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, statsSectionEnabled: String(enabled) },
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Título da seção de diferenciais</label>
            <Input
              value={settings?.aboutSection?.whyChooseTitle || ""}
              onChange={(e) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, whyChooseTitle: e.target.value },
              })}
            />
            <HeadingLevelControl
              label="Nível do título dos diferenciais"
              fallback="h2"
              value={settings?.aboutSection?.whyChooseTitleHeadingLevel}
              onChange={(value) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, whyChooseTitleHeadingLevel: value },
              })}
            />
            <VisibilityControl
              label="Exibir título dos diferenciais"
              enabled={settings?.aboutSection?.whyChooseTitleEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, whyChooseTitleEnabled: String(enabled) },
              })}
            />
            <VisibilityControl
              label="Exibir seção de diferenciais"
              enabled={settings?.aboutSection?.benefitsSectionEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, benefitsSectionEnabled: String(enabled) },
              })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <VisibilityControl
              label="Exibir títulos dos diferenciais"
              enabled={settings?.aboutSection?.benefitTitleEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, benefitTitleEnabled: String(enabled) },
              })}
            />
            <VisibilityControl
              label="Exibir descrições dos diferenciais"
              enabled={settings?.aboutSection?.benefitDescriptionEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                aboutSection: { ...settings.aboutSection, benefitDescriptionEnabled: String(enabled) },
              })}
            />
            {(settings?.aboutSection?.benefits || defaultAboutSection.benefits).map((benefit: any, index: number) => (
              <div key={index} className="space-y-2 rounded-md border p-3">
                <p className="text-sm font-medium">Diferencial {index + 1}</p>
                <label className="block text-sm font-medium">Título</label>
                <Input
                  value={benefit.title}
                  onChange={(e) => {
                    const benefits = [...settings.aboutSection.benefits];
                    benefits[index] = { ...benefit, title: e.target.value };
                    setSettings({ ...settings, aboutSection: { ...settings.aboutSection, benefits } });
                  }}
                />
                <label className="block text-sm font-medium">Descrição</label>
                <textarea
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={benefit.description}
                  onChange={(e) => {
                    const benefits = [...settings.aboutSection.benefits];
                    benefits[index] = { ...benefit, description: e.target.value };
                    setSettings({ ...settings, aboutSection: { ...settings.aboutSection, benefits } });
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const benefits = [...(settings?.aboutSection?.benefits || defaultAboutSection.benefits)];
                    benefits.splice(index, 1);
                    setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, benefits } });
                  }}
                >
                  Remover diferencial
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettings({
                ...settings,
                aboutSection: {
                  ...settings?.aboutSection,
                  benefits: [...(settings?.aboutSection?.benefits || defaultAboutSection.benefits), { title: "", description: "" }],
                },
              })}
            >
              Adicionar diferencial
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
        <Button variant="outline" onClick={fetchSettings}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
