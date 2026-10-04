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
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    imageUrl: "",
    imageAlt: "",
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
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create blog post");

      toast.success("Blog post created successfully");
      router.push("/admin/blog");
    } catch (error) {
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Blog Post</h1>
        <p className="text-muted-foreground">Criar um novo post de blog</p>
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
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
              <label className="block text-sm font-medium mb-2">Conteúdo</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
                rows={10}
              />
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
