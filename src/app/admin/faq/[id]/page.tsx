"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditFAQ() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    active: true,
  });

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch(`/api/faq/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch FAQ");
        const data = await response.json();
        setFormData({
          question: data.question || "",
          answer: data.answer || "",
          category: data.category || "",
          active: data.active ?? true,
        });
      } catch (error) {
        console.error("Error fetching FAQ:", error);
        toast.error("Erro ao carregar pergunta");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/faq/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update FAQ");

      toast.success("Pergunta atualizada com sucesso");
      router.push("/admin/faq");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Erro ao atualizar pergunta");
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
        <h1 className="text-3xl font-bold">Editar Pergunta</h1>
        <p className="text-muted-foreground">
          Atualize as informações da pergunta frequente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pergunta e Resposta</CardTitle>
            <CardDescription>Conteúdo da pergunta frequente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pergunta</label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Digite a pergunta..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Resposta</label>
              <textarea
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[150px]"
                placeholder="Digite a resposta..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Ex: Geral, Reservas, Pagamentos..."
              />
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
                Pergunta ativa
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
            onClick={() => router.push("/admin/faq")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
