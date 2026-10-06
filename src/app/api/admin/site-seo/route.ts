import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { invalidatePublicDataCache } from "@/lib/public-data-cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const responseHeaders = { "Cache-Control": "private, no-store, max-age=0" };
const defaultSeo = {
  title: "Passeios e Transfers em Fortaleza e Região",
  description: "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!",
  keywords: ["passeios fortaleza", "tours fortaleza", "transfer fortaleza", "turismo ceará"],
  ogImage: "",
};

function getDatabase() {
  const db = getAdminFirestore();
  if (!db) {
    return null;
  }
  return db.collection("content").doc("homeSeo");
}

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const document = getDatabase();
  if (!document) {
    return NextResponse.json(
      { error: "O acesso administrativo ao Firestore não está configurado." },
      { status: 503, headers: responseHeaders },
    );
  }

  try {
    const snapshot = await document.get();
    const data = snapshot.exists ? snapshot.data() : {};
    const keywords = Array.isArray(data?.keywords)
      ? data.keywords.filter((keyword: unknown): keyword is string => typeof keyword === "string")
      : defaultSeo.keywords;

    return NextResponse.json(
      {
        title: typeof data?.title === "string" ? data.title : defaultSeo.title,
        description: typeof data?.description === "string" ? data.description : defaultSeo.description,
        keywords,
        ogImage: typeof data?.ogImage === "string" ? data.ogImage : defaultSeo.ogImage,
      },
      { headers: responseHeaders },
    );
  } catch (error) {
    console.error("[api/admin/site-seo] Error loading site SEO:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os metadados do site." },
      { status: 500, headers: responseHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const document = getDatabase();
  if (!document) {
    return NextResponse.json(
      { error: "O acesso administrativo ao Firestore não está configurado." },
      { status: 503, headers: responseHeaders },
    );
  }

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const ogImage = typeof body.ogImage === "string" ? body.ogImage.trim() : "";
    const keywords = Array.isArray(body.keywords)
      ? body.keywords
          .filter((keyword: unknown): keyword is string => typeof keyword === "string")
          .map((keyword: string) => keyword.trim())
          .filter(Boolean)
      : null;

    if (!title || title.length > 160) {
      return NextResponse.json(
        { error: "Informe um título de até 160 caracteres." },
        { status: 400, headers: responseHeaders },
      );
    }
    if (!description || description.length > 320) {
      return NextResponse.json(
        { error: "Informe uma descrição de até 320 caracteres." },
        { status: 400, headers: responseHeaders },
      );
    }
    if (ogImage.length > 2048) {
      return NextResponse.json(
        { error: "O endereço da imagem de compartilhamento é muito longo." },
        { status: 400, headers: responseHeaders },
      );
    }
    if (!keywords || keywords.length > 50 || keywords.some((keyword: string) => keyword.length > 80)) {
      return NextResponse.json(
        { error: "Informe até 50 palavras-chave, com no máximo 80 caracteres cada." },
        { status: 400, headers: responseHeaders },
      );
    }

    await document.set(
      { title, description, keywords, ogImage, updatedAt: new Date() },
      { merge: true },
    );

    invalidatePublicDataCache("site-content");
    revalidatePath("/", "layout");

    return NextResponse.json({ message: "Metadados do site salvos." }, { headers: responseHeaders });
  } catch (error) {
    console.error("[api/admin/site-seo] Error saving site SEO:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar os metadados do site." },
      { status: 500, headers: responseHeaders },
    );
  }
}
