import { adminDb } from './firebase-admin';

interface InitialData {
  banners: Array<{
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    order: number;
    active: boolean;
  }>;
  tours: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    imageUrl: string;
    active: boolean;
  }>;
  transfers: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    from: string;
    to: string;
    active: boolean;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    text: string;
    rating: number;
    active: boolean;
  }>;
  blog: Array<{
    id: string;
    title: string;
    content: string;
    author: string;
    publishedAt: string;
    active: boolean;
  }>;
  faq: Array<{
    id: string;
    question: string;
    answer: string;
    order: number;
    active: boolean;
  }>;
}

const initialData: InitialData = {
  banners: [],
  tours: [],
  transfers: [],
  testimonials: [],
  blog: [],
  faq: [],
};

let initializationPromise: Promise<boolean> | null = null;

export async function initializeFirebaseCollections(): Promise<boolean> {
  if (!adminDb) {
    console.warn('Firebase Admin not initialized, skipping collection creation');
    return false;
  }

  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('Starting Firebase collections initialization...');

      const collections = ['banners', 'tours', 'transfers', 'testimonials', 'blog', 'faq'];

      for (const collectionName of collections) {
        const collectionRef = adminDb.collection(collectionName);
        const snapshot = await collectionRef.limit(1).get();

        if (snapshot.empty) {
          console.log(`Creating collection: ${collectionName}`);
          
          // Add initial data if available
          const initialItems = initialData[collectionName as keyof InitialData];
          if (initialItems && initialItems.length > 0) {
            for (const item of initialItems) {
              await collectionRef.doc(item.id).set(item);
            }
          }
          
          console.log(`Collection ${collectionName} initialized`);
        } else {
          console.log(`Collection ${collectionName} already exists, skipping`);
        }
      }

      console.log('Firebase collections initialization completed successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Firebase collections:', error);
      return false;
    }
  })();

  return initializationPromise;
}

export async function checkFirebaseInitialization() {
  if (!adminDb) {
    return { initialized: false, collections: [] };
  }

  try {
    const collections = ['banners', 'tours', 'transfers', 'testimonials', 'blog', 'faq'];
    const status: Record<string, boolean> = {};

    for (const collectionName of collections) {
      const collectionRef = adminDb.collection(collectionName);
      const snapshot = await collectionRef.limit(1).get();
      status[collectionName] = !snapshot.empty;
    }

    return {
      initialized: Object.values(status).some(v => v),
      collections: status,
    };
  } catch (error) {
    console.error('Error checking Firebase initialization:', error);
    return { initialized: false, collections: {} };
  }
}

// Auto-initialize on first import (lazy initialization)
export function ensureInitialized() {
  if (adminDb && !initializationPromise) {
    // Initialize in background without blocking
    initializeFirebaseCollections().catch(console.error);
  }
}

