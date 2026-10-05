import { adminDb } from './firebase-admin';

interface InitialData {
  banners: Array<{
    id: string;
    titulo: string;
    imagem: string;
    botaoLink: string;
    ordem: number;
    ativo: boolean;
  }>;
  pacotes: Array<{
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    destaque: boolean;
  }>;
  avaliacoes: Array<{
    id: string;
    nomeCliente: string;
    comentario: string;
    nota: number;
  }>;
  blogPosts: Array<{
    id: string;
    title: string;
    content: string;
    author: string;
    publishedAt: string;
  }>;
}

const initialData: InitialData = {
  banners: [],
  pacotes: [],
  avaliacoes: [],
  blogPosts: [],
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

      const collections = ['banners', 'pacotes', 'avaliacoes', 'blogPosts', 'content', 'settings'];

      for (const collectionName of collections) {
        const collectionRef = adminDb.collection(collectionName);
        const snapshot = await collectionRef.limit(1).get();

        if (snapshot.empty) {
          console.log(`Creating collection: ${collectionName}`);
          
          // Add initial data if available
          const initialItems = initialData[collectionName as keyof InitialData] || [];
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
    const collections = ['banners', 'pacotes', 'avaliacoes', 'blogPosts', 'content', 'settings'];
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
