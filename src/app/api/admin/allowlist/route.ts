import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isOwner } from "@/lib/allowlist";
import {
  listaCompleta,
  aggiungiEmail,
  rimuoviEmail,
} from "@/lib/allowlist-db";

export const runtime = "nodejs";

async function guard() {
  const session = await auth();
  return isOwner(session?.user?.email);
}

export async function GET() {
  if (!(await guard()))
    return NextResponse.json({ error: "Solo proprietario" }, { status: 403 });
  return NextResponse.json(await listaCompleta());
}

export async function POST(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "Solo proprietario" }, { status: 403 });
  const { email } = await req.json().catch(() => ({}));
  try {
    await aggiungiEmail(String(email ?? ""));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore" },
      { status: 400 },
    );
  }
  return NextResponse.json(await listaCompleta());
}

export async function DELETE(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "Solo proprietario" }, { status: 403 });
  const { email } = await req.json().catch(() => ({}));
  await rimuoviEmail(String(email ?? ""));
  return NextResponse.json(await listaCompleta());
}
