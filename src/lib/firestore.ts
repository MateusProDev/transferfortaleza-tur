import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Query,
  QueryConstraint,
  setDoc,
  Timestamp,
  limit as firestoreLimit,
} from "firebase/firestore";
import { db } from "./firebase";
import * as Types from "@/types";
import {
  isTransferPackage,
  mapBannerDocument,
  mapBannerInputToDocument,
  mapBlogPostDocument,
  mapBlogPostInputToDocument,
  mapCatalogInputToPackage,
  mapGoogleReviewsDocument,
  mapHomeFaqDocument,
  mapPackageToTour,
  mapPackageToTransfer,
  mapSiteSettings,
  mapTestimonialDocument,
  mapTestimonialInputToDocument,
  toPlainFirestoreValue,
} from "./firestore-content";

// Generic CRUD operations
export const firebaseService = {
  // Create
  async create<T>(collectionName: string, data: Partial<T>) {
    if (!db) {
      console.warn("Firebase is not configured. Skipping create for collection:", collectionName);
      return "";
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      if (collectionName !== "activityLogs") {
        try {
          await activityLogService.log("admin", "created", collectionName, docRef.id, data as Record<string, unknown>);
        } catch (logError) {
          console.error("Error recording activity:", logError);
        }
      }
      return docRef.id;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  },

  // Read single
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    if (!db) {
      return null;
    }

    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  },

  // Read multiple
  async getMany<T>(
    collectionName: string,
    constraints?: QueryConstraint[]
  ): Promise<T[]> {
    if (!db) {
      return [];
    }

    try {
      let q: Query = collection(db, collectionName);
      if (constraints && constraints.length > 0) {
        q = query(collection(db, collectionName), ...constraints);
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting documents from "${collectionName}":`, error);
      throw error;
    }
  },

  // Update
  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    if (!db) {
      return;
    }

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      if (collectionName !== "activityLogs") {
        try {
          await activityLogService.log("admin", "updated", collectionName, id, data as Record<string, unknown>);
        } catch (logError) {
          console.error("Error recording activity:", logError);
        }
      }
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    if (!db) {
      return;
    }

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      if (collectionName !== "activityLogs") {
        try {
          await activityLogService.log("admin", "deleted", collectionName, id);
        } catch (logError) {
          console.error("Error recording activity:", logError);
        }
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Batch operations
  async setMultiple<T>(
    collectionName: string,
    data: Array<{ id: string; data: Partial<T> }>
  ): Promise<void> {
    if (!db) {
      return;
    }

    try {
      for (const item of data) {
        const docRef = doc(db, collectionName, item.id);
        await setDoc(docRef, {
          ...item.data,
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Error setting multiple documents:", error);
      throw error;
    }
  },
};

// Specialized collection services
export const bannerService = {
  async getAll() {
    const documents = await firebaseService.getMany<Record<string, unknown>>("banners");
    const banners = documents
      .map((banner) => mapBannerDocument(String(banner.id), banner))
      .filter((banner) => banner.active);
    return banners.sort((first, second) => {
      return first.order - second.order;
    });
  },

  async getById(id: string) {
    const banner = await firebaseService.get<Record<string, unknown>>("banners", id);
    return banner ? mapBannerDocument(id, banner) : null;
  },

  async create(data: Omit<Types.Banner, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Record<string, unknown>>("banners", mapBannerInputToDocument(data));
  },

  async update(id: string, data: Partial<Types.Banner>) {
    return firebaseService.update<Record<string, unknown>>("banners", id, mapBannerInputToDocument(data));
  },

  async delete(id: string) {
    return firebaseService.delete("banners", id);
  },
};

export const tourService = {
  async getAll(onlyActive = false) {
    const packages = await firebaseService.getMany<Record<string, unknown>>("pacotes");
    const tours = packages
      .filter((item) => !isTransferPackage(item))
      .map((item) => mapPackageToTour(String(item.id), item))
      .filter((tour) => !onlyActive || tour.active);
    return tours.sort((first, second) => {
      if (first.featured !== second.featured) return first.featured ? -1 : 1;
      if (first.featured && second.featured) {
        return (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER);
      }
      return first.name.localeCompare(second.name);
    });
  },

  async getById(id: string) {
    const packageDocument = await firebaseService.get<Record<string, unknown>>("pacotes", id);
    return packageDocument && !isTransferPackage(packageDocument)
      ? mapPackageToTour(id, packageDocument)
      : null;
  },

  async getBySlug(slug: string) {
    const tours = await tourService.getAll(false);
    return tours.find((tour) => tour.slug === slug) || null;
  },

  async getFeatured() {
    return (await tourService.getAll(true)).filter((tour) => tour.featured);
  },

  // Busca tours relacionados para recomendação (mesma categoria ou featured, excluindo o atual)
  async getRelated(excludeId: string, limit: number = 3) {
    try {
      const tours = await tourService.getAll(true);
      return tours.filter((tour) => tour.id !== excludeId).slice(0, limit);
    } catch (error) {
      console.error("Error fetching related tours:", error);
      return [];
    }
  },

  async getRecommended(ids: string[], excludeId: string, limit: number = 3) {
    const recommendations = await Promise.all(ids.map((id) => tourService.getById(id)));
    return recommendations
      .filter((tour): tour is Types.Tour => Boolean(tour && tour.id !== excludeId && tour.active))
      .slice(0, limit);
  },

  async create(data: Omit<Types.Tour, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Record<string, unknown>>("pacotes", mapCatalogInputToPackage(data, "tour", true));
  },

  async update(id: string, data: Partial<Types.Tour>) {
    return firebaseService.update<Record<string, unknown>>("pacotes", id, mapCatalogInputToPackage(data, "tour"));
  },

  async delete(id: string) {
    return firebaseService.delete("pacotes", id);
  },
};

export const transferService = {
  async getAll(onlyActive = false) {
    const packages = await firebaseService.getMany<Record<string, unknown>>("pacotes");
    return packages
      .filter(isTransferPackage)
      .map((item) => mapPackageToTransfer(String(item.id), item))
      .filter((transfer) => !onlyActive || transfer.active)
      .sort((first, second) => first.name.localeCompare(second.name));
  },

  async getFeatured() {
    return (await transferService.getAll(true))
      .filter((transfer) => transfer.featuredOnHome)
      .sort((first, second) =>
        (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER)
        || first.name.localeCompare(second.name)
      );
  },

  async getById(id: string) {
    const packageDocument = await firebaseService.get<Record<string, unknown>>("pacotes", id);
    return packageDocument && isTransferPackage(packageDocument)
      ? mapPackageToTransfer(id, packageDocument)
      : null;
  },

  async getBySlug(slug: string) {
    const transfers = await transferService.getAll(false);
    return transfers.find((transfer) => transfer.slug === slug) || null;
  },

  async getRelated(excludeId: string, limit: number = 3) {
    try {
      const transfers = await transferService.getAll(true);
      return transfers.filter((transfer) => transfer.id !== excludeId).slice(0, limit);
    } catch (error) {
      console.error("Error fetching related transfers:", error);
      return [];
    }
  },

  async getRecommended(ids: string[], excludeId: string, limit: number = 3) {
    const recommendations = await Promise.all(ids.map((id) => transferService.getById(id)));
    return recommendations
      .filter((transfer): transfer is Types.Transfer => Boolean(transfer && transfer.id !== excludeId && transfer.active))
      .slice(0, limit);
  },

  async create(
    data: Omit<Types.Transfer, "id" | "createdAt" | "updatedAt">
  ) {
    return firebaseService.create<Record<string, unknown>>("pacotes", mapCatalogInputToPackage(data, "transfer", true));
  },

  async update(id: string, data: Partial<Types.Transfer>) {
    return firebaseService.update<Record<string, unknown>>("pacotes", id, mapCatalogInputToPackage(data, "transfer"));
  },

  async delete(id: string) {
    return firebaseService.delete("pacotes", id);
  },
};

export const testimonialService = {
  async getAll() {
    const testimonials = await firebaseService.getMany<Record<string, unknown>>("avaliacoes");
    return testimonials.map((testimonial) => mapTestimonialDocument(String(testimonial.id), testimonial));
  },

  async getById(id: string) {
    const testimonial = await firebaseService.get<Record<string, unknown>>("avaliacoes", id);
    return testimonial ? mapTestimonialDocument(id, testimonial) : null;
  },

  async create(
    data: Omit<Types.Testimonial, "id" | "createdAt" | "updatedAt">
  ) {
    return firebaseService.create<Record<string, unknown>>("avaliacoes", mapTestimonialInputToDocument(data));
  },

  async update(id: string, data: Partial<Types.Testimonial>) {
    return firebaseService.update<Record<string, unknown>>("avaliacoes", id, mapTestimonialInputToDocument(data));
  },

  async delete(id: string) {
    return firebaseService.delete("avaliacoes", id);
  },
};

export const googleReviewsService = {
  async get() {
    const content = await firebaseService.get<Record<string, unknown>>("content", "googleReviews");
    return content ? mapGoogleReviewsDocument(content) : null;
  },
};

export const homeContentService = {
  async getSections() {
    const [services, differentials, imageCarousel, transferBeberibe] = await Promise.all([
      firebaseService.get<Record<string, unknown>>("content", "servicesSection"),
      firebaseService.get<Record<string, unknown>>("content", "differentialsSection"),
      firebaseService.get<Record<string, unknown>>("content", "imageCarouselSection"),
      firebaseService.get<Record<string, unknown>>("content", "transferBeberibe"),
    ]);

    return {
      services: toPlainFirestoreValue(services),
      differentials: toPlainFirestoreValue(differentials),
      imageCarousel: toPlainFirestoreValue(imageCarousel),
      transferBeberibe: toPlainFirestoreValue(transferBeberibe),
    };
  },
};

export const blogService = {
  async getAll(onlyPublished = false) {
    const constraints: QueryConstraint[] = onlyPublished
      ? [
          where("published", "==", true),
          orderBy("views", "desc"),
          orderBy("publishedAt", "desc"),
        ]
      : [];
    const posts = await firebaseService.getMany<Record<string, unknown>>("blogPosts", constraints);
    return posts
      .map((post) => mapBlogPostDocument(String(post.id), post))
      .filter((post) => !onlyPublished || post.published)
      .sort((first, second) =>
        (second.views ?? 0) - (first.views ?? 0)
        || second.publishedAt.getTime() - first.publishedAt.getTime()
      );
  },

  async getById(id: string) {
    const post = await firebaseService.get<Record<string, unknown>>("blogPosts", id);
    return post ? mapBlogPostDocument(id, post) : null;
  },

  async getBySlug(slug: string) {
    const posts = await blogService.getAll(false);
    return posts.find((post) => post.slug === slug) || null;
  },

  async create(data: Omit<Types.BlogPost, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Record<string, unknown>>("blogPosts", mapBlogPostInputToDocument(data));
  },

  async update(id: string, data: Partial<Types.BlogPost>) {
    return firebaseService.update<Record<string, unknown>>("blogPosts", id, mapBlogPostInputToDocument(data));
  },

  async delete(id: string) {
    return firebaseService.delete("blogPosts", id);
  },
};

export const faqService = {
  async getAll() {
    const homeFaq = await firebaseService.get<Record<string, unknown>>("content", "homeFAQ");
    if (homeFaq) return mapHomeFaqDocument(homeFaq);
    return firebaseService.getMany<Types.FAQ>("faq", []);
  },

  async getHomeContent() {
    const homeFaq = await firebaseService.get<Record<string, unknown>>("content", "homeFAQ");
    return {
      faqs: homeFaq ? mapHomeFaqDocument(homeFaq) : await firebaseService.getMany<Types.FAQ>("faq", []),
      title: typeof homeFaq?.title === "string" ? homeFaq.title : "",
      subtitle: typeof homeFaq?.subtitle === "string" ? homeFaq.subtitle : "",
    };
  },

  async getById(id: string) {
    const homeFaq = await firebaseService.get<Record<string, unknown>>("content", "homeFAQ");
    if (homeFaq) {
      return mapHomeFaqDocument(homeFaq).find((faq) => faq.id === id) || null;
    }
    return firebaseService.get<Types.FAQ>("faq", id);
  },

  async create(data: Omit<Types.FAQ, "id" | "createdAt" | "updatedAt">) {
    const homeFaq = await firebaseService.get<Record<string, unknown>>("content", "homeFAQ");
    const entries = Array.isArray(homeFaq?.faq) ? homeFaq.faq : [];
    const faq = {
      pergunta: data.question,
      resposta: data.answer,
    };
    const nextEntries = [...entries, faq];

    if (homeFaq) {
      await firebaseService.update<Record<string, unknown>>("content", "homeFAQ", { faq: nextEntries });
    } else {
      await firebaseService.setMultiple("content", [{ id: "homeFAQ", data: { faq: nextEntries } }]);
    }

    return `home-faq-${nextEntries.length - 1}`;
  },

  async update(id: string, data: Partial<Types.FAQ>) {
    const homeFaq = await firebaseService.get<Record<string, unknown>>("content", "homeFAQ");
    if (!homeFaq || !Array.isArray(homeFaq.faq)) {
      return firebaseService.update<Types.FAQ>("faq", id, data);
    }

    const entries = homeFaq.faq;
    const index = mapHomeFaqDocument(homeFaq).findIndex((faq) => faq.id === id);
    if (index < 0) return firebaseService.update<Types.FAQ>("faq", id, data);

    const current = Object.assign({}, entries[index]) as Record<string, unknown>;
    const updated = {
      ...current,
      ...(data.question !== undefined ? { pergunta: data.question } : {}),
      ...(data.answer !== undefined ? { resposta: data.answer } : {}),
    };
    entries[index] = updated;
    await firebaseService.update<Record<string, unknown>>("content", "homeFAQ", { faq: entries });
  },

  async delete(id: string) {
    const homeFaq = await firebaseService.get<Record<string, unknown>>("content", "homeFAQ");
    if (!homeFaq || !Array.isArray(homeFaq.faq)) {
      return firebaseService.delete("faq", id);
    }

    const entries = homeFaq.faq;
    const index = mapHomeFaqDocument(homeFaq).findIndex((faq) => faq.id === id);
    if (index < 0) return firebaseService.delete("faq", id);

    entries.splice(index, 1);
    await firebaseService.update<Record<string, unknown>>("content", "homeFAQ", { faq: entries });
  },
};

export const settingsService = {
  async get() {
    const [allSettings, header, footer, seo] = await Promise.all([
      firebaseService.getMany<Record<string, unknown>>("settings"),
      firebaseService.get<Record<string, unknown>>("content", "header"),
      firebaseService.get<Record<string, unknown>>("content", "footer"),
      firebaseService.get<Record<string, unknown>>("content", "homeSeo"),
    ]);
    const siteSettings = allSettings.find((item) => item.id !== "whatsapp") || null;
    const whatsapp = allSettings.find((item) => item.id === "whatsapp") || null;
    return mapSiteSettings(siteSettings, whatsapp, header, footer, seo);
  },

  async update(data: Partial<Types.SiteSettings>) {
    const allSettings = await firebaseService.getMany<Record<string, unknown>>("settings");
    const siteSettings = allSettings.find((item) => item.id !== "whatsapp");
    let result: string | void;

    if (siteSettings) {
      await firebaseService.update<Record<string, unknown>>("settings", String(siteSettings.id), data);
      result = undefined;
    } else {
      const { id: _id, ...settingsData } = data;
      result = await firebaseService.create<Record<string, unknown>>("settings", settingsData);
    }

    const headerPatch: Record<string, unknown> = {};
    if (data.headerLogo !== undefined) headerPatch.logoUrl = data.headerLogo;
    if (data.headerLogoAlt !== undefined) headerPatch.logoAlt = data.headerLogoAlt;
    if (Object.keys(headerPatch).length > 0) {
      const header = await firebaseService.get<Record<string, unknown>>("content", "header");
      if (header) await firebaseService.update<Record<string, unknown>>("content", "header", headerPatch);
      else await firebaseService.setMultiple("content", [{ id: "header", data: headerPatch }]);
    }

    const footerPatch: Record<string, unknown> = {};
    if (data.companyName !== undefined) footerPatch.companyName = data.companyName;
    if (data.footerText !== undefined) footerPatch.text = data.footerText;
    if (data.contactInfo) {
      const footer = await firebaseService.get<Record<string, unknown>>("content", "footer");
      const currentContact = footer && typeof footer.contact === "object"
        ? Object.assign({}, footer.contact)
        : {};
      const contactPatch: Record<string, unknown> = {};
      for (const key of ["phone", "email", "address"] as const) {
        if (data.contactInfo[key] !== undefined) contactPatch[key] = data.contactInfo[key];
      }
      footerPatch.contact = { ...currentContact, ...contactPatch };
    }
    if (data.socialLinks) {
      footerPatch.social = Object.fromEntries(
        data.socialLinks.map((link) => [link.platform, { link: link.url, icon: link.icon }]),
      );
    }
    if (Object.keys(footerPatch).length > 0) {
      const footer = await firebaseService.get<Record<string, unknown>>("content", "footer");
      if (footer) await firebaseService.update<Record<string, unknown>>("content", "footer", footerPatch);
      else await firebaseService.setMultiple("content", [{ id: "footer", data: footerPatch }]);
    }

    const whatsappNumber = data.whatsappConfig?.number ?? data.contactInfo?.whatsapp;
    if (whatsappNumber !== undefined) {
      const whatsapp = await firebaseService.get<Record<string, unknown>>("settings", "whatsapp");
      if (whatsapp) {
        await firebaseService.update<Record<string, unknown>>("settings", "whatsapp", { number: whatsappNumber });
      } else {
        await firebaseService.setMultiple("settings", [{ id: "whatsapp", data: { number: whatsappNumber } }]);
      }
    }

    return result;
  },
};

export const activityLogService = {
  async log(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, unknown>
  ) {
    if (!db) {
      return "";
    }

    return firebaseService.create<Types.ActivityLog>("activityLogs", {
      userId,
      action,
      entityType,
      entityId,
      changes,
      timestamp: new Date(),
    });
  },

  async getRecent(limit?: number) {
    if (!db) {
      return [];
    }

    const constraints: QueryConstraint[] = [orderBy("timestamp", "desc")];
    if (limit) constraints.push(firestoreLimit(limit));
    return firebaseService.getMany<Types.ActivityLog>(
      "activityLogs",
      constraints
    );
  },
};
