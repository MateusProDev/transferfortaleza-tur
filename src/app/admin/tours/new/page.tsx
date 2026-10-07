"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import ImageGalleryUpload from "@/components/ui/ImageGalleryUpload";
import { GalleryImage } from "@/types";
import { useTours } from "@/hooks/useApi";
import { TourFAQ } from "@/types";
import { DEFAULT_TOUR_FAQS } from "@/components/public/TourFAQ";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewTour() {
  const router = useRouter();
  const { data: tours, refetch } = useTours(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    duration: "",
    price: "",
    order: "",
    active: true,
    featured: false,
    mainImageUrl: "",
    mainImageAlt: "",
    galleryImages: [] as GalleryImage[],
    includesItems: "",
    excludesItems: "",
    faqs: DEFAULT_TOUR_FAQS,
    recommendedTourIds: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number(formData.price) : undefined,
          order: formData.order ? Number(formData.order) : undefined,
          includesItems: formData.includesItems.split(",").map((item) => item.trim()).filter(Boolean),
          excludesItems: formData.excludesItems.split(",").map((item) => item.trim()).filter(Boolean),
          faqs: formData.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to create tour");

      toast.success("Passeio criado com sucesso");
      refetch();
      router.push("/admin/tours");
    } catch (error) {
      toast.error("Erro ao criar passeio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Novo Passeio</h1>
        <p className="text-muted-foreground">Criar um novo passeio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Passeio</CardTitle>
          <CardDescription>Preencha os detalhes do passeio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL amigável (slug)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: passeio-cumbuco"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição completa</label>
              <RichTextEditor
                label="Descrição longa do passeio"
                value={formData.longDescription}
                onChange={(longDescription) => setFormData({ ...formData, longDescription })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duração</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: 4 horas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço (opcional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ordem de exibição</label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <ImageUpload
              label="Imagem Principal"
              currentImage={formData.mainImageUrl}
              currentAlt={formData.mainImageAlt}
              banner
              onImageUpload={(url, alt) => setFormData((current) => ({ ...current, mainImageUrl: url, mainImageAlt: alt || current.mainImageAlt }))}
              onAltChange={(mainImageAlt) => setFormData((current) => ({ ...current, mainImageAlt }))}
            />
            <ImageGalleryUpload
              label="Imagens adicionais"
              images={formData.galleryImages}
              onImagesChange={(galleryImages) => setFormData({ ...formData, galleryImages })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Itens incluídos (separados por vírgula)</label>
              <textarea
                value={formData.includesItems}
                onChange={(e) => setFormData({ ...formData, includesItems: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Itens não incluídos (separados por vírgula)</label>
              <textarea
                value={formData.excludesItems}
                onChange={(e) => setFormData({ ...formData, excludesItems: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div className="space-y-4 border-t pt-4">
              <h2 className="text-lg font-semibold">Perguntas frequentes deste passeio</h2>
              {formData.faqs.map((faq: TourFAQ, index) => (
                <div key={index} className="space-y-2 rounded border p-4">
                  <label className="block text-sm font-medium">Pergunta {index + 1}</label>
                  <input
                    value={faq.question}
                    onChange={(e) => {
                      const faqs = [...formData.faqs];
                      faqs[index] = { ...faqs[index], question: e.target.value };
                      setFormData({ ...formData, faqs });
                    }}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <label className="block text-sm font-medium">Resposta</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...formData.faqs];
                      faqs[index] = { ...faqs[index], answer: e.target.value };
                      setFormData({ ...formData, faqs });
                    }}
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, faqs: formData.faqs.filter((_, faqIndex) => faqIndex !== index) })}
                    className="text-sm text-destructive hover:underline"
                  >
                    Remover pergunta
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: "", answer: "" }] })}
              >
                Adicionar pergunta
              </Button>
            </div>
            <div className="space-y-3 border-t pt-4">
              <h2 className="text-lg font-semibold">Passeios recomendados</h2>
              <div className="grid gap-2 md:grid-cols-2">
                {(tours || []).map((tour) => (
                  <label key={tour.id} className="flex items-center gap-2 rounded border p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.recommendedTourIds.includes(tour.id)}
                      disabled={!formData.recommendedTourIds.includes(tour.id) && formData.recommendedTourIds.length >= 3}
                      onChange={(e) => {
                        const recommendedTourIds = e.target.checked
                          ? [...formData.recommendedTourIds, tour.id].slice(0, 3)
                          : formData.recommendedTourIds.filter((id) => id !== tour.id);
                        setFormData({ ...formData, recommendedTourIds });
                      }}
                      className="w-4 h-4"
                    />
                    <span>{tour.name}</span>
                  </label>
                ))}
              </div>
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Destaque na página inicial</label>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Passeio"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/tours")}
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
