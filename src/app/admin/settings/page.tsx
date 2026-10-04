"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

const defaultAboutSection = {
  title: "Sobre a Passeio Legal",
  description: "Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo.",
  stats: [
    { value: 10, label: "Anos de Experiência" },
    { value: 5000, label: "Clientes Satisfeitos" },
    { value: 100, label: "Destinos" },
  ],
};

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
      setSettings(data);
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
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerenciar configurações gerais do site
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
            <label className="text-sm font-medium">Texto Alternativo da Logo</label>
            <Input
              placeholder="Passeio Legal"
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
              placeholder="Passeio Legal"
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
          <CardTitle>Sobre a Passeio Legal</CardTitle>
          <CardDescription>Edite o texto e os números exibidos na seção sobre a empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              placeholder="Sobre a Passeio Legal"
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
        </CardContent>
      </Card>

      <div className="flex gap-2">
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
