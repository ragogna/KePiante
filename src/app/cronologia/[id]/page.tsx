"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlantSheet from "@/components/PlantSheet";
import type { SchedaPianta } from "@/lib/schema";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";

export default function DettaglioAnalisi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [scheda, setScheda] = useState<SchedaPianta | null>(null);
  const [thumb, setThumb] = useState("");
  const [stato, setStato] = useState<"load" | "ok" | "err">("load");

  useEffect(() => {
    fetch(`/api/analisi/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setScheda(d.scheda);
        setThumb(d.thumb ?? "");
        setStato("ok");
      })
      .catch(() => setStato("err"));
  }, [id]);

  async function elimina() {
    if (!confirm("Eliminare questa analisi dalla cronologia?")) return;
    await fetch(`/api/analisi/${id}`, { method: "DELETE" });
    router.push("/cronologia");
  }

  if (stato === "load") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-emerald-700">
        <Loader2 className="animate-spin" /> Carico…
      </div>
    );
  }
  if (stato === "err" || !scheda) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        Analisi non trovata.
        <div>
          <Link href="/cronologia" className="mt-3 inline-block underline">
            Torna alla cronologia
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/cronologia"
          className="inline-flex items-center gap-1 text-sm text-emerald-800 hover:text-emerald-600"
        >
          <ArrowLeft size={16} /> Cronologia
        </Link>
        <button
          onClick={elimina}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-emerald-800 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 size={15} /> Elimina
        </button>
      </div>
      <PlantSheet scheda={scheda} foto={thumb || undefined} />
    </div>
  );
}
