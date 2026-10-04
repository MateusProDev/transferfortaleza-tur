import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasValidFirebaseConfig = () => {
  const values = Object.values(firebaseConfig);
  return values.every((value) => {
    if (typeof value !== 'string') return false;
    const normalized = value.trim();
    return normalized.length > 0 && !normalized.startsWith('your_') && !normalized.startsWith('replace_') && !normalized.includes('example');
  });
};

const app = hasValidFirebaseConfig() ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error('Firebase Auth não está configurado. Verifique as variáveis NEXT_PUBLIC_FIREBASE_*');
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutAdmin() {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAdminAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}

export async function getCurrentAdminIdToken(forceRefresh = false) {
  if (!auth || !auth.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}

export async function getFreshAdminIdToken() {
  return getCurrentAdminIdToken(true);
}
