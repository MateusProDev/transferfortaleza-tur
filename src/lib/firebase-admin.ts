import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import path from "path";

const getServiceAccountFromEnv = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
    : path.join(process.cwd(), "firebase-adminsdk.json");
  const legacyFilePath = path.join(
    process.cwd(),
    "passeiolegal-firebase-adminsdk-fbsvc-6edf8c6e66.json",
  );
  const serviceAccountPath = configuredPath
    ? filePath
    : existsSync(filePath)
      ? filePath
      : legacyFilePath;

  if (!existsSync(serviceAccountPath)) return null;
  return JSON.parse(readFileSync(serviceAccountPath, "utf8"));
};

function escapeJsonStringControlCharacters(value: string) {
  let result = "";
  let inString = false;
  let escaped = false;

  for (const char of value) {
    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }
      if (char === "\\") {
        result += char;
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
        result += char;
        continue;
      }
      if (char === "\n") {
        result += "\\n";
        continue;
      }
      if (char === "\r") {
        result += "\\r";
        continue;
      }
      if (char === "\t") {
        result += "\\t";
        continue;
      }
      const code = char.charCodeAt(0);
      if (code < 0x20) {
        result += `\\u${code.toString(16).padStart(4, "0")}`;
        continue;
      }
    } else if (char === '"') {
      inString = true;
    }

    result += char;
  }

  return result;
}

function getServiceAccountKey() {
  const serviceAccountKey = getServiceAccountFromEnv() || getServiceAccountFromFile();

  if (serviceAccountKey) return serviceAccountKey;

  if (!process.env.FIREBASE_ADMIN_SDK) return null;

  try {
    let serialized = process.env.FIREBASE_ADMIN_SDK.trim();
    if (
      (serialized.startsWith('"') && serialized.endsWith('"')) ||
      (serialized.startsWith("'") && serialized.endsWith("'"))
    ) {
      serialized = serialized.slice(1, -1);
    }
    try {
      return JSON.parse(serialized);
    } catch {
      return JSON.parse(escapeJsonStringControlCharacters(serialized));
    }
  } catch {
    console.warn("Failed to parse FIREBASE_ADMIN_SDK JSON, using alternative methods");
    return null;
  }
}

let app: App | undefined;

if (typeof window === "undefined") {
  try {
    const serviceAccountKey = getServiceAccountKey();

    if (serviceAccountKey) {
      app = getApps()[0] ?? initializeApp({
        credential: cert(serviceAccountKey),
        projectId:
          serviceAccountKey.projectId ||
          serviceAccountKey.project_id ||
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
          "maiatur",
      });
    } else {
      console.warn("Firebase Admin SDK credentials not available. Admin features will be limited.");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}

export const adminDb: Firestore | null = app ? getFirestore(app) : null;
export const adminAuth: Auth | null = app ? getAuth(app) : null;
export const getAdminFirestore = () => adminDb;
export const getAdminAuth = () => adminAuth;
export const getAdminProjectId = () => app?.options.projectId || getApps()[0]?.options.projectId || null;
export const verifyIdToken = async (token: string) => {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth não inicializado");
  }

  return adminAuth.verifyIdToken(token);
};

export default app;
