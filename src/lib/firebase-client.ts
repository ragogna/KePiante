import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const VAPID = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

// True se la configurazione push lato client è presente.
export const pushConfigured = Boolean(firebaseConfig.apiKey && VAPID);

function getApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

// Registra il service worker (config passata in query, è pubblica) e
// restituisce il token FCM del dispositivo.
export async function getPushToken(): Promise<string | null> {
  if (!pushConfigured) return null;
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (!(await isSupported())) return null;

  const qs = new URLSearchParams({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
  const reg = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${qs}`,
  );

  const messaging = getMessaging(getApp());
  return getToken(messaging, {
    vapidKey: VAPID,
    serviceWorkerRegistration: reg,
  });
}
