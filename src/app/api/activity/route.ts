import { NextResponse } from "next/server";
import { activityLogService } from "@/lib/firestore";

export async function GET() {
  try {
    const activities = await activityLogService.getRecent(10);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}