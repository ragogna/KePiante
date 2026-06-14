import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAllowed } from "@/lib/allowlist-db";
import { db, pushServerConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";

// Salva (o aggiorna) il token push del dispositivo e i promemoria dell'utente.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !(await isAllowed(session.user.email))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  if (!pushServerConfigured()) {
    return NextResponse.json(
      { error: "Push non configurato sul server" },
      { status: 503 },
    );
  }

  let token = "";
  let reminders: unknown[] = [];
  try {
    const body = await req.json();
    token = String(body.token ?? "");
    reminders = Array.isArray(body.reminders) ? body.reminders : [];
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: "Token mancante" }, { status: 400 });
  }

  await db()
    .collection("pushSubs")
    .doc(token)
    .set({
      email: session.user.email,
      token,
      reminders,
      updatedAt: Date.now(),
    });

  return NextResponse.json({ ok: true });
}
