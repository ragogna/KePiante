/* Service worker per le notifiche push in background (FCM).
   La config Firebase è pubblica e viene passata via query string. */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

const p = new URL(self.location).searchParams;
firebase.initializeApp({
  apiKey: p.get("apiKey"),
  authDomain: p.get("authDomain"),
  projectId: p.get("projectId"),
  messagingSenderId: p.get("messagingSenderId"),
  appId: p.get("appId"),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || "KePiante", {
    body: n.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  });
});
