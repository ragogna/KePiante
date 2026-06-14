"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, Users, Leaf, ArrowLeft } from "lucide-react";

type Item = {
  id: string;
  email: string;
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminCronologia() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [vietato, setVietato] = useState(false);

  useEffect(() => {
    fetch("/api/admin/analisi")
      .then((r) => {
        if (r.status === 403) {
          setVietato(true);
          return { items: [] };
        }
        return r.json();
      })
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  if (vietato) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        <Lock className="mx-auto mb-2" /> Area riservata al proprietario.
      </div>
    );
  }
  if (items === null) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-emerald-700">
        <Loader2 className="animate-spin" /> Carico…
      </div>
    );
  }

  // raggruppa per email
  const gruppi = new Map<string, Item[]>();
  for (const it of items) {
    const k = it.email ?? "?";
    (gruppi.get(k) ?? gruppi.set(k, []).get(k)!).push(it);
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-emerald-800 hover:text-emerald-600"
      >
        <ArrowLeft size={16} /> Gestione accessi
      </Link>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Users className="text-emerald-600" /> Analisi di tutti
      </h1>

      {items.length === 0 && (
        <p className="text-sm text-emerald-700">Nessuna analisi salvata.</p>
      )}

      {[...gruppi.entries()].map(([email, list]) => (
        <section key={email}>
          <h2 className="mb-2 text-sm font-semibold text-emerald-800">
            {email} <span className="text-emerald-600">({list.length})</span>
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {list.map((it) => (
              <li key={it.id}>
                <Link
                  href={`/cronologia/${it.id}`}
                  className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-2 transition hover:border-emerald-300"
                >
                  {it.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.thumb}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Leaf size={18} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-emerald-950">
                      {it.nomeComune}
                    </p>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        statoColore[it.statoSalute] ??
                        statoColore.non_determinabile
                      }`}
                    >
                      {it.statoSalute.replace("_", " ")}
                    </span>
                    <p className="text-[11px] text-emerald-700">
                      {dataIt(it.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
