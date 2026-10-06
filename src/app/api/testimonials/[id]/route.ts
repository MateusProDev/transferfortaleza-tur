import { NextRequest, NextResponse } from "next/server";
import { testimonialService } from "@/lib/firestore";
import { getCachedTestimonialById, invalidatePublicDataCache } from "@/lib/public-data-cache";
import { requireAdminSession } from "@/lib/admin-api-auth";

// GET /api/testimonials/[id] - Get single testimonial
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testimonial = await getCachedTestimonialById(params.id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    await testimonialService.update(params.id, body);
    invalidatePublicDataCache("testimonials");
    return NextResponse.json({ message: "Testimonial updated successfully" });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    await testimonialService.delete(params.id);
    invalidatePublicDataCache("testimonials");
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
