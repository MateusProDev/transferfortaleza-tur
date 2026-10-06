"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

export default function NewBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
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
    published: true,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: slugEdited ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
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
      if (!response.ok) throw new Error(result?.error || `Falha ao criar artigo (HTTP ${response.status}).`);

      toast.success("Artigo criado com sucesso");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao criar artigo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo artigo do blog</h1>
        <p className="text-muted-foreground">Cadastre o conteúdo, a imagem e os dados de SEO do artigo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Post</CardTitle>
          <CardDescription>Preencha os detalhes do post</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="ex: minha-nova-publicacao"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resumo</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Breve descrição do post"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Autor</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Nome do autor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Ex.: Dicas de viagem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Fortaleza, praias, turismo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={10}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Pode usar Markdown para títulos, subtítulos, listas e links.
              </p>
            </div>
            <ImageUpload
              label="Imagem do Post"
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Publicado</label>
            </div>
            <div className="space-y-3 border-t pt-4">
              <h2 className="text-lg font-semibold">SEO do artigo</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Título SEO</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição SEO</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Palavras-chave (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blog")}
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
