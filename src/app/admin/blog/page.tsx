"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useBlogs } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Image from "next/image";

export default function BlogAdmin() {
  const { data: blogs, loading, error, refetch } = useBlogs(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || `Falha ao excluir artigo (HTTP ${response.status}).`);
      }
      toast.success("Artigo excluído com sucesso");
      await refetch();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir artigo");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString('pt-BR');
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Blog</h1>
          <p className="text-muted-foreground">
            Gerenciar artigos do blog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">Novo Artigo</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {error ? (
          <Card>
            <CardContent className="space-y-3 pt-6">
              <p role="alert" className="text-center text-red-700">
                Não foi possível carregar os artigos: {error.message}
              </p>
              <div className="text-center">
                <Button variant="outline" onClick={() => void refetch()}>Tentar novamente</Button>
              </div>
            </CardContent>
          </Card>
        ) : !blogs || blogs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum artigo encontrado. Crie o primeiro artigo!
              </p>
            </CardContent>
          </Card>
        ) : (
          blogs.map((post: any) => (
            <Card key={post.id} className="min-w-0">
              <CardContent className="pt-6">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
                  {post.imageUrl && (
                    <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-32">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="w-full min-w-0 flex-1">
                    <h3 className="mb-1 break-words text-lg font-semibold">{post.title}</h3>
                    <p className="mb-2 line-clamp-2 break-words text-sm text-muted-foreground">{post.summary}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(post.createdAt)}</span>
                      <span className={`rounded-full px-2 py-1 ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                      <Button className="w-full sm:w-auto" variant="outline" size="sm" asChild>
                        <Link href={`/admin/blog/${post.id}`}>Editar</Link>
                      </Button>
                      <Button
                        className="w-full sm:w-auto"
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === post.id}
                        onClick={() => handleDelete(post.id)}
                      >
                        {deletingId === post.id ? "Excluindo..." : "Excluir"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
