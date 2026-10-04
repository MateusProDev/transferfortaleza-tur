import { NextRequest, NextResponse } from "next/server";
import { faqService } from "@/lib/firestore";

// GET /api/faq - Get all FAQ items
export async function GET() {
  try {
    const faqItems = await faqService.getAll();
    return NextResponse.json(faqItems);
  } catch (error) {
    console.error("Error fetching FAQ items:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ items" },
      { status: 500 }
    );
  }
}

// POST /api/faq - Create FAQ item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.question || !body.answer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await faqService.create(body);
    return NextResponse.json(
      { id, message: "FAQ item created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ item" },
      { status: 500 }
    );
  }
}
