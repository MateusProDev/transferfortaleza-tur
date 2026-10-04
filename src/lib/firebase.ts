import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
    if (typeof value !== "string") return false;
    const normalized = value.trim();
    return normalized.length > 0 && !normalized.startsWith("your_") && !normalized.startsWith("replace_") && !normalized.includes("example");
  });
};

const app = hasValidFirebaseConfig()
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

if (!app) {
  console.warn("Firebase config incomplete or using placeholder values. Firebase client services are disabled until valid env vars are provided.");
}

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  // Emulator setup would go here
}

export default app;
