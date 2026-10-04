import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/logout - Logout endpoint
export async function POST(_request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.delete("authToken");

  return response;
}
