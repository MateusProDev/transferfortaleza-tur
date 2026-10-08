import { NextRequest, NextResponse } from "next/server";
import { getCachedSiteSettings, invalidatePublicDataCache } from "@/lib/public-data-cache";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { getAdminFirestore, getAdminProjectId } from "@/lib/firebase-admin";

type SettingsPayload = Record<string, unknown>;

function getSettingsDatabase() {
  const db = getAdminFirestore();
  if (!db) return { error: "O acesso administrativo ao Firestore não está configurado." };

  const adminProjectId = getAdminProjectId();
  const siteProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (adminProjectId && siteProjectId && adminProjectId !== siteProjectId) {
    console.error("[api/settings] Firebase project mismatch:", { adminProjectId, siteProjectId });
    return { error: "As credenciais do servidor apontam para um projeto Firebase diferente do site." };
  }

  return { db };
}

async function saveSettings(data: SettingsPayload): Promise<void> {
  const database = getSettingsDatabase();
  if ("error" in database) throw new Error(database.error);

  const { db } = database;
  const settingsCollection = db.collection("settings");
  const settingsSnapshot = await settingsCollection.get();
  const siteSettings = settingsSnapshot.docs.find((document) => document.id !== "whatsapp");
  const settingsData = { ...data };
  delete settingsData.id;
  const batch = db.batch();
  const now = new Date();

  if (siteSettings) {
    batch.update(siteSettings.ref, { ...settingsData, updatedAt: now });
  } else {
    batch.set(settingsCollection.doc(), { ...settingsData, createdAt: now, updatedAt: now });
  }

  const headerPatch: SettingsPayload = {};
  if (typeof data.headerLogo === "string") headerPatch.logoUrl = data.headerLogo;
  if (typeof data.headerLogoAlt === "string") headerPatch.logoAlt = data.headerLogoAlt;
  if (Object.keys(headerPatch).length > 0) {
    const headerRef = db.collection("content").doc("header");
    const headerSnapshot = await headerRef.get();
    if (headerSnapshot.exists) {
      batch.update(headerRef, { ...headerPatch, updatedAt: now });
    } else {
      batch.set(headerRef, { ...headerPatch, updatedAt: now });
    }
  }

  const footerPatch: SettingsPayload = {};
  const footerFields: Array<[string, string]> = [
    ["footerLogo", "logoUrl"],
    ["footerLogoAlt", "logoAlt"],
    ["footerCnpj", "cnpj"],
    ["footerCopyright", "copyrightText"],
    ["footerDeveloperName", "developerName"],
    ["footerDeveloperUrl", "developerUrl"],
    ["footerCertificationImage", "certificationImage"],
    ["footerCertificationAlt", "certificationAlt"],
    ["footerPaymentImage", "paymentImage"],
    ["footerPaymentAlt", "paymentAlt"],
    ["footerSecurityImage", "securityImage"],
    ["footerSecurityAlt", "securityAlt"],
    ["companyName", "companyName"],
    ["footerText", "text"],
  ];
  for (const [source, target] of footerFields) {
    if (data[source] !== undefined) footerPatch[target] = data[source];
  }

  if (Array.isArray(data.footerLinks)) {
    footerPatch.quickLinks = data.footerLinks.map((value) => {
      const link = value && typeof value === "object" ? value as SettingsPayload : {};
      return {
        id: link.id,
        label: link.label,
        href: link.url,
        active: link.active,
      };
    });
  }
  const footerRef = db.collection("content").doc("footer");
  const footerSnapshot = await footerRef.get();
  if (data.contactInfo && typeof data.contactInfo === "object") {
    const contactInfo = data.contactInfo as SettingsPayload;
    const currentContact = footerSnapshot.data()?.contact;
    const contact = currentContact && typeof currentContact === "object"
      ? { ...(currentContact as SettingsPayload) }
      : {};
    for (const key of ["phone", "email", "address"] as const) {
      if (contactInfo[key] !== undefined) contact[key] = contactInfo[key];
    }
    footerPatch.contact = contact;
  }
  if (Array.isArray(data.socialLinks)) {
    footerPatch.social = Object.fromEntries(data.socialLinks.map((value) => {
      const link = value && typeof value === "object" ? value as SettingsPayload : {};
      return [String(link.platform || ""), { link: link.url, icon: link.icon }];
    }).filter(([platform]) => platform));
  }
  if (Object.keys(footerPatch).length > 0) {
    if (footerSnapshot.exists) {
      batch.update(footerRef, { ...footerPatch, updatedAt: now });
    } else {
      batch.set(footerRef, { ...footerPatch, updatedAt: now });
    }
  }

  const whatsappConfig = data.whatsappConfig && typeof data.whatsappConfig === "object"
    ? data.whatsappConfig as SettingsPayload
    : {};
  const whatsappNumber = whatsappConfig.number ?? (data.contactInfo as SettingsPayload | undefined)?.whatsapp;
  if (whatsappNumber !== undefined) {
    const whatsappRef = settingsCollection.doc("whatsapp");
    if (settingsSnapshot.docs.some((document) => document.id === "whatsapp")) {
      batch.update(whatsappRef, { number: whatsappNumber, updatedAt: now });
    } else {
      batch.set(whatsappRef, { number: whatsappNumber, createdAt: now, updatedAt: now });
    }
  }

  await batch.commit();
}

function unavailableDatabaseResponse(database: ReturnType<typeof getSettingsDatabase>) {
  if (!("error" in database)) return null;
  return NextResponse.json({ error: database.error }, { status: 503 });
}

function settingsWriteError(error: unknown): NextResponse {
  console.error("Error updating settings:", error);
  const code = error && typeof error === "object" && "code" in error
    ? String(error.code)
    : "";
  if (code === "7" || code === "permission-denied") {
    return NextResponse.json(
      { error: "A conta de serviço do Firebase não tem permissão para gravar as configurações no Firestore. Verifique a função Cloud Datastore User no Google Cloud IAM." },
      { status: 503 },
    );
  }
  if (error instanceof Error && error.message.includes("projeto Firebase diferente")) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  return NextResponse.json(
    { error: "Não foi possível salvar as configurações do site." },
    { status: 500 },
  );
}

// GET /api/settings - Get site settings
export async function GET() {
  try {
    const settings = await getCachedSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site settings
export async function PUT(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const databaseResponse = unavailableDatabaseResponse(getSettingsDatabase());
  if (databaseResponse) return databaseResponse;

  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "As configurações enviadas são inválidas." }, { status: 400 });
    }
    await saveSettings(body as SettingsPayload);
    invalidatePublicDataCache("site-settings");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    return settingsWriteError(error);
  }
}

// POST /api/settings - Create/update site settings (alternative method)
export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const databaseResponse = unavailableDatabaseResponse(getSettingsDatabase());
  if (databaseResponse) return databaseResponse;

  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "As configurações enviadas são inválidas." }, { status: 400 });
    }
    await saveSettings(body as SettingsPayload);
    invalidatePublicDataCache("site-settings");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    return settingsWriteError(error);
  }
}
