import {
  Camera,
  Sparkles,
  Stethoscope,
  BellRing,
  Download,
  ShieldCheck,
} from "lucide-react";

export const metadata = { title: "Manuale — KePiante" };

function Sezione({
  icon,
  titolo,
  children,
}: {
  icon: React.ReactNode;
  titolo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <h2 className="mb-2 flex items-center gap-2 font-semibold">
        <span className="text-emerald-600">{icon}</span>
        {titolo}
      </h2>
      <div className="space-y-2 text-sm text-emerald-900">{children}</div>
    </section>
  );
}

export default function ManualePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Manuale d&apos;uso</h1>
        <p className="text-emerald-800">
          Come usare KePiante per identificare e curare le tue piante.
        </p>
      </header>

      <Sezione icon={<Camera size={18} />} titolo="1. Scatta o carica le foto">
        <p>
          Nella schermata <strong>Identifica</strong> tocca <em>Scatta foto</em>{" "}
          per usare la fotocamera, oppure <em>Dalla galleria</em> per scegliere
          immagini esistenti. Puoi aggiungere fino a <strong>5 foto</strong>{" "}
          della stessa pianta.
        </p>
        <p className="text-emerald-700">
          Consiglio: inquadra foglie, portamento e, se possibile, terriccio e
          vaso. Foto nitide e ben illuminate = identificazione migliore.
        </p>
      </Sezione>

      <Sezione icon={<Sparkles size={18} />} titolo="2. Identifica la pianta">
        <p>
          Aggiungi note opzionali (da quanto la hai, sintomi, interno/esterno) e
          tocca <strong>Identifica pianta</strong>. In pochi secondi ricevi la
          scheda: nome comune e scientifico, famiglia, descrizione, tossicità
          per persone e animali, e una curiosità.
        </p>
      </Sezione>

      <Sezione
        icon={<Stethoscope size={18} />}
        titolo="3. Leggi la diagnosi e le cure"
      >
        <p>
          La sezione <strong>Diagnosi dello stato attuale</strong> segnala
          problemi visibili (ingiallimenti, macchie, parassiti…) con causa e
          rimedio. Più sotto trovi le cure complete: luce, acqua, umidità,
          temperatura, suolo, concimazione, rinvaso e potatura.
        </p>
      </Sezione>

      <Sezione icon={<BellRing size={18} />} titolo="4. Attiva i promemoria">
        <p>
          Tocca <strong>Attiva promemoria cure</strong> per salvare le cadenze
          (es. annaffiatura ogni 7 giorni) nella pagina{" "}
          <strong>Promemoria</strong>. Da lì puoi segnare un&apos;attività come{" "}
          <em>fatta</em> (riparte il conteggio) o eliminarla.
        </p>
        <p className="text-emerald-700">
          Le notifiche sono locali e arrivano quando l&apos;app è aperta. I
          promemoria restano salvati in questo browser/dispositivo.
        </p>
      </Sezione>

      <Sezione icon={<Download size={18} />} titolo="5. Installa l'app">
        <p>
          Da telefono puoi installare KePiante come app: nel browser apri il
          menu e scegli <em>Aggiungi a schermata Home</em> /{" "}
          <em>Installa app</em>. L&apos;icona sarà la foglia di KePiante.
        </p>
      </Sezione>

      <Sezione icon={<ShieldCheck size={18} />} titolo="Privacy">
        <p>
          Le foto vengono usate solo per l&apos;identificazione e{" "}
          <strong>non sono salvate sui server</strong>. Nessun account
          richiesto.
        </p>
      </Sezione>
    </div>
  );
}
