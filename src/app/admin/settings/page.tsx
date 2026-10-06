"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { defaultContactCopy } from "@/lib/site-copy";
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
  { id: "tours", label: "Passeios", url: "/passeios", order: 0, active: true },
  { id: "transfers", label: "Transfer", url: "/transfer", order: 1, active: true },
  { id: "blog", label: "Blog", url: "/blog", order: 2, active: true },
  { id: "about", label: "Sobre", url: "/sobre", order: 3, active: true },
  { id: "contact", label: "Contato", url: "/contato", order: 4, active: true },
];

const defaultFooterLinks = [
  { id: "packages", label: "Pacotes", url: "/passeios", active: true },
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

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

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
          Gerencie identidade, SEO, navegação, contato e informações institucionais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Configure a logo do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Logo do Cabeçalho</label>
            <ImageUpload
              currentImage={settings?.headerLogo}
              label=""
              compact
              onImageUpload={(url) =>
                setSettings({
                  ...settings,
                  headerLogo: url,
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Logo do Rodapé</label>
            <ImageUpload
              currentImage={settings?.footerLogo}
              label=""
              compact
              onImageUpload={(url) => setSettings({ ...settings, footerLogo: url })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto Alternativo da Logo</label>
            <Input
              placeholder="Transfer Fortaleza Tur"
              value={settings?.headerLogoAlt || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  headerLogoAlt: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Configure as informações básicas do seu site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título do Site</label>
            <Input
              placeholder="Transfer Fortaleza Tur"
              value={settings?.seoSettings?.siteTitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings?.seoSettings,
                    siteTitle: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              placeholder="Descrição do site"
              value={settings?.seoSettings?.siteDescription || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings?.seoSettings,
                    siteDescription: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto de apresentação da página</label>
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
          </div>
          <div>
            <label className="text-sm font-medium">Título da história</label>
            <Input
              value={settings?.aboutSection?.historyTitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, historyTitle: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Imagem para compartilhamento (Open Graph)</label>
            <ImageUpload
              currentImage={settings?.seoSettings?.ogImage}
              label=""
              banner
              onImageUpload={(url) =>
                setSettings({
                  ...settings,
                  seoSettings: { ...settings?.seoSettings, ogImage: url },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Palavras-chave (separadas por vírgula)</label>
            <Input
              value={settings?.seoSettings?.keywords?.join(", ") || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seoSettings: {
                    ...settings?.seoSettings,
                    keywords: e.target.value.split(",").map((keyword: string) => keyword.trim()).filter(Boolean),
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navegação</CardTitle>
          <CardDescription>Edite os links do cabeçalho e do rodapé sem alterar os endereços das páginas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Menu do cabeçalho</h3>
            {(settings?.menuLinks || defaultMenuLinks).map((link: any, index: number) => (
              <div key={link.id || index} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                <Input
                  aria-label={`Texto do link ${index + 1}`}
                  placeholder="Texto"
                  value={link.label || ""}
                  onChange={(e) => {
                    const links = [...settings.menuLinks];
                    links[index] = { ...link, label: e.target.value };
                    setSettings({ ...settings, menuLinks: links });
                  }}
                />
                <Input
                  aria-label={`URL do link ${index + 1}`}
                  placeholder="/passeios"
                  value={link.url || ""}
                  onChange={(e) => {
                    const links = [...settings.menuLinks];
                    links[index] = { ...link, url: e.target.value };
                    setSettings({ ...settings, menuLinks: links });
                  }}
                />
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
                  Ativo
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSettings({
                    ...settings,
                    menuLinks: settings.menuLinks.filter((_: unknown, itemIndex: number) => itemIndex !== index),
                  })}
                >
                  Remover
                </Button>
              </div>
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
            <h3 className="font-medium">Links rápidos do rodapé</h3>
            {(settings?.footerLinks || defaultFooterLinks).map((link: any, index: number) => (
              <div key={link.id || index} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                <Input
                  aria-label={`Texto do link de rodapé ${index + 1}`}
                  placeholder="Texto"
                  value={link.label || ""}
                  onChange={(e) => {
                    const links = [...settings.footerLinks];
                    links[index] = { ...link, label: e.target.value };
                    setSettings({ ...settings, footerLinks: links });
                  }}
                />
                <Input
                  aria-label={`URL do link de rodapé ${index + 1}`}
                  placeholder="/contato"
                  value={link.url || ""}
                  onChange={(e) => {
                    const links = [...settings.footerLinks];
                    links[index] = { ...link, url: e.target.value };
                    setSettings({ ...settings, footerLinks: links });
                  }}
                />
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
                  Ativo
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSettings({
                    ...settings,
                    footerLinks: settings.footerLinks.filter((_: unknown, itemIndex: number) => itemIndex !== index),
                  })}
                >
                  Remover
                </Button>
              </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
          <CardDescription>Informações de contato do seu negócio</CardDescription>
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
              placeholder="(11) 99999-9999"
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
            <label className="text-sm font-medium">WhatsApp</label>
            <Input
              placeholder="(11) 99999-9999"
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

      <Card>
        <CardHeader>
          <CardTitle>Identidade do rodapé</CardTitle>
          <CardDescription>Edite o nome e o texto institucional exibidos no rodapé.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da empresa</label>
            <Input
              value={settings?.companyName || ""}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição do rodapé</label>
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
                  label=""
                  compact
                  onImageUpload={(url) => setSettings({ ...settings, [imageKey]: url })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Texto alternativo</label>
                <Input
                  value={settings?.[altKey] || fallbackAlt}
                  onChange={(e) => setSettings({ ...settings, [altKey]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes sociais</CardTitle>
          <CardDescription>Configure os destinos dos ícones sociais exibidos no rodapé.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(settings?.socialLinks || []).map((link: any, index: number) => (
            <div key={link.id || index} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_2fr_auto]">
              <select
                aria-label={`Rede social ${index + 1}`}
                value={link.platform || "instagram"}
                onChange={(event) => {
                  const socialLinks = [...settings.socialLinks];
                  socialLinks[index] = { ...link, platform: event.target.value };
                  setSettings({ ...settings, socialLinks });
                }}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {["facebook", "instagram", "whatsapp", "youtube", "twitter"].map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setSettings({
                  ...settings,
                  socialLinks: settings.socialLinks.filter((_: unknown, itemIndex: number) => itemIndex !== index),
                })}
              >
                Remover
              </Button>
            </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Textos da página de contato</CardTitle>
          <CardDescription>
            Títulos, horários, rótulos do formulário, mensagens e textos dos botões da página /contato.
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
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seções do Site</CardTitle>
          <CardDescription>Ative ou desative seções do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Passeios</label>
              <p className="text-xs text-muted-foreground">Mostrar seção de passeios no site</p>
            </div>
            <input
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
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Transfer</label>
              <p className="text-xs text-muted-foreground">Mostrar seção de transfer no site</p>
            </div>
            <input
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

      <Card>
        <CardHeader>
          <CardTitle>Sobre a Transfer Fortaleza Tur</CardTitle>
          <CardDescription>Edite o texto e os números exibidos na seção sobre a empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
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
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => {
              const stat = settings?.aboutSection?.stats?.[index] || defaultAboutSection.stats[index];
              return (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">Estatística {index + 1}</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="10"
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                      stats[index] = { ...stats[index], value: Number(e.target.value) };
                      setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                    }}
                  />
                  <Input
                    placeholder="Anos de Experiência"
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...(settings?.aboutSection?.stats || defaultAboutSection.stats)];
                      stats[index] = { ...stats[index], label: e.target.value };
                      setSettings({ ...settings, aboutSection: { ...settings?.aboutSection, stats } });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título e texto da missão</label>
              <Input
                value={settings?.aboutSection?.missionTitle || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionTitle: e.target.value },
                })}
              />
              <textarea
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings?.aboutSection?.missionText || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, missionText: e.target.value },
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Título e texto da visão</label>
              <Input
                value={settings?.aboutSection?.visionTitle || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionTitle: e.target.value },
                })}
              />
              <textarea
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={settings?.aboutSection?.visionText || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionText: e.target.value },
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
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(settings?.aboutSection?.benefits || defaultAboutSection.benefits).map((benefit: any, index: number) => (
              <div key={index} className="space-y-2 rounded-md border p-3">
                <label className="text-sm font-medium">Diferencial {index + 1}</label>
                <Input
                  value={benefit.title}
                  onChange={(e) => {
                    const benefits = [...settings.aboutSection.benefits];
                    benefits[index] = { ...benefit, title: e.target.value };
                    setSettings({ ...settings, aboutSection: { ...settings.aboutSection, benefits } });
                  }}
                />
                <textarea
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={benefit.description}
                  onChange={(e) => {
                    const benefits = [...settings.aboutSection.benefits];
                    benefits[index] = { ...benefit, description: e.target.value };
                    setSettings({ ...settings, aboutSection: { ...settings.aboutSection, benefits } });
                  }}
                />
              </div>
            ))}
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
