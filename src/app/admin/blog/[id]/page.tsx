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
    published: false,
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch blog post");
        const data = await response.json();
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          summary: data.summary || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
          imageAlt: data.imageAlt || "",
          author: data.author || "",
          published: data.published ?? false,
        });
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast.error("Erro ao carregar artigo");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [params.id]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle,
      slug: generateSlug(newTitle),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update blog post");

      toast.success("Artigo atualizado com sucesso");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Erro ao atualizar artigo");
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
        <h1 className="text-3xl font-bold">Editar Artigo</h1>
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
                onChange={handleTitleChange}
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

        <div className="flex gap-2">
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
