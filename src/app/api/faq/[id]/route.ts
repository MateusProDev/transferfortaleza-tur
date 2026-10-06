import { NextRequest, NextResponse } from "next/server";
import { faqService } from "@/lib/firestore";
import { getCachedFaqItems, invalidatePublicDataCache } from "@/lib/public-data-cache";
import { requireAdminSession } from "@/lib/admin-api-auth";

// GET /api/faq/[id] - Get single FAQ item
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const faq = (await getCachedFaqItems()).find((item) => item.id === params.id) || null;
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
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    await faqService.update(params.id, body);
    invalidatePublicDataCache("faqs", "site-content");
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    await faqService.delete(params.id);
    invalidatePublicDataCache("faqs", "site-content");
    return NextResponse.json({ message: "FAQ item deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ item" },
      { status: 500 }
    );
  }
}
