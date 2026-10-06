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

export async function GET(request: NextRequest) {
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
    const snapshot = await db.collection("avaliacoes").get();
    const testimonials = snapshot.docs
      .map((document) => mapTestimonialDocument(document.id, document.data()))
      .sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime())
      .map((testimonial) => toPlainFirestoreValue(testimonial));

    return NextResponse.json(testimonials, { headers: responseHeaders });
  } catch (error) {
    console.error("[api/admin/testimonials] Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os depoimentos." },
      { status: 500, headers: responseHeaders },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const rating = Number(body.rating);
    if (
      typeof body.clientName !== "string"
      || !body.clientName.trim()
      || typeof body.text !== "string"
      || !body.text.trim()
      || !Number.isInteger(rating)
      || rating < 1
      || rating > 5
    ) {
      return NextResponse.json(
        { error: "Informe o nome do cliente, o depoimento e uma avaliação de 1 a 5 estrelas." },
        { status: 400, headers: responseHeaders },
      );
    }

    const now = new Date();
    const document = await db.collection("avaliacoes").add({
      ...mapTestimonialInputToDocument({
        ...body,
        clientName: body.clientName.trim(),
        text: body.text.trim(),
        rating,
        clientPhoto: typeof body.clientPhoto === "string" ? body.clientPhoto : "",
        clientPhotoAlt: typeof body.clientPhotoAlt === "string" ? body.clientPhotoAlt : "",
        active: typeof body.active === "boolean" ? body.active : true,
      }),
      createdAt: now,
      updatedAt: now,
    });

    await logAdminTestimonialActivity(db, session.email, "created", document.id);
    invalidatePublicDataCache("testimonials");
    return NextResponse.json(
      { id: document.id, message: "Depoimento criado com sucesso." },
      { status: 201, headers: responseHeaders },
    );
  } catch (error) {
    console.error("[api/admin/testimonials] Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Não foi possível criar o depoimento." },
      { status: 500, headers: responseHeaders },
    );
  }
}
