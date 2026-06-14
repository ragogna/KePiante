"use client";

import { useEffect, useState } from "react";
import {
  caricaPromemoria,
  rimuoviPromemoria,
  segnaFatto,
  chiediPermessoNotifiche,
  avviaScheduler,
  type Promemoria,
} from "@/lib/reminders";
import { Check, Trash2, BellRing, CalendarClock } from "lucide-react";
import Link from "next/link";
import PushButton from "@/components/PushButton";

function quando(ts: number): { testo: string; scaduto: boolean } {
  const giorni = Math.round((ts - Date.now()) / 86_400_000);
  if (giorni < 0) return { testo: `scaduto da ${-giorni}g`, scaduto: true };
  if (giorni === 0) return { testo: "oggi", scaduto: true };
  if (giorni === 1) return { testo: "domani", scaduto: false };
  return { testo: `tra ${giorni}g`, scaduto: false };
}

export default function PromemoriaPage() {
  const [list, setList] = useState<Promemoria[]>([]);
  const [permesso, setPermesso] = useState(true);

  function ricarica() {
    setList(
      caricaPromemoria().sort((a, b) => a.prossima - b.prossima),
    );
  }

  useEffect(() => {
    ricarica();
    avviaScheduler();
    if (typeof Notification !== "undefined")
      setPermesso(Notification.permission === "granted");
  }, []);

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <CalendarClock className="mx-auto mb-3 text-emerald-600" />
        <p className="font-medium">Nessun promemoria attivo.</p>
        <p className="mt-1 text-sm text-emerald-700">
          Identifica una pianta e attiva i promemoria delle cure.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Identifica una pianta
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">I tuoi promemoria</h1>
        {!permesso && (
          <button
            onClick={async () => setPermesso(await chiediPermessoNotifiche())}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
          >
            <BellRing size={14} /> Attiva notifiche
          </button>
        )}
      </div>

      <PushButton />

      <ul className="space-y-3">
        {list.map((p) => {
          const q = quando(p.prossima);
          return (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3"
            >
              {p.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.foto}
                  alt={p.pianta}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                  🌱
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.pianta}</p>
                <p className="text-sm text-emerald-700">
                  {p.attivita} · ogni {p.ogniGiorni}g
                </p>
                <span
                  className={`text-xs font-medium ${
                    q.scaduto ? "text-amber-600" : "text-emerald-700"
                  }`}
                >
                  {q.testo}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    segnaFatto(p.id);
                    ricarica();
                  }}
                  title="Fatto"
                  className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    rimuoviPromemoria(p.id);
                    ricarica();
                  }}
                  title="Elimina"
                  className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-xs text-emerald-700">
        Promemoria salvati in questo browser. Le notifiche arrivano quando
        l&apos;app è aperta.
      </p>
    </div>
  );
}
