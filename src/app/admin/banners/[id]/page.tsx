"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { useBanners } from "@/hooks/useApi";

export default function EditBanner() {
  const router = useRouter();
  const params = useParams();
  const { refetch } = useBanners();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    imageAlt: "",
    buttonText: "",
    buttonLink: "",
    active: true,
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/banners/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Banner não encontrado");
            router.push("/admin/banners");
            return;
          }
          throw new Error("Failed to fetch banner");
        }
        const banner = await response.json();
        setFormData({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          imageUrl: banner.imageUrl || "",
          imageAlt: banner.imageAlt || "",
          buttonText: banner.buttonText || "",
          buttonLink: banner.buttonLink || "",
          active: banner.active ?? true,
        });
      } catch (error) {
        toast.error("Erro ao carregar banner");
        router.push("/admin/banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/banners/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update banner");

      toast.success("Banner atualizado com sucesso");
      refetch();
      router.push("/admin/banners");
    } catch (error) {
      toast.error("Erro ao atualizar banner");
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Banner</h1>
        <p className="text-muted-foreground">Editar informações do banner</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Banner</CardTitle>
          <CardDescription>Atualize os detalhes do banner</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtítulo</label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={4}
              />
            </div>
            <ImageUpload
              label="Imagem do Banner"
              currentImage={formData.imageUrl}
              onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Alt da Imagem</label>
              <input
                type="text"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Texto do Botão</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: Saiba mais"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Link do Botão</label>
              <input
                type="url"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Ativo</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/banners")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
