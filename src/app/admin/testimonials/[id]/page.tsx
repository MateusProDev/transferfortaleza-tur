"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EditTestimonial() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhoto: "",
    clientPhotoAlt: "",
    text: "",
    rating: 5,
    active: true,
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(`/api/testimonials/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch testimonial");
        const data = await response.json();
        setFormData({
          clientName: data.clientName || "",
          clientPhoto: data.clientPhoto || "",
          clientPhotoAlt: data.clientPhotoAlt || "",
          text: data.text || "",
          rating: data.rating || 5,
          active: data.active ?? true,
        });
      } catch (error) {
        console.error("Error fetching testimonial:", error);
        toast.error("Erro ao carregar depoimento");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/testimonials/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update testimonial");

      toast.success("Depoimento atualizado com sucesso");
      router.push("/admin/testimonials");
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Erro ao atualizar depoimento");
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
        <h1 className="text-3xl font-bold">Editar Depoimento</h1>
        <p className="text-muted-foreground">
          Atualize as informações do depoimento do cliente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
            <CardDescription>Dados do cliente que deixou o depoimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Cliente</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Foto do Cliente</label>
              <ImageUpload
                currentImage={formData.clientPhoto}
                onImageUpload={(url) => setFormData({ ...formData, clientPhoto: url })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Texto Alternativo da Foto</label>
              <input
                type="text"
                value={formData.clientPhotoAlt}
                onChange={(e) => setFormData({ ...formData, clientPhotoAlt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Descrição da foto para acessibilidade"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Depoimento</CardTitle>
            <CardDescription>Conteúdo do depoimento e avaliação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Texto do Depoimento</label>
              <textarea
                required
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[150px]"
                placeholder="O que o cliente disse sobre o serviço..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Avaliação (1-5 estrelas)</label>
              <select
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {"★".repeat(rating)} {"☆".repeat(5 - rating)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
              />
              <label htmlFor="active" className="text-sm font-medium">
                Depoimento ativo
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/testimonials")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
