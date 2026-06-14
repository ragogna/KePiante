// Versione visibile dell'app e storico modifiche (log).
// Aggiorna VERSION e aggiungi una voce in cima a CHANGELOG ad ogni rilascio.

export const VERSION = "0.4.0";

export type VoceLog = {
  versione: string;
  data: string; // YYYY-MM-DD
  novita: string[]; // nuove funzioni integrate
  fix: string[]; // correzioni di bug
};

export const CHANGELOG: VoceLog[] = [
  {
    versione: "0.4.0",
    data: "2026-06-14",
    novita: [
      "Accesso sicuro con account Google",
      "Allowlist: solo le email autorizzate dal proprietario possono entrare",
      "Logout dall'header",
    ],
    fix: [],
  },
  {
    versione: "0.3.0",
    data: "2026-06-14",
    novita: [
      "Nuovo tema: sfondi verde pastello e testi verde scuro",
      "Auto-deploy: ogni push su GitHub aggiorna la produzione",
    ],
    fix: [],
  },
  {
    versione: "0.2.0",
    data: "2026-06-14",
    novita: [
      "Pagina Log con correzioni bug e novità integrate",
      "Manuale d'uso dell'app",
      "App installabile (PWA) con icona a foglia",
      "Versione visibile nell'header",
      "Logo personalizzato nell'header",
    ],
    fix: [
      "Motore AI passato a Google Gemini (free tier, nessuna carta richiesta)",
      "Contrasti dei testi migliorati per leggibilità",
      "Nome corretto in KePiante",
    ],
  },
  {
    versione: "0.1.0",
    data: "2026-06-14",
    novita: [
      "Identificazione pianta da 1-5 foto (camera o galleria)",
      "Scheda completa: specie, cure, tossicità, curiosità",
      "Diagnosi dello stato attuale con problemi e rimedi",
      "Promemoria cure salvati nel browser con notifiche locali",
    ],
    fix: [],
  },
];
