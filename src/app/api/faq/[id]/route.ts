import { NextRequest, NextResponse } from "next/server";
import { faqService } from "@/lib/firestore";

// GET /api/faq/[id] - Get single FAQ item
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const faq = await faqService.getById(params.id);
    if (!faq) {
      return NextResponse.json(
        { error: "FAQ item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error fetching FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ item" },
      { status: 500 }
    );
  }
}

// PUT /api/faq/[id] - Update FAQ item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await faqService.update(params.id, body);
    return NextResponse.json({ message: "FAQ item updated successfully" });
  } catch (error) {
    console.error("Error updating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ item" },
      { status: 500 }
    );
  }
}

// DELETE /api/faq/[id] - Delete FAQ item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await faqService.delete(params.id);
    return NextResponse.json({ message: "FAQ item deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ item" },
      { status: 500 }
    );
  }
}
