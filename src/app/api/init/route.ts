import { NextRequest, NextResponse } from "next/server";
import { initializeFirebaseCollections, checkFirebaseInitialization } from "@/lib/firebase-init";

// POST /api/init - Initialize Firebase collections
export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    // Simple secret check to prevent unauthorized initialization
    if (secret !== process.env.INIT_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const success = await initializeFirebaseCollections();

    if (success) {
      return NextResponse.json(
        { message: "Firebase collections initialized successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to initialize Firebase collections" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in init API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/init - Check initialization status
export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-init-secret");
  if (!process.env.INIT_SECRET || secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await checkFirebaseInitialization();
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error("Error checking initialization status:", error);
    return NextResponse.json(
      { error: "Failed to check initialization status" },
      { status: 500 }
    );
  }
}
