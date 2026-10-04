"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  console.log("[LOGIN] Component rendering");

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("[LOGIN] Starting login process for:", email);
    console.log("[LOGIN] Redirect target:", redirect);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("[LOGIN] Response status:", response.status);

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("[LOGIN] Login successful, received:", data);
      console.log("[LOGIN] Redirecting to:", redirect);

      // Small delay to ensure cookie is set
      setTimeout(() => {
        window.location.href = redirect;
      }, 100);
    } catch (error) {
      console.error("[LOGIN] Login error:", error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>Passeio Legal</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Admin Panel Login</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password" style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px 16px', backgroundColor: loading ? '#9ca3af' : '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '16px', margin: '16px 0 0 0' }}>
          Credenciais: use sua conta Firebase Auth
        </p>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
