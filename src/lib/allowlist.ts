// Allowlist statica (edge-safe, niente Firebase). Default + env ALLOWED_EMAILS.
// La parte dinamica gestibile da admin sta in allowlist-db.ts (Node/Firestore).

const DEFAULT_ALLOWED = [
  "f.ragogna@gmail.com",
  "mz.bortolin@gmail.com",
  "ricky.ragogna@gmail.com",
  "zoe.ragogna@gmail.com",
  "miriam.ragogna@gmail.com",
  "gianfranco.ragogna@gmail.com",
];

// Proprietario che può gestire l'allowlist (override con OWNER_EMAIL).
export function ownerEmail(): string {
  return (process.env.OWNER_EMAIL ?? "f.ragogna@gmail.com").toLowerCase();
}

export function isOwner(email?: string | null): boolean {
  return !!email && email.toLowerCase() === ownerEmail();
}

export function emailStatiche(): string[] {
  const fromEnv = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWED.map((e) => e.toLowerCase()), ...fromEnv])];
}

// Controllo sincrono (solo statico). Per quello completo usa isAllowed in allowlist-db.
export function isAllowedStatic(email?: string | null): boolean {
  if (!email) return false;
  return emailStatiche().includes(email.toLowerCase());
}
