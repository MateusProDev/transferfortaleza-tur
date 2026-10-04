"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTestimonials } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Image from "next/image";

export default function TestimonialsAdmin() {
  const { data: testimonials, loading, refetch } = useTestimonials();

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Depoimento excluído com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir depoimento");
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
          <h1 className="text-3xl font-bold">Depoimentos</h1>
          <p className="text-muted-foreground">
            Gerenciar depoimentos de clientes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">Novo Depoimento</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {!testimonials || testimonials.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum depoimento encontrado. Crie o primeiro depoimento!
              </p>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial: any) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {testimonial.clientPhoto && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={testimonial.clientPhoto}
                        alt={testimonial.clientPhotoAlt || testimonial.clientName}
                        fill
                        className="object-cover rounded-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">{testimonial.clientName}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{testimonial.text}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/testimonials/${testimonial.id}`}>Editar</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
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
