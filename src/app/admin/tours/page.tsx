"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTours } from "@/hooks/useApi";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function ToursAdmin() {
  const { data: tours, loading, error, refetch } = useTours(false);

  const orderedTours = tours ? [...tours].sort((first: any, second: any) => {
    if (first.featured !== second.featured) return first.featured ? -1 : 1;
    if (first.featured && second.featured) {
      return (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER);
    }
    return first.name.localeCompare(second.name);
  }) : [];

  const moveFeaturedTour = async (tourId: string, direction: "up" | "down") => {
    const featuredTours = orderedTours.filter((tour: any) => tour.featured);
    const currentIndex = featuredTours.findIndex((tour: any) => tour.id === tourId);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= featuredTours.length) return;

    const currentTour = featuredTours[currentIndex];
    const targetTour = featuredTours[targetIndex];

    try {
      const updates = await Promise.all([
        fetch(`/api/tours/${currentTour.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetIndex }),
        }),
        fetch(`/api/tours/${targetTour.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentIndex }),
        }),
      ]);

      if (updates.some((response) => !response.ok)) throw new Error("Order update failed");
      toast.success("Ordem dos destaques atualizada");
      refetch();
    } catch (error) {
      toast.error("Erro ao alterar a ordem dos destaques");
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
          <h1 className="text-3xl font-bold">Passeios</h1>
          <p className="text-muted-foreground">
            Gerenciar seus passeios e excursões
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tours/new">Novo Passeio</Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {!tours || tours.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum passeio encontrado. Crie o primeiro passeio para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orderedTours.map((tour: any) => {
            const featuredTours = orderedTours.filter((item: any) => item.featured);
            const featuredIndex = featuredTours.findIndex((item: any) => item.id === tour.id);

            return (
            <Card key={tour.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{tour.name}</CardTitle>
                    <CardDescription>{tour.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {tour.featured && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveFeaturedTour(tour.id, "up")}
                          disabled={featuredIndex === 0}
                          aria-label={`Mover ${tour.name} para cima`}
                          title="Subir destaque"
                        >
                          <ArrowUp size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveFeaturedTour(tour.id, "down")}
                          disabled={featuredIndex === featuredTours.length - 1}
                          aria-label={`Mover ${tour.name} para baixo`}
                          title="Descer destaque"
                        >
                          <ArrowDown size={16} />
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/tours/${tour.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/tours/${tour.id}`, {
                            method: "DELETE",
                          });
                          if (!response.ok) throw new Error("Delete failed");
                          toast.success("Passeio deletado com sucesso");
                          refetch();
                        } catch (error) {
                          toast.error("Erro ao deletar passeio");
                        }
                      }}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={tour.mainImageUrl}
                    alt={tour.mainImageAlt}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Duração</p>
                      <p className="font-semibold">{tour.duration || 'Consulte'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold">
                        {tour.active ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
