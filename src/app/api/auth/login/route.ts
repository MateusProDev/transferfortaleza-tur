import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login - Simple login endpoint
export async function POST(request: NextRequest) {
  try {
    console.log("[LOGIN API] Login request received");
    const { email, password } = await request.json();
    console.log("[LOGIN API] Email:", email);

    if (!email || !password) {
      console.log("[LOGIN API] Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // In production, this would authenticate with Firebase
    // For now, return a mock token
    const token = Buffer.from(email).toString("base64");
    console.log("[LOGIN API] Generated token:", token);

    const response = NextResponse.json(
      {
        token,
        user: {
          email,
          role: "admin",
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    // Set cookie for middleware to read
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("[LOGIN API] Cookie set, returning response");
    return response;
  } catch (error) {
    console.error("[LOGIN API] Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
