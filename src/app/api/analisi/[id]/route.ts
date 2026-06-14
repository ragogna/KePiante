import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAllowed } from "@/lib/allowlist-db";
import { db, pushServerConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";

async function owner(id: string) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !(await isAllowed(email))) return { error: "Non autorizzato", status: 401 as const };
  if (!pushServerConfigured())
    return { error: "Cronologia non configurata", status: 503 as const };
  const doc = await db().collection("analisi").doc(id).get();
  if (!doc.exists) return { error: "Non trovata", status: 404 as const };
  const data = doc.data()!;
  if (data.email !== email) return { error: "Non autorizzato", status: 401 as const };
  return { doc, data };
}

// Dettaglio di una singola analisi (scheda completa).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const r = await owner(id);
  if ("error" in r) {
    return NextResponse.json({ error: r.error }, { status: r.status });
  }
  return NextResponse.json({
    id,
    scheda: r.data.scheda,
    thumb: r.data.thumb ?? "",
    createdAt: r.data.createdAt ?? 0,
  });
}

// Elimina un'analisi dalla cronologia.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const r = await owner(id);
  if ("error" in r) {
    return NextResponse.json({ error: r.error }, { status: r.status });
  }
  await r.doc.ref.delete();
  return NextResponse.json({ ok: true });
}
