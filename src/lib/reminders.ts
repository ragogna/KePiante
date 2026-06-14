// Promemoria cure salvati nel browser (nessun account, nessun DB server).
// Limite noto: le notifiche scattano solo quando l'app viene aperta o resta
// aperta. Per push reali ad app chiusa serve un mini-DB + Vercel Cron.

import type { CuraRicorrente } from "@/lib/schema";

export type Promemoria = {
  id: string;
  pianta: string; // nome comune
  nomeScientifico: string;
  foto?: string; // data URL miniatura
  attivita: string;
  ogniGiorni: number;
  dettaglio: string;
  prossima: number; // timestamp ms della prossima scadenza
};

const KEY = "kepiante.promemoria.v1";

export function caricaPromemoria(): Promemoria[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function salva(list: Promemoria[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function aggiungiPromemoria(
  pianta: string,
  nomeScientifico: string,
  cure: CuraRicorrente[],
  foto?: string,
): number {
  const list = caricaPromemoria();
  const ora = Date.now();
  const nuovi = cure.map((c) => ({
    id: crypto.randomUUID(),
    pianta,
    nomeScientifico,
    foto,
    attivita: c.attivita,
    ogniGiorni: c.ogniGiorni,
    dettaglio: c.dettaglio,
    prossima: ora + c.ogniGiorni * 86_400_000,
  }));
  salva([...list, ...nuovi]);
  return nuovi.length;
}

export function rimuoviPromemoria(id: string) {
  salva(caricaPromemoria().filter((p) => p.id !== id));
}

export function rimuoviPerPianta(nomeScientifico: string) {
  salva(
    caricaPromemoria().filter((p) => p.nomeScientifico !== nomeScientifico),
  );
}

// Segna come fatto: sposta la prossima scadenza avanti di ogniGiorni
export function segnaFatto(id: string) {
  const list = caricaPromemoria().map((p) =>
    p.id === id ? { ...p, prossima: Date.now() + p.ogniGiorni * 86_400_000 } : p,
  );
  salva(list);
}

export function scadenze(list = caricaPromemoria()): Promemoria[] {
  const ora = Date.now();
  return list.filter((p) => p.prossima <= ora);
}

export async function chiediPermessoNotifiche(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

// Mostra notifiche per le cure scadute e pianifica quelle in arrivo durante
// la sessione corrente.
export function avviaScheduler() {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  const notifica = (p: Promemoria) => {
    if (Notification.permission !== "granted") return;
    new Notification(`🌱 ${p.pianta}`, {
      body: `${p.attivita}: ${p.dettaglio}`,
      icon: "/icon.svg",
      tag: p.id,
    });
  };

  const ora = Date.now();
  for (const p of caricaPromemoria()) {
    const delta = p.prossima - ora;
    if (delta <= 0) {
      notifica(p);
    } else if (delta < 86_400_000) {
      // scade entro 24h: pianifica durante la sessione
      setTimeout(() => notifica(p), delta);
    }
  }
}
