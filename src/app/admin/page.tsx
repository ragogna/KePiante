"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Trash2, Loader2, ShieldCheck, Lock, Users } from "lucide-react";

type Lista = { statiche: string[]; dinamiche: string[] };

export default function AdminPage() {
  const [lista, setLista] = useState<Lista | null>(null);
  const [vietato, setVietato] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function carica() {
    const res = await fetch("/api/admin/allowlist");
    if (res.status === 403) {
      setVietato(true);
      return;
    }
    setLista(await res.json());
  }

  useEffect(() => {
    carica();
  }, []);

  async function aggiungi(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/allowlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await res.json();
    if (!res.ok) setMsg(d.error ?? "Errore");
    else {
      setLista(d);
      setEmail("");
    }
    setBusy(false);
  }

  async function rimuovi(em: string) {
    const res = await fetch("/api/admin/allowlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: em }),
    });
    if (res.ok) setLista(await res.json());
  }

  if (vietato) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        <Lock className="mx-auto mb-2" />
        Area riservata al proprietario.
      </div>
    );
  }

  if (!lista) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-emerald-700">
        <Loader2 className="animate-spin" /> Carico…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck className="text-emerald-600" /> Gestione accessi
        </h1>
        <p className="text-sm text-emerald-800">
          Decidi chi può usare KePiante.
        </p>
      </div>

      <Link
        href="/admin/cronologia"
        className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
      >
        <Users size={18} className="text-emerald-600" /> Vedi le analisi di tutti
        gli utenti
      </Link>

      <form
        onSubmit={aggiungi}
        className="flex gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@gmail.com"
          className="flex-1 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-emerald-400"
        >
          <UserPlus size={16} /> Aggiungi
        </button>
      </form>
      {msg && <p className="text-sm text-amber-700">{msg}</p>}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Aggiunte da te ({lista.dinamiche.length})
        </h2>
        {lista.dinamiche.length === 0 ? (
          <p className="text-sm text-emerald-700">Nessuna email aggiunta.</p>
        ) : (
          <ul className="space-y-2">
            {lista.dinamiche.map((em) => (
              <li
                key={em}
                className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm"
              >
                <span className="truncate text-emerald-950">{em}</span>
                <button
                  onClick={() => rimuovi(em)}
                  title="Rimuovi"
                  className="grid h-8 w-8 place-items-center rounded-full text-emerald-700 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Predefinite ({lista.statiche.length})
        </h2>
        <ul className="space-y-1">
          {lista.statiche.map((em) => (
            <li
              key={em}
              className="truncate rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-900"
            >
              {em}
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-emerald-700">
          Predefinite fisse (nel codice/env), non rimovibili da qui.
        </p>
      </section>
    </div>
  );
}
