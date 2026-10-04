import { NextRequest, NextResponse } from "next/server";
import { tourService } from "@/lib/firestore";

// GET /api/tours - Get all tours
export async function GET(request: NextRequest) {
  try {
    const onlyActive =
      request.nextUrl.searchParams.get("active") === "true";
    const tours = await tourService.getAll(onlyActive);
    return NextResponse.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

// POST /api/tours - Create tour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.description ||
      !body.mainImageUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await tourService.create(body);
    return NextResponse.json(
      { id, message: "Tour created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
