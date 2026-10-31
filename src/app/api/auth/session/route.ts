import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  // Simplified session check - just verify cookie exists
  // In production, you might want to decode the JWT client-side and pass the email
  return NextResponse.json({ authenticated: true });
}
