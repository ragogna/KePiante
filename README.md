# 🌱 KèPiante

App tipo *PictureThis*: scatti o carichi foto di una pianta → ricevi **scheda completa**, **diagnosi dello stato attuale** e **promemoria cure**. Tutto in italiano. Deploy su Vercel.

## Come funziona

1. L'utente scatta o carica fino a 5 foto (compresse lato browser).
2. `POST /api/identify` invia le foto a un modello vision tramite **Vercel AI Gateway**.
3. Il modello restituisce una scheda strutturata (Zod) con identificazione, cure e diagnosi.
4. L'utente può attivare i **promemoria cure**, salvati nel browser (localStorage) con notifiche locali.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind
- AI SDK v6 (`generateObject`) via **Vercel AI Gateway** (modello Claude di default)
- Nessun account, nessun DB: app stateless. Le foto **non** vengono salvate sui server.

## Sviluppo locale

```bash
npm install
cp .env.example .env.local   # poi inserisci AI_GATEWAY_API_KEY
npm run dev
```

`AI_GATEWAY_API_KEY` si crea dalla dashboard Vercel → **AI Gateway**. In alternativa, dopo aver linkato il progetto: `vercel env pull`.

Modello configurabile con `AI_MODEL` (default `anthropic/claude-sonnet-4.5`).

## Deploy su Vercel

```bash
npm i -g vercel       # se non installata
vercel link           # collega/crea il progetto
vercel env add AI_GATEWAY_API_KEY   # aggiungi la chiave (Production + Preview)
vercel deploy --prod
```

Oppure: push su GitHub e importa il repo su vercel.com (imposta `AI_GATEWAY_API_KEY` nelle Environment Variables).

## Limiti noti & evoluzioni

- **Notifiche**: locali (Web Notifications), scattano solo con app aperta. Per push reali ad app chiusa serve un mini-DB (es. Neon) + Web Push subscription + **Vercel Cron**.
- **Account/storico collezione**: aggiungibili con Clerk (auth) + Neon Postgres + Vercel Blob per le foto.
- **Accuratezza**: per ID botanico certificato si può affiancare un'API dedicata (Plant.id / PlantNet) e usare il modello solo per la scheda cure.
