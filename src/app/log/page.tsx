import { CHANGELOG, VERSION } from "@/lib/changelog";
import { Sparkles, Bug } from "lucide-react";

export const metadata = { title: "Log — KePiante" };

export default function LogPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Log delle modifiche</h1>
        <p className="text-stone-700">
          Versione attuale: <strong>v{VERSION}</strong>
        </p>
      </header>

      <ol className="space-y-5">
        {CHANGELOG.map((v) => (
          <li
            key={v.versione}
            className="rounded-2xl border border-stone-200 bg-white p-4"
          >
            <div className="mb-3 flex items-baseline gap-2">
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-sm font-semibold text-white">
                v{v.versione}
              </span>
              <span className="text-sm text-stone-600">{v.data}</span>
            </div>

            {v.novita.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <Sparkles size={15} /> Novità integrate
                </p>
                <ul className="ml-6 list-disc space-y-1 text-sm text-stone-800">
                  {v.novita.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            {v.fix.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <Bug size={15} /> Correzioni di bug
                </p>
                <ul className="ml-6 list-disc space-y-1 text-sm text-stone-800">
                  {v.fix.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
