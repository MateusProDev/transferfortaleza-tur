"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    imageUrl: "",
    imageAlt: "",
    author: "",
    category: "",
    tags: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    published: false,
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error || `Falha ao carregar artigo (HTTP ${response.status}).`);
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          summary: data.summary || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
          imageAlt: data.imageAlt || "",
          author: data.author || "",
          category: data.category || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          seoTitle: data.seo?.title || "",
          seoDescription: data.seo?.description || "",
          seoKeywords: Array.isArray(data.seo?.keywords) ? data.seo.keywords.join(", ") : "",
          published: data.published ?? false,
        });
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast.error(error instanceof Error ? error.message : "Erro ao carregar artigo");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          seo: {
            title: formData.seoTitle,
            description: formData.seoDescription,
            keywords: formData.seoKeywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
          },
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || `Falha ao atualizar artigo (HTTP ${response.status}).`);

      toast.success("Artigo atualizado com sucesso");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar artigo");
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
        <h1 className="text-2xl font-bold sm:text-3xl">Editar Artigo</h1>
        <p className="text-muted-foreground">
          Atualize as informações do artigo do blog
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Título e resumo do artigo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Título do artigo"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="url-do-artigo"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Resumo</label>
              <textarea
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[100px]"
                placeholder="Breve descrição do artigo..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Autor</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Nome do autor"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Ex.: Dicas de viagem"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Fortaleza, praias, turismo"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagem</CardTitle>
            <CardDescription>Imagem de destaque do artigo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Imagem de Destaque</label>
              <ImageUpload
                currentImage={formData.imageUrl}
                onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Texto Alternativo da Imagem</label>
              <input
                type="text"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Descrição da imagem para acessibilidade"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
            <CardDescription>Conteúdo completo do artigo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Conteúdo</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[300px]"
                placeholder="Escreva o conteúdo do artigo aqui..."
              />
              <p className="text-xs text-muted-foreground">
                Pode usar Markdown para títulos, subtítulos, listas e links.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Artigo publicado
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO do artigo</CardTitle>
            <CardDescription>Metadados para os mecanismos de busca. Se deixar vazio, o site usa o título e o resumo do artigo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título SEO</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição SEO</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Palavras-chave (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/blog")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
