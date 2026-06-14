import { z } from "zod";

// Livello di confidenza dell'identificazione
export const livelloSchema = z.enum(["alta", "media", "bassa"]);

// Stato di salute rilevato dalla foto
export const statoSaluteSchema = z.enum([
  "ottimo",
  "buono",
  "sofferente",
  "critico",
  "non_determinabile",
]);

// Un singolo problema diagnosticato dalle foto
export const problemaSchema = z.object({
  titolo: z.string().describe("Nome breve del problema, es. 'Foglie ingiallite'"),
  causaProbabile: z.string().describe("Causa piu probabile osservabile dalle foto"),
  gravita: z.enum(["lieve", "moderata", "grave"]),
  rimedio: z.string().describe("Azione concreta e immediata per risolvere"),
});

// Frequenza di una cura ricorrente
export const curaRicorrenteSchema = z.object({
  attivita: z.string().describe("Es. 'Annaffiatura', 'Concimazione', 'Rinvaso'"),
  ogniGiorni: z
    .number()
    .int()
    .positive()
    .describe("Ogni quanti giorni va eseguita in media in questo periodo"),
  dettaglio: z.string().describe("Indicazioni pratiche su come eseguire la cura"),
});

export const schedaPiantaSchema = z.object({
  identificata: z
    .boolean()
    .describe("false se nelle foto non c'e una pianta riconoscibile"),
  nomeComune: z.string().describe("Nome comune italiano della pianta"),
  nomeScientifico: z.string().describe("Nome botanico latino (genere e specie)"),
  famiglia: z.string().describe("Famiglia botanica"),
  nomiAlternativi: z.array(z.string()).describe("Altri nomi comuni noti"),
  confidenza: livelloSchema.describe("Confidenza dell'identificazione"),
  descrizione: z
    .string()
    .describe("2-3 frasi: aspetto, origine e caratteristiche distintive"),
  tossicita: z
    .string()
    .describe("Tossicita per umani e animali domestici (cani/gatti)"),

  statoSalute: statoSaluteSchema.describe("Stato di salute dedotto dalle foto"),
  diagnosi: z
    .string()
    .describe("Sintesi dello stato attuale osservato nelle foto"),
  problemi: z
    .array(problemaSchema)
    .describe("Problemi rilevati; array vuoto se la pianta e sana"),

  cure: z.object({
    luce: z.string().describe("Esposizione luminosa ideale"),
    acqua: z.string().describe("Indicazioni su quantita e frequenza irrigazione"),
    umidita: z.string().describe("Umidita ambientale preferita"),
    temperatura: z.string().describe("Intervallo di temperatura ideale in gradi C"),
    suolo: z.string().describe("Tipo di terriccio e drenaggio consigliati"),
    concimazione: z.string().describe("Tipo e cadenza della concimazione"),
    rinvaso: z.string().describe("Quando e come rinvasare"),
    potatura: z.string().describe("Indicazioni di potatura/pulizia foglie"),
  }),

  // Rimedi fai-da-te con prodotti comuni di casa
  rimediCasalinghi: z
    .array(
      z.object({
        ingrediente: z
          .string()
          .describe("Prodotto comune di casa, es. 'Bicarbonato', 'Fondi di caffè'"),
        uso: z
          .string()
          .describe("Come usarlo per questa pianta, con dosi/frequenza pratiche"),
      }),
    )
    .describe(
      "2-4 rimedi/cure casalinghi pertinenti allo stato attuale della pianta",
    ),

  // Piano cure ricorrenti, usato per i promemoria
  pianoCure: z
    .array(curaRicorrenteSchema)
    .describe("Cure ricorrenti con cadenza in giorni per i promemoria"),

  consigliStagionali: z
    .string()
    .describe("Accorgimenti per la stagione attuale (emisfero nord)"),
  curiosita: z.string().describe("Una curiosita interessante sulla pianta"),
});

export type SchedaPianta = z.infer<typeof schedaPiantaSchema>;
export type CuraRicorrente = z.infer<typeof curaRicorrenteSchema>;
export type Problema = z.infer<typeof problemaSchema>;
