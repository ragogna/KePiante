import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { schedaPiantaSchema } from "@/lib/schema";
import { auth } from "@/auth";
import { isAllowed } from "@/lib/allowlist";

// Fluid Compute: lasciamo respiro alla chiamata multimodale
export const maxDuration = 120;

// Google Gemini (free tier, vision). Override con AI_MODEL se serve.
// Autentica con GOOGLE_GENERATIVE_AI_API_KEY (da aistudio.google.com).
const MODEL = google(process.env.AI_MODEL ?? "gemini-2.5-flash");

const SYSTEM = `Sei un botanico e agronomo esperto di piante da interno ed esterno.
Ricevi una o piu foto della STESSA pianta scattate da un utente.
Identifica la specie e compila una scheda completa in ITALIANO.
Analizza con attenzione foglie, colore, portamento, terriccio e vaso per dedurre lo stato di salute attuale e i problemi reali visibili (ingiallimenti, macchie, parassiti, marciumi, stress idrico).
Se nelle foto non c'e una pianta riconoscibile, imposta identificata=false e lascia gli altri campi con valori generici brevi.
Sii concreto e pratico: chi legge vuole sapere ESATTAMENTE cosa fare oggi.
Per pianoCure indica cadenze realistiche per il periodo attuale.
PRIVILEGIA rimedi e cure con prodotti comuni di casa (bicarbonato, aceto, succo di limone, fondi di caffè, sapone molle/di Marsiglia, olio di neem o vegetale, cannella, gusci d'uovo, acqua di cottura non salata, ortica/macerati): suggeriscili nei campi rimedio, concimazione e antiparassitari quando ha senso, con dosi pratiche.
Compila rimediCasalinghi con 2-4 voci davvero pertinenti allo stato della pianta. Resta sicuro: niente misture pericolose o tossiche, e segnala se una pianta è sensibile a un rimedio.`;

export async function POST(req: Request) {
  // Solo utenti autenticati e autorizzati.
  const session = await auth();
  if (!session?.user || !isAllowed(session.user.email)) {
    return NextResponse.json(
      { error: "Accesso non autorizzato" },
      { status: 401 },
    );
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Manca GOOGLE_GENERATIVE_AI_API_KEY. Crea una key gratis su aistudio.google.com e aggiungila alle env.",
      },
      { status: 500 },
    );
  }

  let images: string[] = [];
  let note = "";
  try {
    const body = await req.json();
    images = Array.isArray(body.images) ? body.images : [];
    note = typeof body.note === "string" ? body.note : "";
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  if (images.length === 0) {
    return NextResponse.json(
      { error: "Nessuna foto ricevuta" },
      { status: 400 },
    );
  }
  if (images.length > 5) images = images.slice(0, 5);

  try {
    const { object } = await generateObject({
      model: MODEL,
      schema: schedaPiantaSchema,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Identifica questa pianta e compila la scheda completa con diagnosi dello stato attuale." +
                (note ? ` Note dall'utente: ${note}` : ""),
            },
            ...images.map((img) => ({
              type: "image" as const,
              image: img,
            })),
          ],
        },
      ],
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error("identify error", err);
    return NextResponse.json(
      { error: "Identificazione fallita. Riprova con foto piu nitide." },
      { status: 502 },
    );
  }
}
