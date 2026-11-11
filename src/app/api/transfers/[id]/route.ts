import { NextRequest, NextResponse } from "next/server";
import { adminTransferService } from "@/lib/admin-firestore-services";
import { getCachedTransferById, revalidateCatalogPages } from "@/lib/public-data-cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/transfers/[id] - Get single transfer
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transfer = await getCachedTransferById(params.id);
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
  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  try {
    const body = await request.json();
    await adminTransferService.update(params.id, body);
    revalidateCatalogPages();
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
  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  try {
    await adminTransferService.delete(params.id);
    revalidateCatalogPages();
    return NextResponse.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    return NextResponse.json(
      { error: "Failed to delete transfer" },
      { status: 500 }
    );
  }
}
