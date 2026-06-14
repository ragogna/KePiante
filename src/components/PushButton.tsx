"use client";

import { useState } from "react";
import { getPushToken, pushConfigured } from "@/lib/firebase-client";
import { caricaPromemoria } from "@/lib/reminders";
import { BellRing, Check, Loader2 } from "lucide-react";

// Attiva le notifiche push reali (anche ad app chiusa) registrando il
// dispositivo su Firestore via /api/push/subscribe.
export default function PushButton() {
  const [stato, setStato] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  // Se la config push non c'è, non mostriamo nulla.
  if (!pushConfigured) return null;

  async function attiva() {
    setStato("loading");
    setMsg("");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setStato("err");
        setMsg("Permesso notifiche negato.");
        return;
      }
      const token = await getPushToken();
      if (!token) {
        setStato("err");
        setMsg("Push non supportato su questo dispositivo/browser.");
        return;
      }
      const reminders = caricaPromemoria().map((p) => ({
        pianta: p.pianta,
        attivita: p.attivita,
        ogniGiorni: p.ogniGiorni,
        prossima: p.prossima,
      }));
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reminders }),
      });
      if (!res.ok) throw new Error();
      setStato("ok");
    } catch {
      setStato("err");
      setMsg("Errore durante l'attivazione. Riprova.");
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="font-semibold text-emerald-950">Notifiche push</p>
      <p className="mt-1 text-sm text-emerald-800">
        Ricevi i promemoria delle cure <strong>anche ad app chiusa</strong>.
        Attiva su questo dispositivo.
      </p>
      <button
        onClick={attiva}
        disabled={stato === "loading" || stato === "ok"}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-400"
      >
        {stato === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : stato === "ok" ? (
          <Check size={16} />
        ) : (
          <BellRing size={16} />
        )}
        {stato === "ok" ? "Push attive" : "Attiva notifiche push"}
      </button>
      {msg && <p className="mt-2 text-xs text-amber-700">{msg}</p>}
    </div>
  );
}
