"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import ImageGalleryUpload from "@/components/ui/ImageGalleryUpload";
import { GalleryImage, TourFAQ } from "@/types";
import { useTransfers } from "@/hooks/useApi";

export default function NewTransfer() {
  const router = useRouter();
  const { data: transfers, refetch } = useTransfers(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    capacity: "",
    vehicleType: "",
    active: true,
    featuredOnHome: false,
    imageUrl: "",
    imageAlt: "",
    galleryImages: [] as GalleryImage[],
    includesItems: "",
    excludesItems: "",
    faqs: [] as TourFAQ[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          longDescription: formData.longDescription,
          capacity: parseInt(formData.capacity),
          vehicleType: formData.vehicleType,
          imageUrl: formData.imageUrl,
          imageAlt: formData.imageAlt,
          galleryImages: formData.galleryImages,
          active: formData.active,
          featuredOnHome: formData.featuredOnHome,
          includesItems: formData.includesItems.split(",").map((item) => item.trim()).filter(Boolean),
          excludesItems: formData.excludesItems.split(",").map((item) => item.trim()).filter(Boolean),
          faqs: formData.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to create transfer");

      toast.success("Transfer criado com sucesso");
      refetch();
      router.push("/admin/transfers");
    } catch (error) {
      toast.error("Erro ao criar transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Transfer</h1>
        <p className="text-muted-foreground">Criar um novo transfer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Transfer</CardTitle>
          <CardDescription>Preencha os detalhes do transfer</CardDescription>
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
              <textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Capacidade (pessoas)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: 4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Veículo</label>
              <input
                type="text"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex: Sedan, SUV, Van"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">O que está incluído (separado por vírgulas)</label>
              <textarea
                value={formData.includesItems}
                onChange={(e) => setFormData({ ...formData, includesItems: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">O que não está incluído (separado por vírgulas)</label>
              <textarea
                value={formData.excludesItems}
                onChange={(e) => setFormData({ ...formData, excludesItems: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div className="space-y-4 border-t pt-4">
              <div>
                <h2 className="text-lg font-semibold">Perguntas frequentes deste transfer</h2>
                <p className="text-sm text-muted-foreground">Inclua respostas específicas deste serviço. Perguntas gerais do site continuam aparecendo se esta lista ficar vazia.</p>
              </div>
              {formData.faqs.map((faq, index) => (
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
            <ImageUpload
              label="Imagem do Veículo"
              currentImage={formData.imageUrl}
              banner
              onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            <ImageGalleryUpload
              label="Imagens adicionais"
              images={formData.galleryImages}
              onImagesChange={(galleryImages) => setFormData({ ...formData, galleryImages })}
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
                checked={formData.featuredOnHome}
                disabled={!formData.featuredOnHome && (transfers || []).filter((item) => item.featuredOnHome).length >= 3}
                onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Exibir na página inicial (até 3 transfers)</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Transfer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/transfers")}
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
