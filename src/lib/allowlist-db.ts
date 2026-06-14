import "server-only";
import { db, pushServerConfigured } from "@/lib/firebase-admin";
import { emailStatiche, isAllowedStatic } from "@/lib/allowlist";

// Allowlist dinamica salvata in Firestore: config/allowlist { emails: [] }.
const REF = () => db().collection("config").doc("allowlist");

export async function emailDinamiche(): Promise<string[]> {
  if (!pushServerConfigured()) return [];
  try {
    const doc = await REF().get();
    const e = (doc.data()?.emails ?? []) as string[];
    return e.map((x) => x.toLowerCase());
  } catch {
    return [];
  }
}

// Controllo completo: statico (default+env) OPPURE dinamico (Firestore).
export async function isAllowed(email?: string | null): Promise<boolean> {
  if (!email) return false;
  if (isAllowedStatic(email)) return true;
  return (await emailDinamiche()).includes(email.toLowerCase());
}

// Elenco unito per la pagina admin: statiche (non rimovibili) + dinamiche.
export async function listaCompleta(): Promise<{
  statiche: string[];
  dinamiche: string[];
}> {
  return { statiche: emailStatiche(), dinamiche: await emailDinamiche() };
}

export async function aggiungiEmail(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) throw new Error("Email non valida");
  const cur = await emailDinamiche();
  if (cur.includes(e) || isAllowedStatic(e)) return;
  await REF().set({ emails: [...cur, e] }, { merge: true });
}

export async function rimuoviEmail(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const cur = await emailDinamiche();
  await REF().set({ emails: cur.filter((x) => x !== e) }, { merge: true });
}
