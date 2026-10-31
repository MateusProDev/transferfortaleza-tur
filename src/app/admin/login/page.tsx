"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, subscribeToAdminAuth } from '@/lib/firebase/client';

const ADMIN_EMAILS = ((process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)).length > 0
  ? (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  : ['maiatur000@gmail.com', 'mateusprodev@gmail.com']; // Fallback for development

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth(async (user) => {
      if (!user) {
        localStorage.removeItem('admin_id_token');
        return;
      }

      const userEmail = (user.email || '').toLowerCase();
      if (!ADMIN_EMAILS.includes(userEmail)) {
        localStorage.removeItem('admin_id_token');
        return;
      }

      try {
        const token = await user.getIdToken(true);
        localStorage.setItem('admin_id_token', token);
        router.replace('/admin/dashboard');
      } catch (error) {
        console.error('[admin/login] failed to refresh id token:', error);
        localStorage.removeItem('admin_id_token');
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await signInWithEmail(email, password);
      const userEmail = (user.email || '').toLowerCase();

      // TEMPORARY: Skip client-side validation for testing
      /*
      if (!ADMIN_EMAILS.includes(userEmail)) {
        setError('Este e-mail não tem permissão para acessar o painel.');
        setLoading(false);
        return;
      }
      */

      const token = await user.getIdToken(true);
      localStorage.setItem('admin_id_token', token);

      // Send token to server to create session
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token, email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar sessão');
      }

      router.replace('/admin/dashboard');
    } catch (error: any) {
      console.error('[admin/login] error:', error);
      setError(error.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Acesso restrito
        </p>
        <h1 className="mt-3 break-words text-2xl font-bold text-slate-900">Admin Transfer Fortaleza Tur</h1>

        <form onSubmit={handleEmailLogin} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          E-mails permitidos: {ADMIN_EMAILS.join(', ')}
        </p>
      </div>
    </div>
  );
}
