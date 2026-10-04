import { NextRequest, NextResponse } from "next/server";
import { testimonialService } from "@/lib/firestore";

// GET /api/testimonials - Get all testimonials
export async function GET() {
  try {
    const testimonials = await testimonialService.getAll();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.clientName ||
      !body.clientPhoto ||
      !body.text ||
      typeof body.rating !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await testimonialService.create(body);
    return NextResponse.json(
      { id, message: "Testimonial created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
