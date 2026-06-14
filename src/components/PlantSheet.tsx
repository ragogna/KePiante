"use client";

import { useState } from "react";
import type { SchedaPianta } from "@/lib/schema";
import {
  aggiungiPromemoria,
  chiediPermessoNotifiche,
} from "@/lib/reminders";
import {
  Sun,
  Droplets,
  Wind,
  Thermometer,
  Sprout,
  FlaskConical,
  Scissors,
  Replace,
  AlertTriangle,
  BellRing,
  Check,
  Skull,
} from "lucide-react";

const statoColore: Record<string, string> = {
  ottimo: "bg-emerald-100 text-emerald-800",
  buono: "bg-lime-100 text-lime-800",
  sofferente: "bg-amber-100 text-amber-800",
  critico: "bg-red-100 text-red-800",
  non_determinabile: "bg-stone-100 text-stone-600",
};

const gravitaColore: Record<string, string> = {
  lieve: "border-amber-200 bg-amber-50",
  moderata: "border-orange-300 bg-orange-50",
  grave: "border-red-300 bg-red-50",
};

function Cura({
  icon,
  titolo,
  testo,
}: {
  icon: React.ReactNode;
  titolo: string;
  testo: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3">
      <span className="mt-0.5 text-emerald-600">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">
          {titolo}
        </p>
        <p className="text-sm text-stone-800">{testo}</p>
      </div>
    </div>
  );
}

export default function PlantSheet({
  scheda,
  foto,
}: {
  scheda: SchedaPianta;
  foto?: string;
}) {
  const [salvato, setSalvato] = useState(false);

  if (!scheda.identificata) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-2 text-amber-500" />
        <p className="font-medium text-amber-800">
          Non riesco a riconoscere una pianta in queste foto.
        </p>
        <p className="mt-1 text-sm text-amber-700">
          Prova con scatti piu nitidi, ben illuminati e ravvicinati su foglie e
          portamento.
        </p>
      </div>
    );
  }

  async function attivaPromemoria() {
    await chiediPermessoNotifiche();
    const n = aggiungiPromemoria(
      scheda.nomeComune,
      scheda.nomeScientifico,
      scheda.pianoCure,
      foto,
    );
    if (n > 0) setSalvato(true);
  }

  return (
    <article className="space-y-6">
      {/* Intestazione */}
      <header className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto}
            alt={scheda.nomeComune}
            className="h-56 w-full object-cover"
          />
        )}
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold">{scheda.nomeComune}</h2>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                statoColore[scheda.statoSalute]
              }`}
            >
              {scheda.statoSalute.replace("_", " ")}
            </span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
              confidenza {scheda.confidenza}
            </span>
          </div>
          <p className="italic text-stone-700">
            {scheda.nomeScientifico} · {scheda.famiglia}
          </p>
          {scheda.nomiAlternativi.length > 0 && (
            <p className="text-sm text-stone-700">
              Anche detta: {scheda.nomiAlternativi.join(", ")}
            </p>
          )}
          <p className="text-sm text-stone-700">{scheda.descrizione}</p>
        </div>
      </header>

      {/* Diagnosi stato attuale */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4">
        <h3 className="mb-2 font-semibold">Diagnosi dello stato attuale</h3>
        <p className="text-sm text-stone-700">{scheda.diagnosi}</p>
        {scheda.problemi.length > 0 && (
          <ul className="mt-3 space-y-2">
            {scheda.problemi.map((p, i) => (
              <li
                key={i}
                className={`rounded-xl border p-3 ${gravitaColore[p.gravita]}`}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <AlertTriangle size={15} /> {p.titolo}
                  <span className="ml-auto text-xs font-normal uppercase text-stone-700">
                    {p.gravita}
                  </span>
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  <strong>Causa:</strong> {p.causaProbabile}
                </p>
                <p className="mt-1 text-sm text-stone-700">
                  <strong>Rimedio:</strong> {p.rimedio}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Cure */}
      <section>
        <h3 className="mb-2 font-semibold">Come prendersene cura</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Cura icon={<Sun size={18} />} titolo="Luce" testo={scheda.cure.luce} />
          <Cura
            icon={<Droplets size={18} />}
            titolo="Acqua"
            testo={scheda.cure.acqua}
          />
          <Cura
            icon={<Wind size={18} />}
            titolo="Umidita"
            testo={scheda.cure.umidita}
          />
          <Cura
            icon={<Thermometer size={18} />}
            titolo="Temperatura"
            testo={scheda.cure.temperatura}
          />
          <Cura
            icon={<Sprout size={18} />}
            titolo="Suolo"
            testo={scheda.cure.suolo}
          />
          <Cura
            icon={<FlaskConical size={18} />}
            titolo="Concimazione"
            testo={scheda.cure.concimazione}
          />
          <Cura
            icon={<Replace size={18} />}
            titolo="Rinvaso"
            testo={scheda.cure.rinvaso}
          />
          <Cura
            icon={<Scissors size={18} />}
            titolo="Potatura"
            testo={scheda.cure.potatura}
          />
        </div>
      </section>

      {/* Tossicita + stagione + curiosita */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <h4 className="flex items-center gap-2 font-semibold">
            <Skull size={16} /> Tossicita
          </h4>
          <p className="mt-1 text-sm text-stone-700">{scheda.tossicita}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <h4 className="font-semibold">Consigli stagionali</h4>
          <p className="mt-1 text-sm text-stone-700">
            {scheda.consigliStagionali}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:col-span-2">
          <h4 className="font-semibold">Lo sapevi?</h4>
          <p className="mt-1 text-sm text-stone-700">{scheda.curiosita}</p>
        </div>
      </section>

      {/* Promemoria cure */}
      {scheda.pianoCure.length > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="font-semibold">Promemoria cure</h3>
          <ul className="mt-2 space-y-1 text-sm text-stone-700">
            {scheda.pianoCure.map((c, i) => (
              <li key={i}>
                <strong>{c.attivita}</strong> — ogni {c.ogniGiorni} giorni ·{" "}
                {c.dettaglio}
              </li>
            ))}
          </ul>
          <button
            onClick={attivaPromemoria}
            disabled={salvato}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:bg-emerald-400"
          >
            {salvato ? <Check size={16} /> : <BellRing size={16} />}
            {salvato ? "Promemoria attivati" : "Attiva promemoria cure"}
          </button>
          <p className="mt-2 text-xs text-emerald-800">
            Salvati in questo browser. Le notifiche arrivano quando apri o tieni
            aperta l&apos;app.
          </p>
        </section>
      )}
    </article>
  );
}
