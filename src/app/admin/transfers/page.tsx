"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTransfers } from "@/hooks/useApi";

export default function TransfersAdmin() {
  const { data: transfers, loading, error, refetch } = useTransfers(false);

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
          <h1 className="text-3xl font-bold">Transfers</h1>
          <p className="text-muted-foreground">
            Gerenciar seus serviços de transfer
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/transfers/new">Novo Transfer</Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {!transfers || transfers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum transfer encontrado. Crie o primeiro transfer para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {transfers.map((transfer: any) => (
            <Card key={transfer.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{transfer.name}</CardTitle>
                    <CardDescription>{transfer.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/transfers/${transfer.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/transfers/${transfer.id}`, {
                            method: "DELETE",
                          });
                          if (!response.ok) throw new Error("Delete failed");
                          toast.success("Transfer deletado com sucesso");
                          refetch();
                        } catch (error) {
                          toast.error("Erro ao deletar transfer");
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
                    src={transfer.imageUrl}
                    alt={transfer.imageAlt}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Veículo</p>
                      <p className="font-semibold">{transfer.vehicleType || 'Consulte'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Capacidade</p>
                      <p className="font-semibold">{transfer.capacity && transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold">
                        {transfer.active ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
