import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export interface AdminIdentity {
  email: string;
}

function getAllowedAdminEmails(): Set<string> {
  const envEmails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const emailList = envEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  // Fallback hardcoded emails for development/testing
  if (emailList.length === 0) {
    console.warn("ADMIN_EMAILS not configured, using fallback emails");
    return new Set([
      "maiatur000@gmail.com",
      "mateusprodev@gmail.com",
    ]);
  }

  return new Set(emailList);
}

export function isAllowedAdminEmail(email: string | undefined): email is string {
  return Boolean(email && getAllowedAdminEmails().has(email.toLowerCase()));
}

export function isAdminAllowlistConfigured(): boolean {
  return getAllowedAdminEmails().size > 0;
}

export async function requireAdminSession(
  request: NextRequest,
): Promise<AdminIdentity | NextResponse> {
  const auth = getAdminAuth();
  const allowedEmails = getAllowedAdminEmails();

  if (!auth || allowedEmails.size === 0) {
    return NextResponse.json(
      { error: "A autenticação administrativa não está configurada." },
      { status: 503 },
    );
  }

  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const email = decoded.email?.toLowerCase();
    if (!email || !allowedEmails.has(email)) {
      return NextResponse.json({ error: "Acesso administrativo negado." }, { status: 403 });
    }

    return { email };
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
    if (code.startsWith("auth/")) {
      return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
    }

    console.error("Unable to verify admin session:", error);
    return NextResponse.json({ error: "Não foi possível verificar a sessão administrativa." }, { status: 503 });
  }
}
