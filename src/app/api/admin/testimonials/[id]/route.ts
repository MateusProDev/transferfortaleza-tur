import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminTestimonialsDb, logAdminTestimonialActivity } from "@/lib/admin-testimonials";
import {
  mapTestimonialDocument,
  mapTestimonialInputToDocument,
  toPlainFirestoreValue,
} from "@/lib/firestore-content";
import { invalidatePublicDataCache } from "@/lib/public-data-cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const responseHeaders = { "Cache-Control": "private, no-store, max-age=0" };

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const database = getAdminTestimonialsDb();
  if ("error" in database) {
    return NextResponse.json(
      { error: database.error },
      { status: 503, headers: responseHeaders },
    );
  }
  const { db } = database;

  try {
    const document = await db.collection("avaliacoes").doc(params.id).get();
    if (!document.exists) {
      return NextResponse.json(
        { error: "Depoimento não encontrado." },
        { status: 404, headers: responseHeaders },
      );
    }

    return NextResponse.json(
      toPlainFirestoreValue(mapTestimonialDocument(document.id, document.data())),
      { headers: responseHeaders },
    );
  } catch (error) {
    console.error("[api/admin/testimonials] Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o depoimento." },
      { status: 500, headers: responseHeaders },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const database = getAdminTestimonialsDb();
  if ("error" in database) {
    return NextResponse.json(
      { error: database.error },
      { status: 503, headers: responseHeaders },
    );
  }
  const { db } = database;

  try {
    const body = await request.json();
    if (
      (body.clientName !== undefined && (typeof body.clientName !== "string" || !body.clientName.trim()))
      || (body.text !== undefined && (typeof body.text !== "string" || !body.text.trim()))
      || (body.rating !== undefined && (!Number.isInteger(Number(body.rating)) || Number(body.rating) < 1 || Number(body.rating) > 5))
    ) {
      return NextResponse.json(
        { error: "O nome e o depoimento não podem ficar vazios; a avaliação deve ser de 1 a 5 estrelas." },
        { status: 400, headers: responseHeaders },
      );
    }

    const reference = db.collection("avaliacoes").doc(params.id);
    const document = await reference.get();
    if (!document.exists) {
      return NextResponse.json(
        { error: "Depoimento não encontrado." },
        { status: 404, headers: responseHeaders },
      );
    }

    const updates = mapTestimonialInputToDocument({
      ...body,
      ...(typeof body.clientName === "string" ? { clientName: body.clientName.trim() } : {}),
      ...(typeof body.text === "string" ? { text: body.text.trim() } : {}),
    });
    await reference.update({ ...updates, updatedAt: new Date() });
    await logAdminTestimonialActivity(db, session.email, "updated", params.id, updates);
    invalidatePublicDataCache("testimonials");

    return NextResponse.json(
      { message: "Depoimento atualizado com sucesso." },
      { headers: responseHeaders },
    );
  } catch (error) {
    console.error("[api/admin/testimonials] Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o depoimento." },
      { status: 500, headers: responseHeaders },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const database = getAdminTestimonialsDb();
  if ("error" in database) {
    return NextResponse.json(
      { error: database.error },
      { status: 503, headers: responseHeaders },
    );
  }
  const { db } = database;

  try {
    const reference = db.collection("avaliacoes").doc(params.id);
    const document = await reference.get();
    if (!document.exists) {
      return NextResponse.json(
        { error: "Depoimento não encontrado." },
        { status: 404, headers: responseHeaders },
      );
    }

    await reference.delete();
    await logAdminTestimonialActivity(db, session.email, "deleted", params.id);
    invalidatePublicDataCache("testimonials");

    return NextResponse.json(
      { message: "Depoimento excluído com sucesso." },
      { headers: responseHeaders },
    );
  } catch (error) {
    console.error("[api/admin/testimonials] Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o depoimento." },
      { status: 500, headers: responseHeaders },
    );
  }
}
