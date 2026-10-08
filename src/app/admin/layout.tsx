"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logoutAdmin } from "@/lib/firebase/client";

const navigationGroups = [
  {
    label: "Visão geral",
    items: [{ label: "Painel", href: "/admin/dashboard" }],
  },
  {
    label: "Serviços",
    items: [
      { label: "Passeios", href: "/admin/tours" },
      { label: "Transfers", href: "/admin/transfers" },
    ],
  },
  {
    label: "Conteúdo do site",
    items: [
      { label: "Banners da página inicial", href: "/admin/banners" },
      { label: "Blog", href: "/admin/blog" },
      { label: "Depoimentos", href: "/admin/testimonials" },
      { label: "Perguntas frequentes (FAQ)", href: "/admin/faq" },
      { label: "Textos e seções", href: "/admin/content" },
    ],
  },
  {
    label: "Configuração",
    items: [{ label: "Configurações do site", href: "/admin/settings" }],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (response.ok) {
          if (active) setAuthorized(true);
          return;
        }
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      })
      .catch((error) => {
        console.error("[admin] Failed to verify session:", error);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await logoutAdmin();
    } catch (error) {
      console.error("[admin] Failed to log out:", error);
    } finally {
      router.replace("/login");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 lg:flex-row">
      <aside className="w-full shrink-0 border-b border-gray-200 bg-white shadow-lg lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="border-b border-border p-4 lg:p-6">
          <p className="text-xl font-bold text-primary sm:text-2xl">Transfer Fortaleza Tur</p>
          <p className="text-sm text-muted-foreground">Painel administrativo</p>
        </div>

        <nav
          aria-label="Navegação administrativa"
          className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 lg:flex-1 lg:grid-cols-1 lg:gap-6 lg:overflow-y-auto lg:px-5 lg:py-6"
        >
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {group.label}
              </h2>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-md border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isActive
                            ? "border-primary bg-primary/10 font-semibold text-primary"
                            : "border-transparent text-gray-700 hover:bg-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4 lg:mt-auto lg:px-5 lg:py-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden bg-gray-100 p-3 sm:p-5 lg:p-6 xl:p-8">
        <div className="mx-auto w-full max-w-screen-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
