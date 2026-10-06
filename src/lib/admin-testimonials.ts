import type { Firestore } from "firebase-admin/firestore";

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
