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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
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
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{banner.title}</CardTitle>
                    <CardDescription>{banner.subtitle}</CardDescription>
                  </div>
                  <div className="flex gap-2">
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
                <div className="flex gap-4">
                  <img
                    src={banner.imageUrl}
                    alt={banner.imageAlt}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
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
