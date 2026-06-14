import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAllowed } from "@/lib/allowlist-db";
import { db, pushServerConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";

// Salva una nuova analisi nella cronologia dell'utente.
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !(await isAllowed(email))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  if (!pushServerConfigured()) {
    return NextResponse.json(
      { error: "Cronologia non configurata (Firebase)" },
      { status: 503 },
    );
  }

  let scheda: unknown;
  let thumb = "";
  try {
    const body = await req.json();
    scheda = body.scheda;
    thumb = typeof body.thumb === "string" ? body.thumb : "";
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }
  if (!scheda) {
    return NextResponse.json({ error: "Scheda mancante" }, { status: 400 });
  }

  const s = scheda as { nomeComune?: string; statoSalute?: string };
  const ref = await db().collection("analisi").add({
    email,
    createdAt: Date.now(),
    nomeComune: s.nomeComune ?? "Pianta",
    statoSalute: s.statoSalute ?? "non_determinabile",
    thumb,
    scheda,
  });

  return NextResponse.json({ id: ref.id });
}

// Elenco analisi dell'utente (senza la scheda completa, solo anteprime).
export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !(await isAllowed(email))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  if (!pushServerConfigured()) {
    return NextResponse.json({ items: [] });
  }

  // Niente orderBy nella query per evitare indici compositi: ordino in JS.
  const snap = await db()
    .collection("analisi")
    .where("email", "==", email)
    .get();

  const items = snap.docs
    .map((d) => {
      const x = d.data();
      return {
        id: d.id,
        nomeComune: x.nomeComune,
        statoSalute: x.statoSalute,
        thumb: x.thumb ?? "",
        createdAt: x.createdAt ?? 0,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 100);

  return NextResponse.json({ items });
}
