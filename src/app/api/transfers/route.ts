import { NextRequest, NextResponse } from "next/server";
import { transferService } from "@/lib/firestore";

// GET /api/transfers - Get all transfers
export async function GET(request: NextRequest) {
  try {
    const onlyActive =
      request.nextUrl.searchParams.get("active") === "true";
    const transfers = await transferService.getAll(onlyActive);
    return NextResponse.json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfers" },
      { status: 500 }
    );
  }
}

// POST /api/transfers - Create transfer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.description ||
      !body.imageUrl ||
      typeof body.capacity !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await transferService.create(body);
    return NextResponse.json(
      { id, message: "Transfer created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transfer:", error);
    return NextResponse.json(
      { error: "Failed to create transfer" },
      { status: 500 }
    );
  }
}
