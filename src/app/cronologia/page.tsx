"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Leaf, Loader2 } from "lucide-react";

type Item = {
  id: string;
  nomeComune: string;
  statoSalute: string;
  thumb: string;
  createdAt: number;
};

const statoColore: Record<string, string> = {
  ottimo: "bg-emerald-100 text-emerald-800",
  buono: "bg-lime-100 text-lime-800",
  sofferente: "bg-amber-100 text-amber-800",
  critico: "bg-red-100 text-red-800",
  non_determinabile: "bg-emerald-100 text-emerald-700",
};

function dataIt(ts: number) {
  return new Date(ts).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CronologiaPage() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    fetch("/api/analisi")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-emerald-700">
        <Loader2 className="animate-spin" /> Carico la cronologia…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <Clock className="mx-auto mb-3 text-emerald-600" />
        <p className="font-medium">Nessuna analisi salvata.</p>
        <p className="mt-1 text-sm text-emerald-700">
          Le piante che identifichi finiscono qui.
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
      <h1 className="text-2xl font-bold">Cronologia analisi</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.id}>
            <Link
              href={`/cronologia/${it.id}`}
              className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 transition hover:border-emerald-300"
            >
              {it.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.thumb}
                  alt={it.nomeComune}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Leaf />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-emerald-950">
                  {it.nomeComune}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    statoColore[it.statoSalute] ?? statoColore.non_determinabile
                  }`}
                >
                  {it.statoSalute.replace("_", " ")}
                </span>
                <p className="mt-1 text-xs text-emerald-700">
                  {dataIt(it.createdAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
