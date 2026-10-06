import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminFirestore, getAdminProjectId } from "@/lib/firebase-admin";
import { invalidatePublicDataCache } from "@/lib/public-data-cache";

type ContentDocument = Record<string, unknown>;

function serializeValue(value: unknown, ancestors = new WeakSet<object>()): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    if (ancestors.has(value)) return "[Circular]";
    ancestors.add(value);
    const result = value.map((item) => serializeValue(item, ancestors));
    ancestors.delete(value);
    return result;
  }
  if (value && typeof value === "object") {
    const timestamp = value as { toDate?: () => Date };
    if (typeof timestamp.toDate === "function") return timestamp.toDate().toISOString();

    const reference = value as { path?: unknown; get?: unknown };
    if (typeof reference.path === "string" && typeof reference.get === "function") {
      return { path: reference.path };
    }

    const point = value as { latitude?: unknown; longitude?: unknown };
    if (typeof point.latitude === "number" && typeof point.longitude === "number") {
      return { latitude: point.latitude, longitude: point.longitude };
    }

    if (value instanceof Uint8Array) return Buffer.from(value).toString("base64");
    if (ancestors.has(value)) return "[Circular]";
    ancestors.add(value);
    const result = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeValue(item, ancestors)]),
    );
    ancestors.delete(value);
    return result;
  }

  return value;
}

function getFirebaseErrorDetails(error: unknown): { code: string; message: string } {
  if (!error || typeof error !== "object") {
    return { code: "unknown", message: String(error) };
  }

  const details = error as { code?: unknown; message?: unknown };
  return {
    code: typeof details.code === "string" || typeof details.code === "number"
      ? String(details.code)
      : "unknown",
    message: typeof details.message === "string" ? details.message : "Unknown Firebase error",
  };
}

function contentReadError(error: unknown): NextResponse {
  const details = getFirebaseErrorDetails(error);
  console.error("Error loading editable site content from Firestore:", details, error);

  const firebaseCode = details.code.replace(/^firestore\//, "").replace(/^auth\//, "");
  const errorMessages: Record<string, string> = {
    "7": "A conta de serviço do Firebase não tem permissão para ler o Firestore. No Google Cloud IAM, conceda a função Cloud Datastore User à conta de serviço configurada no Vercel.",
    "16": "A autenticação do Firebase Admin falhou. Confira se a chave de serviço configurada no Vercel está correta, ativa e pertence ao projeto Firebase do site.",
    "14": "O Firestore está temporariamente indisponível. Tente novamente em alguns minutos.",
    "permission-denied": "A conta de serviço do Firebase não tem permissão para ler o Firestore. No Google Cloud IAM, conceda a função Cloud Datastore User à conta de serviço configurada no Vercel.",
    "unauthenticated": "A autenticação do Firebase Admin falhou. Confira se a chave de serviço configurada no Vercel está correta, ativa e pertence ao projeto Firebase do site.",
    "unavailable": "O Firestore está temporariamente indisponível. Tente novamente em alguns minutos.",
  };
  const message = errorMessages[firebaseCode] || "A consulta ao Firestore falhou. Consulte os logs da função no Vercel usando o código abaixo.";

  return NextResponse.json(
    {
      error: message,
      code: firebaseCode,
    },
    { status: firebaseCode === "7" || firebaseCode === "16"
      || firebaseCode === "permission-denied" || firebaseCode === "unauthenticated"
      ? 503
      : 500 },
  );
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
  const adminProjectId = getAdminProjectId();
  const configuredProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (adminProjectId && configuredProjectId && adminProjectId !== configuredProjectId) {
    console.error("Firebase project mismatch for editable content:", {
      adminProjectId,
      configuredProjectId,
    });
    return NextResponse.json(
      { error: "As credenciais do servidor apontam para um projeto Firebase diferente do site." },
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

    return NextResponse.json({
      documents,
      totalDocuments: documents.length,
      projectId: adminProjectId || configuredProjectId || null,
    });
  } catch (error) {
    return contentReadError(error);
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
