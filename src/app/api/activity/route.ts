import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { requireAdminSession } from "@/lib/admin-api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

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
    const activities = snapshot.docs.map((document) => ({
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