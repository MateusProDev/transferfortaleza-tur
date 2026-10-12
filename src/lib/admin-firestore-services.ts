import admin, { adminDb } from "@/lib/firebase-admin";
import type { FAQ, Testimonial, Tour, Transfer, Banner } from "@/types";
import {
  mapBannerInputToDocument,
  mapCatalogInputToPackage,
  mapHomeFaqDocument,
  mapTestimonialInputToDocument,
} from "@/lib/firestore-content";

function getDatabase() {
  if (!adminDb) {
    throw new Error("Firebase Admin Firestore is not configured.");
  }
  return adminDb;
}

async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, unknown>,
) {
  try {
    await getDatabase().collection("activityLogs").add({
      userId: "admin",
      action,
      entityType,
      entityId,
      changes,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error recording activity:", error);
  }
}

async function createDocument(collectionName: string, data: Record<string, unknown>) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const document = await getDatabase().collection(collectionName).add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  await logActivity("created", collectionName, document.id, data);
  return document.id;
}

async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
) {
  await getDatabase().collection(collectionName).doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await logActivity("updated", collectionName, id, data);
}

async function deleteDocument(collectionName: string, id: string) {
  await getDatabase().collection(collectionName).doc(id).delete();
  await logActivity("deleted", collectionName, id);
}

export const adminBannerService = {
  create(data: Omit<Banner, "id" | "createdAt" | "updatedAt">) {
    return createDocument("banners", mapBannerInputToDocument(data));
  },
  update(id: string, data: Partial<Banner>) {
    return updateDocument("banners", id, mapBannerInputToDocument(data));
  },
  delete(id: string) {
    return deleteDocument("banners", id);
  },
};

export const adminTourService = {
  create(data: Omit<Tour, "id" | "createdAt" | "updatedAt">) {
    return createDocument("pacotes", mapCatalogInputToPackage(data, "tour", true));
  },
  update(id: string, data: Partial<Tour>) {
    return updateDocument("pacotes", id, mapCatalogInputToPackage(data, "tour"));
  },
  delete(id: string) {
    return deleteDocument("pacotes", id);
  },
};

export const adminTransferService = {
  create(data: Omit<Transfer, "id" | "createdAt" | "updatedAt">) {
    return createDocument("pacotes", mapCatalogInputToPackage(data, "transfer", true));
  },
  update(id: string, data: Partial<Transfer>) {
    return updateDocument("pacotes", id, mapCatalogInputToPackage(data, "transfer"));
  },
  delete(id: string) {
    return deleteDocument("pacotes", id);
  },
};

export const adminTestimonialService = {
  create(data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
    return createDocument("avaliacoes", mapTestimonialInputToDocument(data));
  },
  update(id: string, data: Partial<Testimonial>) {
    return updateDocument("avaliacoes", id, mapTestimonialInputToDocument(data));
  },
  delete(id: string) {
    return deleteDocument("avaliacoes", id);
  },
};

export const adminFaqService = {
  async create(data: Omit<FAQ, "id" | "createdAt" | "updatedAt">) {
    const db = getDatabase();
    const reference = db.collection("content").doc("homeFAQ");
    const id = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference);
      const current = snapshot.data();
      const entries = Array.isArray(current?.faq) ? current.faq : [];
      const nextEntries = [...entries, {
        pergunta: data.question,
        resposta: data.answer,
      }];
      transaction.set(reference, {
        faq: nextEntries,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      return `home-faq-${nextEntries.length - 1}`;
    });
    await logActivity("created", "content", "homeFAQ", {
      question: data.question,
      answer: data.answer,
    });
    return id;
  },

  async update(id: string, data: Partial<FAQ>) {
    const db = getDatabase();
    const homeFaqReference = db.collection("content").doc("homeFAQ");
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(homeFaqReference);
      const current = snapshot.data();
      if (!current || !Array.isArray(current.faq)) return false;

      const entries = [...current.faq];
      const index = mapHomeFaqDocument(current).findIndex((faq) => faq.id === id);
      if (index < 0) return false;

      const existing = entries[index];
      const currentEntry = existing && typeof existing === "object" && !Array.isArray(existing)
        ? existing as Record<string, unknown>
        : {};
      entries[index] = {
        ...currentEntry,
        ...(data.question !== undefined ? { pergunta: data.question } : {}),
        ...(data.answer !== undefined ? { resposta: data.answer } : {}),
      };
      transaction.update(homeFaqReference, {
        faq: entries,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    });

    if (result) {
      await logActivity("updated", "content", "homeFAQ", {
        id,
        ...data,
      });
      return;
    }

    await updateDocument("faq", id, data);
  },

  async delete(id: string) {
    const db = getDatabase();
    const homeFaqReference = db.collection("content").doc("homeFAQ");
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(homeFaqReference);
      const current = snapshot.data();
      if (!current || !Array.isArray(current.faq)) return false;

      const entries = [...current.faq];
      const index = mapHomeFaqDocument(current).findIndex((faq) => faq.id === id);
      if (index < 0) return false;

      entries.splice(index, 1);
      transaction.update(homeFaqReference, {
        faq: entries,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    });

    if (result) {
      await logActivity("deleted", "content", "homeFAQ", { id });
      return;
    }

    await deleteDocument("faq", id);
  },
};
