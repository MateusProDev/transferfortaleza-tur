"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signInWithGoogle, subscribeToAdminAuth } from '@/lib/firebase/client';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth(async (user) => {
      if (!user) {
        localStorage.removeItem('admin_id_token');
        return;
      }

      const email = (user.email || '').toLowerCase();
      if (!ADMIN_EMAILS.includes(email)) {
        localStorage.removeItem('admin_id_token');
        return;
      }

      try {
        const token = await user.getIdToken(true);
        localStorage.setItem('admin_id_token', token);
        router.replace('/admin/leads');
      } catch (error) {
        console.error('[admin/login] failed to refresh id token:', error);
        localStorage.removeItem('admin_id_token');
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleGoogleLogin() {
    try {
      const user = await signInWithGoogle();
      const email = (user.email || '').toLowerCase();

      if (!ADMIN_EMAILS.includes(email)) {
        if (auth) {
          await auth.signOut();
        }
        alert('Seu e-mail não está na whitelist do painel.');
        return;
      }

      const token = await user.getIdToken(true);
      localStorage.setItem('admin_id_token', token);
      router.replace('/admin/leads');
    } catch (error) {
      console.error('[admin/login] error:', error);
      alert('Erro ao entrar com Google.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Admin Passeio Legal</h1>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-8 w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
