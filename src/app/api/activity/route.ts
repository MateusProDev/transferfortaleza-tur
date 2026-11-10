import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Simplified auth check - just verify token exists in cookie
  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin indisponível" },
      { status: 503 }
    );
  }

  try {
    const snapshot = await db
      .collection("activityLogs")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();
    const activities = snapshot.docs.map((document: any) => ({
      id: document.id,
      ...document.data(),
    }));
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}