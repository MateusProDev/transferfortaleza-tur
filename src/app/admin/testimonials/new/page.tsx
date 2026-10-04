"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function NewTestimonial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    text: "",
    rating: 5,
    clientPhoto: "",
    clientPhotoAlt: "",
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create testimonial");

      toast.success("Testimonial created successfully");
      router.push("/admin/testimonials");
    } catch (error) {
      toast.error("Failed to create testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Depoimento</h1>
        <p className="text-muted-foreground">Criar um novo depoimento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Depoimento</CardTitle>
          <CardDescription>Preencha os detalhes do depoimento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Cliente</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Depoimento</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Avaliação (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <ImageUpload
              label="Foto do Cliente"
              currentImage={formData.clientPhoto}
              onImageUpload={(url) => setFormData({ ...formData, clientPhoto: url })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Alt da Foto</label>
              <input
                type="text"
                value={formData.clientPhotoAlt}
                onChange={(e) => setFormData({ ...formData, clientPhotoAlt: e.target.value })}
                className="w-full px-3 py-2 border rounded"
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
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Depoimento"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/testimonials")}
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
