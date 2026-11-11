import admin, { getApps } from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

console.log('[firebase-admin] Module loaded, admin exists:', !!admin);

const getServiceAccountFromEnv = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  console.log('[firebase-admin] getServiceAccountFromEnv - projectId:', !!projectId, 'clientEmail:', !!clientEmail, 'privateKey:', !!privateKey);

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  return null;
};

const getServiceAccountFromFile = () => {
  const configuredPath = process.env.FIREBASE_ADMIN_SDK_PATH;
  const filePath = configuredPath
    ? path.resolve(process.cwd(), configuredPath)
    : path.join(process.cwd(), 'firebase-adminsdk.json');
  const legacyFilePath = path.join(
    process.cwd(),
    'passeiolegal-firebase-adminsdk-fbsvc-6edf8c6e66.json',
  );
  const serviceAccountPath = configuredPath
    ? filePath
    : existsSync(filePath)
      ? filePath
      : legacyFilePath;

  if (!existsSync(serviceAccountPath)) return null;
  return JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
};

if (typeof window === 'undefined') {
  try {
    console.log('[firebase-admin] Initializing Firebase Admin SDK...');
    
    let serviceAccountKey = getServiceAccountFromEnv() || getServiceAccountFromFile();

    // Try parsing FIREBASE_ADMIN_SDK only if other methods fail
    if (!serviceAccountKey && process.env.FIREBASE_ADMIN_SDK) {
      try {
        console.log('[firebase-admin] Trying FIREBASE_ADMIN_SDK env var...');
        serviceAccountKey = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
        console.log('[firebase-admin] FIREBASE_ADMIN_SDK parsed successfully');
      } catch (parseError) {
        console.warn('Failed to parse FIREBASE_ADMIN_SDK JSON, using alternative methods');
      }
    }

    if (serviceAccountKey) {
      console.log('[firebase-admin] Service account key found, initializing app...');
      if (!getApps().length) {
        admin.initializeApp({
          credential: (admin as any).credential.cert(serviceAccountKey),
          projectId: serviceAccountKey.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'maiatur',
        });
        console.log('[firebase-admin] Firebase Admin initialized successfully');
      } else {
        console.log('[firebase-admin] Firebase Admin already initialized');
      }
    } else {
      console.warn('Firebase Admin SDK credentials not found. Admin features will be limited.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminDb = getApps().length ? (admin as any).firestore() : null;
export const adminAuth = getApps().length ? (admin as any).auth() : null;
export const getAdminFirestore = () => adminDb;
export const getAdminAuth = () => adminAuth;
export const getAdminProjectId = () => getApps()[0]?.options.projectId || null;
export const verifyIdToken = async (token: string) => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth não inicializado');
  }

  return adminAuth.verifyIdToken(token);
};

export default admin;
