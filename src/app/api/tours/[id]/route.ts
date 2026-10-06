import { NextRequest, NextResponse } from "next/server";
import { tourService } from "@/lib/firestore";
import { getCachedTourById, invalidatePublicDataCache } from "@/lib/public-data-cache";
import { requireAdminSession } from "@/lib/admin-api-auth";

// GET /api/tours/[id] - Get single tour
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await getCachedTourById(params.id);
    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

// PUT /api/tours/[id] - Update tour
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    await tourService.update(params.id, body);
    invalidatePublicDataCache("catalog");
    return NextResponse.json({ message: "Tour updated successfully" });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

// DELETE /api/tours/[id] - Delete tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    await tourService.delete(params.id);
    invalidatePublicDataCache("catalog");
    return NextResponse.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
