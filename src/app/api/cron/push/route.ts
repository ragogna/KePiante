import { NextResponse } from "next/server";
import { db, messaging, pushServerConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const GIORNO = 86_400_000;

// Eseguito da Vercel Cron: invia push per le cure scadute e riprogramma.
export async function GET(req: Request) {
  // Vercel Cron invia automaticamente "Authorization: Bearer $CRON_SECRET".
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  if (!pushServerConfigured()) {
    return NextResponse.json({ skip: "push non configurato" });
  }

  const now = Date.now();
  const snap = await db().collection("pushSubs").get();
  let inviate = 0;

  for (const doc of snap.docs) {
    const data = doc.data() as {
      token: string;
      reminders: {
        pianta: string;
        attivita: string;
        ogniGiorni: number;
        prossima: number;
      }[];
    };
    let modificato = false;

    for (const r of data.reminders ?? []) {
      if (r.prossima <= now) {
        try {
          await messaging().send({
            token: data.token,
            // Solo data: la notifica la mostra il service worker (no doppioni).
            data: {
              title: `🌱 ${r.pianta}`,
              body: `È ora: ${r.attivita}`,
              link: "/promemoria",
            },
          });
          inviate++;
        } catch {
          // token non più valido: rimuoviamo la sottoscrizione
          await doc.ref.delete();
          modificato = false;
          break;
        }
        // riprogramma alla prossima scadenza futura
        while (r.prossima <= now) r.prossima += r.ogniGiorni * GIORNO;
        modificato = true;
      }
    }

    if (modificato) await doc.ref.update({ reminders: data.reminders });
  }

  return NextResponse.json({ inviate });
}
