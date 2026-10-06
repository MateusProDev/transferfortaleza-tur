import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { mapBlogPostDocument, mapBlogPostInputToDocument, toPlainFirestoreValue } from "@/lib/firestore-content";
import { isValidBlogPost, revalidateBlogPages } from "@/lib/blog-admin";
import { blogService } from "@/lib/firestore";

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const publishedParam = request.nextUrl.searchParams.get("published");
    const onlyPublished = publishedParam === "true" || publishedParam === null;
    if (!onlyPublished) {
      const session = await requireAdminSession(request);
      if (session instanceof NextResponse) return session;
      const db = getAdminFirestore();
      if (!db) {
        return NextResponse.json(
          { error: "O acesso ao Firebase não está configurado no servidor." },
          { status: 503 },
        );
      }

      const snapshot = await db.collection("blogPosts").get();
      const posts = snapshot.docs
        .map((document) => mapBlogPostDocument(document.id, document.data()))
        .sort((first, second) =>
          (second.views ?? 0) - (first.views ?? 0)
          || second.publishedAt.getTime() - first.publishedAt.getTime()
        )
        .map((post) => toPlainFirestoreValue(post));
      return NextResponse.json(posts);
    }

    const posts = (await blogService.getAll(true)).map((post) => toPlainFirestoreValue(post));
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
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();

    if (!isValidBlogPost(body)) {
      return NextResponse.json(
        { error: "Preencha título, slug, resumo e conteúdo do artigo." },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json(
        { error: "O acesso administrativo ao Firebase não está configurado." },
        { status: 503 },
      );
    }

    const duplicate = await db.collection("blogPosts").where("slug", "==", body.slug.trim()).limit(1).get();
    if (!duplicate.empty) {
      return NextResponse.json({ error: "Este slug já está sendo usado por outro artigo." }, { status: 409 });
    }

    const now = new Date();
    const post = mapBlogPostInputToDocument({
      ...body,
      title: body.title.trim(),
      slug: body.slug.trim(),
      summary: body.summary.trim(),
      content: body.content,
      publishedAt: now,
      views: 0,
    });
    const document = await db.collection("blogPosts").add({
      ...post,
      createdAt: now,
      updatedAt: now,
    });
    revalidateBlogPages();
    return NextResponse.json(
      { id: document.id, message: "Artigo criado com sucesso." },
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
