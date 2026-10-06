import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { mapBlogPostDocument, mapBlogPostInputToDocument, toPlainFirestoreValue } from "@/lib/firestore-content";
import { isValidBlogPost, revalidateBlogPages } from "@/lib/blog-admin";

// GET /api/blog/[id] - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json(
        { error: "O acesso administrativo ao Firebase não está configurado." },
        { status: 503 },
      );
    }
    const document = await db.collection("blogPosts").doc(params.id).get();
    if (!document.exists) {
      return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
    }
    return NextResponse.json(toPlainFirestoreValue(mapBlogPostDocument(document.id, document.data())));
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    if (!isValidBlogPost(body)) {
      return NextResponse.json(
        { error: "Preencha título, slug, resumo e conteúdo do artigo." },
        { status: 400 },
      );
    }
    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json(
        { error: "O acesso administrativo ao Firebase não está configurado." },
        { status: 503 },
      );
    }
    const document = db.collection("blogPosts").doc(params.id);
    const existing = await document.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
    }
    const duplicate = await db.collection("blogPosts").where("slug", "==", body.slug.trim()).limit(2).get();
    if (duplicate.docs.some((item) => item.id !== params.id)) {
      return NextResponse.json({ error: "Este slug já está sendo usado por outro artigo." }, { status: 409 });
    }

    const current = existing.data() || {};
    const patch = mapBlogPostInputToDocument({
      ...body,
      title: body.title.trim(),
      slug: body.slug.trim(),
      summary: body.summary.trim(),
      publishedAt: body.publishedAt || current.publishedAt || new Date(),
    });
    await document.set({ ...patch, updatedAt: new Date() }, { merge: true });
    revalidateBlogPages();
    return NextResponse.json({ message: "Artigo atualizado com sucesso." });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json(
        { error: "O acesso administrativo ao Firebase não está configurado." },
        { status: 503 },
      );
    }
    const document = db.collection("blogPosts").doc(params.id);
    const existing = await document.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
    }
    await document.delete();
    revalidateBlogPages();
    return NextResponse.json({ message: "Artigo excluído com sucesso." });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
