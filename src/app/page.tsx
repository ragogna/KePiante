"use client";

import { useEffect, useRef, useState } from "react";
import { fileADataUrl } from "@/lib/image";
import { avviaScheduler } from "@/lib/reminders";
import type { SchedaPianta } from "@/lib/schema";
import PlantSheet from "@/components/PlantSheet";
import { Camera, ImagePlus, X, Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [foto, setFoto] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");
  const [scheda, setScheda] = useState<SchedaPianta | null>(null);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleriaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    avviaScheduler();
  }, []);

  async function aggiungiFile(files: FileList | null) {
    if (!files) return;
    const nuove: string[] = [];
    for (const f of Array.from(files).slice(0, 5)) {
      try {
        nuove.push(await fileADataUrl(f));
      } catch {
        /* salta file non immagine */
      }
    }
    setFoto((prev) => [...prev, ...nuove].slice(0, 5));
  }

  function rimuovi(i: number) {
    setFoto((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function identifica() {
    if (foto.length === 0) return;
    setLoading(true);
    setErrore("");
    setScheda(null);
    try {
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: foto, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore sconosciuto");
      setScheda(data as SchedaPianta);
    } catch (e) {
      setErrore(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }

  function ricomincia() {
    setScheda(null);
    setFoto([]);
    setNote("");
    setErrore("");
  }

  return (
    <div className="space-y-6">
      {!scheda && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Che pianta è?</h1>
            <p className="mt-1 text-stone-700">
              Scatta o carica fino a 5 foto: ricevi la scheda completa, la
              diagnosi dello stato attuale e i promemoria per le cure.
            </p>
          </div>

          {/* Input nascosti */}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => aggiungiFile(e.target.files)}
          />
          <input
            ref={galleriaRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => aggiungiFile(e.target.files)}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <Camera className="text-emerald-600" />
              <span className="text-sm font-medium">Scatta foto</span>
            </button>
            <button
              onClick={() => galleriaRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <ImagePlus className="text-emerald-600" />
              <span className="text-sm font-medium">Dalla galleria</span>
            </button>
          </div>

          {/* Anteprime */}
          {foto.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {foto.map((src, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`foto ${i + 1}`}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                  <button
                    onClick={() => rimuovi(i)}
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-stone-800 text-white"
                    aria-label="Rimuovi"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {foto.length > 0 && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note opzionali: da quanto la hai, sintomi, ambiente (interno/esterno)…"
              className="w-full resize-none rounded-xl border border-stone-200 bg-white p-3 text-sm outline-none focus:border-emerald-400"
              rows={2}
            />
          )}

          {errore && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {errore}
            </p>
          )}

          <button
            onClick={identifica}
            disabled={foto.length === 0 || loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Analizzo le foto…
              </>
            ) : (
              <>
                <Sparkles size={18} /> Identifica pianta
              </>
            )}
          </button>
        </>
      )}

      {scheda && (
        <>
          <PlantSheet scheda={scheda} foto={foto[0]} />
          <button
            onClick={ricomincia}
            className="w-full rounded-full border border-stone-300 bg-white px-6 py-3 font-medium transition hover:bg-stone-100"
          >
            Identifica un&apos;altra pianta
          </button>
        </>
      )}
    </div>
  );
}
