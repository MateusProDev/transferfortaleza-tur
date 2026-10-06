import type { Firestore } from "firebase-admin/firestore";
import { getAdminFirestore, getAdminProjectId } from "@/lib/firebase-admin";

export function getAdminTestimonialsDb(): { db: Firestore } | { error: string } {
  const db = getAdminFirestore();
  if (!db) {
    return { error: "O acesso administrativo ao Firestore não está configurado no servidor." };
  }

  const adminProjectId = getAdminProjectId();
  const siteProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (adminProjectId && siteProjectId && adminProjectId !== siteProjectId) {
    console.error("[api/admin/testimonials] Firebase project mismatch:", {
      adminProjectId,
      siteProjectId,
    });
    return {
      error: "Os depoimentos do painel estão conectados a um projeto Firebase diferente do usado pelo site. Corrija as credenciais Firebase Admin do servidor para o projeto configurado no site.",
    };
  }

  return { db };
}

export async function logAdminTestimonialActivity(
  db: Firestore,
  userId: string,
  action: "created" | "updated" | "deleted",
  entityId: string,
  changes?: Record<string, unknown>,
) {
  try {
    await db.collection("activityLogs").add({
      userId,
      action,
      entityType: "testimonials",
      entityId,
      ...(changes ? { changes } : {}),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("[api/admin/testimonials] Error recording activity:", error);
  }
}
