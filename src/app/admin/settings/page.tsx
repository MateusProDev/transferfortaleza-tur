"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import Link from "next/link";
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
          Edite as informações gerais em uma única tela. Use os atalhos para ir direto à área desejada
          e salve as alterações no final da página.
        </p>
      </div>

      <nav aria-label="Atalhos das configurações" className="flex flex-wrap gap-2">
        {[
          ["#marca", "Marca e logos"],
          ["#navegacao", "Menu do site"],
          ["#contato", "Contato"],
          ["#rodape", "Rodapé"],
          ["#redes-sociais", "Redes sociais"],
          ["#textos-contato", "Textos da página Contato"],
          ["#inicio", "Página inicial"],
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
        <Link
          href="/admin/content"
          className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          SEO da página inicial: Textos e seções
        </Link>
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
            <label className="mb-2 block text-sm font-medium">Logo do rodapé</label>
            <ImageUpload
              currentImage={settings?.footerLogo}
              label=""
              compact
              onImageUpload={(url) => setSettings({ ...settings, footerLogo: url })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Se não houver uma logo própria para o rodapé, será usada a logo do cabeçalho.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Texto alternativo da logo do cabeçalho</label>
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
          <div>
            <label className="text-sm font-medium">Texto alternativo da logo do rodapé</label>
            <Input
              placeholder="Transfer Fortaleza Tur"
              value={settings?.footerLogoAlt || ""}
              onChange={(e) => setSettings({ ...settings, footerLogoAlt: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Onde editar o SEO da página inicial?</CardTitle>
          <CardDescription>
            O título, a descrição, as palavras-chave e a imagem de compartilhamento da página inicial ficam em
            “Textos e seções” &gt; “SEO da página inicial”. Essa é a fonte usada pelo site; não há uma cópia desses campos aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/admin/content">Abrir Textos e seções</Link>
          </Button>
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
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => {
              const stat = settings?.aboutSection?.stats?.[index] || defaultAboutSection.stats[index];
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
                </div>
              );
            })}
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
              <label className="block text-sm font-medium">Texto da missão</label>
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
              <label className="text-sm font-medium">Título da visão</label>
              <Input
                value={settings?.aboutSection?.visionTitle || ""}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutSection: { ...settings.aboutSection, visionTitle: e.target.value },
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
