"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithGoogle, logoutAdmin } from "@/lib/firebase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect") || "/admin/dashboard";
  const redirect = requestedRedirect.startsWith("/admin/") && !requestedRedirect.startsWith("//")
    ? requestedRedirect
    : "/admin/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ idToken }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Não foi possível entrar no painel.");
      }

      window.location.assign(redirect);
    } catch (loginError) {
      console.error("[login] Admin authentication failed:", loginError);
      setError(loginError instanceof Error ? loginError.message : "Erro ao entrar no painel.");
      await logoutAdmin();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Admin Transfer Fortaleza Tur
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Entre com a conta Google autorizada para gerenciar o site.
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="mt-8 w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Verificando acesso..." : "Entrar com Google"}
        </button>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
