import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

const getServiceAccountFromEnv = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

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
  try {
    const filePath = path.join(process.cwd(), 'passeiolegal-firebase-adminsdk-fbsvc-6edf8c6e66.json');
    const fileContent = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch {
    return null;
  }
};

if (typeof window === 'undefined') {
  try {
    const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK
      ? JSON.parse(process.env.FIREBASE_ADMIN_SDK)
      : getServiceAccountFromEnv() || getServiceAccountFromFile();

    if (serviceAccountKey) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountKey),
          projectId: serviceAccountKey.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'passeiolegal',
        });
      }
    } else {
      console.warn('Firebase Admin SDK credentials not found. Admin features will be limited.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const getAdminFirestore = () => adminDb;
export const getAdminAuth = () => adminAuth;
export const verifyIdToken = async (token: string) => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth não inicializado');
  }

  return adminAuth.verifyIdToken(token);
};

export default admin;
