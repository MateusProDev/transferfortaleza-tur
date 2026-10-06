"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTestimonials } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Image from "next/image";

export default function TestimonialsAdmin() {
  const { data: testimonials, loading, error, refetch } = useTestimonials();

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível excluir o depoimento.");
      toast.success("Depoimento excluído com sucesso");
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir depoimento");
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
          <h1 className="text-2xl font-bold sm:text-3xl">Depoimentos</h1>
          <p className="text-muted-foreground">
            Gerenciar depoimentos de clientes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">Novo Depoimento</Link>
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Está procurando as avaliações que aparecem como “Avaliações do Google” no site?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Elas são diferentes dos depoimentos de clientes desta lista e são editadas na seção própria.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/content?section=googleReviews">Editar avaliações do Google</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {error ? (
          <Card>
            <CardContent className="space-y-3 pt-6">
              <p role="alert" className="text-center text-destructive">
                Não foi possível carregar os depoimentos: {error.message}
              </p>
              <div className="text-center">
                <Button variant="outline" onClick={() => void refetch()}>
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !testimonials || testimonials.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum depoimento cadastrado. Use “Novo Depoimento” para adicionar o primeiro.
              </p>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial: any) => (
            <Card key={testimonial.id} className="min-w-0">
              <CardContent className="pt-6">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-4">
                  {testimonial.clientPhoto && (
                    <div className="relative h-16 w-16 flex-shrink-0 self-start overflow-hidden rounded-full">
                      <Image
                        src={testimonial.clientPhoto}
                        alt={testimonial.clientPhotoAlt || testimonial.clientName}
                        fill
                        className="object-cover rounded-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="w-full min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="break-words text-lg font-semibold">{testimonial.clientName || "Sem nome"}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        testimonial.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {testimonial.active ? "Ativo no site" : "Inativo — disponível apenas no painel"}
                      </span>
                    </div>
                    <p className="mb-2 mt-1 line-clamp-3 break-words text-sm text-muted-foreground">
                      {testimonial.text || "Sem texto cadastrado"}
                    </p>
                    <div
                      className="flex items-center gap-1"
                      aria-label={`Avaliação: ${testimonial.rating} de 5 estrelas`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          className={`text-sm ${
                            i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                      <Button className="w-full sm:w-auto" variant="outline" size="sm" asChild>
                        <Link href={`/admin/testimonials/${testimonial.id}`}>Editar</Link>
                      </Button>
                      <Button
                        className="w-full sm:w-auto"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        Excluir
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
