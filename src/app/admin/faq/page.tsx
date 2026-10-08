"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useFAQs } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function FAQAdmin() {
  const { data: faqs, loading, refetch } = useFAQs();

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return;

    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Pergunta excluída com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir pergunta");
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
          <h1 className="text-2xl font-bold sm:text-3xl">FAQ</h1>
          <p className="text-muted-foreground">
            Gerenciar perguntas frequentes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/faq/new">Nova Pergunta</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            Esta tela gerencia as perguntas e respostas. Para editar o título, a introdução ou a exibição do bloco de FAQ na Home, use Configurações do site.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/settings#copy-faq">Editar textos do FAQ na Home</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {!faqs || faqs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhuma pergunta encontrada. Crie a primeira pergunta!
              </p>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq: any) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/faq/${faq.id}`}>Editar</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      Excluir
                    </Button>
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
