"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useBanners } from "@/hooks/useApi";

export default function BannersAdmin() {
  const { data: banners, loading, error, refetch } = useBanners();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Banner deleted successfully");
      // Refetch banners
      refetch();
    } catch (error) {
      toast.error("Failed to delete banner");
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Banners</h1>
          <p className="text-muted-foreground">
            Gerenciar banners da página inicial
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/banners/new">Novo Banner</Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {!banners || banners.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum banner encontrado. Crie o primeiro banner para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner: any) => (
            <Card key={banner.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle>{banner.title}</CardTitle>
                    <CardDescription>{banner.subtitle}</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/banners/${banner.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={banner.imageUrl}
                    alt={banner.imageAlt}
                    className="h-40 w-full rounded object-cover sm:h-20 sm:w-32"
                  />
                  <div className="min-w-0 flex-1 break-words">
                    <p className="text-sm">
                      <span className="font-medium">Botão:</span> {banner.buttonText}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Link:</span> {banner.buttonLink}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {banner.active ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog would go here */}
    </div>
  );
}
