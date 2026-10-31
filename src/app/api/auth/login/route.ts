import { NextRequest, NextResponse } from "next/server";
import { isAllowedAdminEmail, getAllowedAdminEmails } from "@/lib/admin-api-auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken, email } = await request.json();
    console.log('[auth/login] Received email:', email);
    console.log('[auth/login] Allowed emails:', Array.from(getAllowedAdminEmails()));
    console.log('[auth/login] NEXT_PUBLIC_ADMIN_EMAILS:', process.env.NEXT_PUBLIC_ADMIN_EMAILS);

    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json(
        { error: "Token de autenticação inválido." },
        { status: 400 }
      );
    }

    if (!email || !isAllowedAdminEmail(email)) {
      console.log('[auth/login] Email validation failed for:', email);
      return NextResponse.json({ error: "Este usuário não pode acessar o painel." }, { status: 403 });
    }

    // Store the token in a cookie (simplified auth without Admin SDK)
    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    const response = NextResponse.json({ email });

    response.cookies.set("authToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error) {
    console.error("[auth/login] Failed to create admin session:", error);
    return NextResponse.json(
      { error: "Não foi possível criar a sessão administrativa." },
      { status: 500 }
    );
  }
}
