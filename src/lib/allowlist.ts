// Elenco email autorizzate a usare l'app.
// Default sotto; il proprietario può sovrascrivere/estendere con la env
// ALLOWED_EMAILS (lista separata da virgole) senza toccare il codice.

const DEFAULT_ALLOWED = [
  "f.ragogna@gmail.com",
  "mz.bortolin@gmail.com",
  "ricky.ragogna@gmail.com",
  "zoe.ragogna@gmail.com",
  "miriam.ragogna@gmail.com",
  "gianfranco.ragogna@gmail.com",
];

export function emailAutorizzate(): string[] {
  const fromEnv = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const set = new Set([
    ...DEFAULT_ALLOWED.map((e) => e.toLowerCase()),
    ...fromEnv,
  ]);
  return [...set];
}

export function isAllowed(email?: string | null): boolean {
  if (!email) return false;
  return emailAutorizzate().includes(email.toLowerCase());
}
