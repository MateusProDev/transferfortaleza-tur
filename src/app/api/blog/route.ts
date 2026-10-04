import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/firestore";

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const publishedParam = request.nextUrl.searchParams.get("published");
    const onlyPublished = publishedParam === "true" || publishedParam === null;
    const posts = await blogService.getAll(onlyPublished);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.title ||
      !body.slug ||
      !body.summary ||
      !body.content ||
      !body.imageUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await blogService.create(body);
    return NextResponse.json(
      { id, message: "Blog post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
