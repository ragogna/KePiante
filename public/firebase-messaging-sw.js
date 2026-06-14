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

// Payload data-only: mostriamo noi la notifica (una sola, niente doppioni).
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  self.registration.showNotification(d.title || "KePiante", {
    body: d.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || undefined,
    data: { link: d.link || "/promemoria" },
  });
});

// Tap sulla notifica: apre l'app.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link =
    (event.notification.data && event.notification.data.link) ||
    "/promemoria";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const c of list) {
          if (c.url.includes(link) && "focus" in c) return c.focus();
        }
        return clients.openWindow(link);
      }),
  );
});
