"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useBlogs } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Image from "next/image";

export default function BlogAdmin() {
  const { data: blogs, loading, refetch } = useBlogs(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Artigo excluído com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir artigo");
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">
            Gerenciar artigos do blog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">Novo Artigo</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {!blogs || blogs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum artigo encontrado. Crie o primeiro artigo!
              </p>
            </CardContent>
          </Card>
        ) : (
          blogs.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {post.imageUrl && (
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1 truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.summary}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDate(post.createdAt)}</span>
                          <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {post.published ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/blog/${post.id}`}>Editar</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          Excluir
                        </Button>
                      </div>
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
