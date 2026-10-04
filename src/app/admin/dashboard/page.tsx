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
        <h1 className="mb-2 text-3xl font-bold">Painel</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel administrativo da Passeio Legal</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Banners" value={stats.banners} link="/admin/banners" />
        <StatCard title="Passeios" value={stats.tours} link="/admin/tours" />
        <StatCard title="Transfers" value={stats.transfers} link="/admin/transfers" />
        <StatCard title="Depoimentos" value={stats.testimonials} link="/admin/testimonials" />
        <StatCard title="Posts do Blog" value={stats.blogPosts} link="/admin/blog" />
        <StatCard title="Itens do FAQ" value={stats.faqItems} link="/admin/faq" />
      </div>

      <Card className="border-gray-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">Acoes rapidas</CardTitle>
          <CardDescription>Atalhos para as acoes mais comuns</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" asChild><Link href="/admin/banners/new">Novo Banner</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/tours/new">Novo Passeio</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/transfers/new">Novo Transfer</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/blog/new">Novo post do blog</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/testimonials/new">Novo Depoimento</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/settings">Configuracoes</Link></Button>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">Atividades recentes</CardTitle>
          <CardDescription>Atividades recentes do seu site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.length === 0 ? (
            <div className="flex items-start space-x-4 border-b pb-4">
              <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nenhuma atividade ainda</p>
                <p className="text-xs text-muted-foreground">Comece adicionando conteudo</p>
              </div>
              <span className="text-xs text-muted-foreground">Agora</span>
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
