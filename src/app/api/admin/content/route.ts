import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { invalidatePublicDataCache } from "@/lib/public-data-cache";

type ContentDocument = Record<string, unknown>;

function serializeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object") {
    const timestamp = value as { toDate?: () => Date };
    if (typeof timestamp.toDate === "function") return timestamp.toDate().toISOString();

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeValue(item)]),
    );
  }

  return value;
}

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { error: "O acesso administrativo ao Firestore não está configurado." },
      { status: 503 },
    );
  }

  try {
    const snapshot = await db.collection("content").get();
    const documents = snapshot.docs.map((document) => {
      const data = document.data();
      delete data.createdAt;
      delete data.updatedAt;
      return { id: document.id, data: serializeValue(data) as ContentDocument };
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error loading editable site content:", error);
    return NextResponse.json({ error: "Não foi possível carregar o conteúdo do site." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { error: "O acesso administrativo ao Firestore não está configurado." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const data = body.data;

    if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
      return NextResponse.json({ error: "Identificador de conteúdo inválido." }, { status: 400 });
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "O conteúdo precisa ser um objeto válido." }, { status: 400 });
    }
    if (JSON.stringify(data).length > 800_000) {
      return NextResponse.json({ error: "O conteúdo excede o limite permitido." }, { status: 413 });
    }

    const document = db.collection("content").doc(id);
    const existing = await document.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Este documento de conteúdo não existe." }, { status: 404 });
    }

    const editableData = { ...(data as ContentDocument) };
    delete editableData.id;
    delete editableData.createdAt;
    delete editableData.updatedAt;

    await document.set(
      { ...editableData, updatedAt: new Date() },
      { merge: true },
    );
    invalidatePublicDataCache("site-settings");
    revalidatePath("/", "layout");

    return NextResponse.json({ message: "Conteúdo atualizado.", id });
  } catch (error) {
    console.error("Error saving editable site content:", error);
    return NextResponse.json({ error: "Não foi possível salvar o conteúdo do site." }, { status: 500 });
  }
}
