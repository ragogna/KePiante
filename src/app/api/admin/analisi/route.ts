import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isOwner } from "@/lib/allowlist";
import { db, pushServerConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";

// Solo owner: elenco di TUTTE le analisi, di tutti gli utenti.
export async function GET() {
  const session = await auth();
  if (!isOwner(session?.user?.email)) {
    return NextResponse.json({ error: "Solo proprietario" }, { status: 403 });
  }
  if (!pushServerConfigured()) {
    return NextResponse.json({ items: [] });
  }

  const snap = await db().collection("analisi").get();
  const items = snap.docs
    .map((d) => {
      const x = d.data();
      return {
        id: d.id,
        email: x.email,
        nomeComune: x.nomeComune,
        statoSalute: x.statoSalute,
        thumb: x.thumb ?? "",
        createdAt: x.createdAt ?? 0,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({ items });
}
