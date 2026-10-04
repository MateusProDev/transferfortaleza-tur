import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { bannerService } from "@/lib/firestore";

// GET /api/banners - Get all banners
export async function GET() {
  try {
    const banners = await bannerService.getAll();
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.title ||
      !body.imageUrl ||
      !body.buttonText ||
      !body.buttonLink
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await bannerService.create(body);
    revalidatePath("/");
    return NextResponse.json(
      { id, message: "Banner created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
