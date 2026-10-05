import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/lib/firestore";
import { getCachedSiteSettings, invalidatePublicDataCache } from "@/lib/public-data-cache";

// GET /api/settings - Get site settings
export async function GET() {
  try {
    const settings = await getCachedSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await settingsService.update(body);
    invalidatePublicDataCache("site-settings");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// POST /api/settings - Create/update site settings (alternative method)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await settingsService.update(body);
    invalidatePublicDataCache("site-settings");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
