"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface DashboardStats {
  banners: number;
  tours: number;
  transfers: number;
  testimonials: number;
  blogPosts: number;
  faqItems: number;
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string | { seconds: number };
}

const endpoints = [
  { key: "banners", url: "/api/banners" },
  { key: "tours", url: "/api/tours" },
  { key: "transfers", url: "/api/transfers" },
  { key: "testimonials", url: "/api/testimonials" },
  { key: "blogPosts", url: "/api/blog?published=false" },
  { key: "faqItems", url: "/api/faq" },
];

const entityLabels: Record<string, string> = {
  banners: "banner",
  tours: "passeio",
  transfers: "transfer",
  testimonials: "depoimento",
  blog: "post do blog",
  faq: "item do FAQ",
  settings: "configuracoes",
};

const actionLabels: Record<string, string> = {
  created: "criado",
  updated: "atualizado",
  deleted: "excluido",
};

function formatActivityDate(timestamp: Activity["timestamp"]) {
  const date = typeof timestamp === "string"
    ? new Date(timestamp)
    : new Date(timestamp.seconds * 1000);
  return date.toLocaleString("pt-BR");
}

function StatCard({ title, value, link }: { title: string; value: number; link: string }) {
  return (
    <Link href={link}>
      <Card className="cursor-pointer border-gray-200 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <p className="mt-2 text-xs text-muted-foreground">Clique para gerenciar</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    banners: 0,
    tours: 0,
    transfers: 0,
    testimonials: 0,
    blogPosts: 0,
    faqItems: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const responses = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(endpoint.url);
            const data = await response.json();
            return {
              key: endpoint.key as keyof DashboardStats,
              value: Array.isArray(data) ? data.length : 0,
            };
          })
        );

        setStats((current) => {
          const next = { ...current };
          responses.forEach((result) => {
            next[result.key] = result.value;
          });
          return next;
        });

        const activityResponse = await fetch("/api/activity");
        if (!activityResponse.ok) {
          throw new Error(`Falha ao carregar atividades (${activityResponse.status})`);
        }
        const activityData = await activityResponse.json();
        setActivities(Array.isArray(activityData) ? activityData : []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    }

    void loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Visão geral</h1>
        <p className="text-muted-foreground">
          Acompanhe os cadastros e acesse as principais áreas de gestão do site.
        </p>
      </div>

      <section aria-labelledby="admin-summary-heading" className="space-y-4">
        <div>
          <h2 id="admin-summary-heading" className="text-xl font-semibold">Resumo dos cadastros</h2>
          <p className="text-sm text-muted-foreground">A quantidade de itens em cada área do painel.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Banners da página inicial" value={stats.banners} link="/admin/banners" />
          <StatCard title="Passeios" value={stats.tours} link="/admin/tours" />
          <StatCard title="Transfers" value={stats.transfers} link="/admin/transfers" />
          <StatCard title="Depoimentos" value={stats.testimonials} link="/admin/testimonials" />
          <StatCard title="Artigos do blog" value={stats.blogPosts} link="/admin/blog" />
          <StatCard title="Perguntas frequentes (FAQ)" value={stats.faqItems} link="/admin/faq" />
        </div>
      </section>

      <section aria-labelledby="admin-create-heading" className="space-y-4">
        <div>
          <h2 id="admin-create-heading" className="text-xl font-semibold">Criar novo cadastro</h2>
          <p className="text-sm text-muted-foreground">Atalhos para adicionar itens ao site.</p>
        </div>
        <Card className="border-gray-200 bg-white shadow-md">
          <CardContent className="grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2 xl:grid-cols-3">
            <Button variant="outline" asChild><Link href="/admin/banners/new">Novo banner</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/tours/new">Novo passeio</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/transfers/new">Novo transfer</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/blog/new">Novo artigo</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/testimonials/new">Novo depoimento</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/faq/new">Nova pergunta frequente</Link></Button>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="admin-site-heading" className="space-y-4">
        <div>
          <h2 id="admin-site-heading" className="text-xl font-semibold">Conteúdo e configuração do site</h2>
          <p className="text-sm text-muted-foreground">
            Edite os textos das seções ou ajuste informações gerais, contato e navegação.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/content" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Card className="h-full border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Textos e seções</CardTitle>
                <CardDescription>
                  Edite textos, imagens e listas dos blocos de conteúdo do site.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/settings" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Card className="h-full border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Configurações do site</CardTitle>
                <CardDescription>
                  Ajuste identidade, informações de contato, navegação e dados institucionais.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      <Card className="border-gray-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">Atividades recentes</CardTitle>
          <CardDescription>Últimas alterações feitas no painel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.length === 0 ? (
            <div className="flex items-start space-x-4 border-b pb-4">
              <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nenhuma atividade ainda</p>
                <p className="text-xs text-muted-foreground">As alterações realizadas aparecerão aqui.</p>
              </div>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {entityLabels[activity.entityType] || activity.entityType} {actionLabels[activity.action] || activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">ID: {activity.entityId}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatActivityDate(activity.timestamp)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
