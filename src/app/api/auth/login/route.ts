import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { isAdminAllowlistConfigured, isAllowedAdminEmail } from "@/lib/admin-api-auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json(
        { error: "Token de autenticação inválido." },
        { status: 400 }
      );
    }

    const auth = getAdminAuth();
    if (!auth || !isAdminAllowlistConfigured()) {
      return NextResponse.json(
        { error: "A autenticação administrativa não está configurada." },
        { status: 503 }
      );
    }

    const decoded = await auth.verifyIdToken(idToken, true);
    if (!isAllowedAdminEmail(decoded.email)) {
      return NextResponse.json({ error: "Este usuário não pode acessar o painel." }, { status: 403 });
    }

    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ email: decoded.email });

    response.cookies.set("authToken", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error) {
    console.error("[auth/login] Failed to create admin session:", error);
    const code = error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
    return NextResponse.json(
      { error: code.startsWith("auth/")
        ? "Não foi possível autenticar. Verifique sua conta e tente novamente."
        : "Não foi possível criar a sessão administrativa." },
      { status: code.startsWith("auth/") ? 401 : 500 }
    );
  }
}
