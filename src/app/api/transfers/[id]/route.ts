import { NextRequest, NextResponse } from "next/server";
import { transferService } from "@/lib/firestore";
import { invalidatePublicDataCache } from "@/lib/public-data-cache";
import { requireAdminSession } from "@/lib/admin-api-auth";

// GET /api/transfers/[id] - Get single transfer
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transfer = await transferService.getById(params.id);
    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(transfer);
  } catch (error) {
    console.error("Error fetching transfer:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfer" },
      { status: 500 }
    );
  }
}

// PUT /api/transfers/[id] - Update transfer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    await transferService.update(params.id, body);
    invalidatePublicDataCache("transfers");
    return NextResponse.json({ message: "Transfer updated successfully" });
  } catch (error) {
    console.error("Error updating transfer:", error);
    return NextResponse.json(
      { error: "Failed to update transfer" },
      { status: 500 }
    );
  }
}

// DELETE /api/transfers/[id] - Delete transfer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    await transferService.delete(params.id);
    invalidatePublicDataCache("transfers");
    return NextResponse.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    return NextResponse.json(
      { error: "Failed to delete transfer" },
      { status: 500 }
    );
  }
}
