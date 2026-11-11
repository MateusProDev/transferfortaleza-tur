import { adminDb } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { FieldValue, Transaction } from "firebase-admin/firestore";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  increment,
  runTransaction as clientRunTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { FAQ, Testimonial, Tour, Transfer, Banner } from "@/types";
import {
  mapBannerInputToDocument,
  mapCatalogInputToPackage,
  mapHomeFaqDocument,
  mapTestimonialInputToDocument,
} from "@/lib/firestore-content";

const useClientSDK = !adminDb;

function getDatabase() {
  if (adminDb) {
    return adminDb;
  }
  if (db) {
    console.warn("Using Firebase client SDK as fallback (Admin SDK not available)");
    return db as any;
  }
  throw new Error("Firebase Firestore is not configured.");
}

function getClientDatabase() {
  if (!db) {
    throw new Error("Firebase client Firestore is not configured.");
  }
  return db;
}

type AdminFieldTransform = {
  methodName?: string;
  operand?: unknown;
  elements?: unknown[];
};

function getAdminFieldTransform(value: unknown): AdminFieldTransform | null {
  if (!value || typeof value !== "object") return null;
  const methodName = (value as { methodName?: unknown }).methodName;
  return typeof methodName === "string" ? (value as AdminFieldTransform) : null;
}

function toClientFieldValue(value: unknown, allowDelete = false): unknown {
  const transform = getAdminFieldTransform(value);
  if (!transform?.methodName) return value;

  switch (transform.methodName) {
    case "FieldValue.delete":
      return allowDelete ? deleteField() : undefined;
    case "FieldValue.serverTimestamp":
      return serverTimestamp();
    case "FieldValue.increment":
      return increment(typeof transform.operand === "number" ? transform.operand : 0);
    case "FieldValue.arrayUnion":
      return arrayUnion(...(Array.isArray(transform.elements) ? transform.elements : []));
    case "FieldValue.arrayRemove":
      return arrayRemove(...(Array.isArray(transform.elements) ? transform.elements : []));
    default:
      return value;
  }
}

function sanitizeClientWriteData(
  data: Record<string, unknown>,
  { allowDelete = false }: { allowDelete?: boolean } = {},
) {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    const converted = toClientFieldValue(value, allowDelete);
    if (converted !== undefined) result[key] = converted;
  }
  return result;
}

async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, unknown>,
) {
  try {
    if (useClientSDK) {
      const payload: Record<string, unknown> = {
        userId: "admin",
        action,
        entityType,
        entityId,
        timestamp: serverTimestamp(),
      };
      if (changes !== undefined) {
        payload.changes = sanitizeClientWriteData(changes);
      }
      await addDoc(collection(getClientDatabase(), "activityLogs"), payload);
      return;
    }

    await getDatabase().collection("activityLogs").add({
      userId: "admin",
      action,
      entityType,
      entityId,
      changes,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error recording activity:", error);
  }
}

async function createDocument(collectionName: string, data: Record<string, unknown>) {
  if (useClientSDK) {
    const clientDb = getClientDatabase();
    const document = await addDoc(collection(clientDb, collectionName), {
      ...sanitizeClientWriteData(data),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await logActivity("created", collectionName, document.id, data);
    return document.id;
  }

  const now = FieldValue.serverTimestamp();
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
  if (useClientSDK) {
    const clientDb = getClientDatabase();
    const updateData = sanitizeClientWriteData(data, { allowDelete: true });

    console.log(`Atualizando ${collectionName}/${id} (client SDK):`, JSON.stringify(updateData, null, 2));

    await updateDoc(doc(clientDb, collectionName, id), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    await logActivity("updated", collectionName, id, data);
    return;
  }

  const database = getDatabase();
  const docRef = database.collection(collectionName).doc(id);
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  console.log(`Atualizando ${collectionName}/${id}:`, JSON.stringify(updateData, null, 2));

  await docRef.update({
    ...updateData,
    updatedAt: FieldValue.serverTimestamp(),
  });
  await logActivity("updated", collectionName, id, data);
}

async function deleteDocument(collectionName: string, id: string) {
  if (useClientSDK) {
    await deleteDoc(doc(getClientDatabase(), collectionName, id));
    await logActivity("deleted", collectionName, id);
    return;
  }

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
    if (useClientSDK) {
      const clientDb = getClientDatabase();
      const reference = doc(clientDb, "content", "homeFAQ");
      const id = await clientRunTransaction(clientDb, async (transaction) => {
        const snapshot = await transaction.get(reference);
        const current = snapshot.data();
        const entries = Array.isArray(current?.faq) ? current.faq : [];
        const nextEntries = [...entries, {
          pergunta: data.question,
          resposta: data.answer,
          ...(data.category !== undefined ? { categoria: data.category } : {}),
          ativo: data.active ?? true,
        }];
        transaction.set(reference, {
          faq: nextEntries,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        return `home-faq-${nextEntries.length - 1}`;
      });
      await logActivity("created", "content", "homeFAQ", {
        question: data.question,
        answer: data.answer,
        ...(data.category !== undefined ? { category: data.category } : {}),
        active: data.active ?? true,
      });
      return id;
    }

    const db = getDatabase();
    const reference = db.collection("content").doc("homeFAQ");
    const id = await db.runTransaction(async (transaction: Transaction) => {
      const snapshot = await transaction.get(reference);
      const current = (snapshot as any).data();
      const entries = Array.isArray(current?.faq) ? current.faq : [];
      const nextEntries = [...entries, {
        pergunta: data.question,
        resposta: data.answer,
        ...(data.category !== undefined ? { categoria: data.category } : {}),
        ativo: data.active ?? true,
      }];
      transaction.set(reference, {
        faq: nextEntries,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return `home-faq-${nextEntries.length - 1}`;
    });
    await logActivity("created", "content", "homeFAQ", {
      question: data.question,
      answer: data.answer,
      ...(data.category !== undefined ? { category: data.category } : {}),
      active: data.active ?? true,
    });
    return id;
  },

  async update(id: string, data: Partial<FAQ>) {
    if (useClientSDK) {
      const clientDb = getClientDatabase();
      const homeFaqReference = doc(clientDb, "content", "homeFAQ");
      const result = await clientRunTransaction(clientDb, async (transaction) => {
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
          ...(data.category !== undefined ? { categoria: data.category } : {}),
          ...(data.active !== undefined ? { ativo: data.active } : {}),
        };
        transaction.update(homeFaqReference, {
          faq: entries,
          updatedAt: serverTimestamp(),
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
      return;
    }

    const db = getDatabase();
    const homeFaqReference = db.collection("content").doc("homeFAQ");
    const result = await db.runTransaction(async (transaction: Transaction) => {
      const snapshot = await transaction.get(homeFaqReference);
      const current = (snapshot as any).data();
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
        ...(data.category !== undefined ? { categoria: data.category } : {}),
        ...(data.active !== undefined ? { ativo: data.active } : {}),
      };
      transaction.update(homeFaqReference, {
        faq: entries,
        updatedAt: FieldValue.serverTimestamp(),
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
    if (useClientSDK) {
      const clientDb = getClientDatabase();
      const homeFaqReference = doc(clientDb, "content", "homeFAQ");
      const result = await clientRunTransaction(clientDb, async (transaction) => {
        const snapshot = await transaction.get(homeFaqReference);
        const current = snapshot.data();
        if (!current || !Array.isArray(current.faq)) return false;

        const entries = [...current.faq];
        const index = mapHomeFaqDocument(current).findIndex((faq) => faq.id === id);
        if (index < 0) return false;

        entries.splice(index, 1);
        transaction.update(homeFaqReference, {
          faq: entries,
          updatedAt: serverTimestamp(),
        });
        return true;
      });

      if (result) {
        await logActivity("deleted", "content", "homeFAQ", { id });
        return;
      }

      await deleteDocument("faq", id);
      return;
    }

    const db = getDatabase();
    const homeFaqReference = db.collection("content").doc("homeFAQ");
    const result = await db.runTransaction(async (transaction: Transaction) => {
      const snapshot = await transaction.get(homeFaqReference);
      const current = (snapshot as any).data();
      if (!current || !Array.isArray(current.faq)) return false;

      const entries = [...current.faq];
      const index = mapHomeFaqDocument(current).findIndex((faq) => faq.id === id);
      if (index < 0) return false;

      entries.splice(index, 1);
      transaction.update(homeFaqReference, {
        faq: entries,
        updatedAt: FieldValue.serverTimestamp(),
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
