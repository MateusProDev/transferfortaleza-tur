import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ email: session.email });
}
