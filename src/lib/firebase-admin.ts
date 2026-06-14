import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// Inizializza Firebase Admin dal service account in env (JSON stringificato).
let app: App | null = null;

function ensure(): App {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT mancante");
  const sa = JSON.parse(raw);
  app = initializeApp({ credential: cert(sa) });
  return app;
}

export function db() {
  return getFirestore(ensure());
}

export function messaging() {
  return getMessaging(ensure());
}

export const pushServerConfigured = () =>
  Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
