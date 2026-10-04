"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via cookie
    // Cookie is set by the login API and checked by middleware
    // We just need to verify we're on the admin side
    setIsLoggedIn(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-b border-gray-200 bg-white shadow-lg lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:min-w-64 lg:border-b-0 lg:border-r">
        <div className="border-b border-border p-4 lg:p-6">
          <h1 className="text-xl font-bold text-primary sm:text-2xl">Passeio Legal</h1>
          <p className="text-sm text-muted-foreground">Painel administrativo</p>
        </div>

        <nav className="flex flex-wrap gap-2 p-4 lg:block lg:space-y-2 lg:p-6">
          <a
            href="/admin/dashboard"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Painel
          </a>
          <a
            href="/admin/banners"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Banners
          </a>
          <a
            href="/admin/tours"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Passeios
          </a>
          <a
            href="/admin/transfers"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Transfers
          </a>
          <a
            href="/admin/testimonials"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Depoimentos
          </a>
          <a
            href="/admin/blog"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Blog
          </a>
          <a
            href="/admin/faq"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            FAQ
          </a>
          <a
            href="/admin/leads"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Leads
          </a>
          <a
            href="/admin/settings"
            className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent lg:px-4"
          >
            Configurações
          </a>
        </nav>

        <div className="border-t border-border p-4 lg:absolute lg:bottom-6 lg:left-6 lg:right-6 lg:p-0 lg:pt-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen flex-1 overflow-x-hidden bg-gray-100 p-3 sm:p-5 lg:p-6 xl:p-8">
        <div className="mx-auto w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
