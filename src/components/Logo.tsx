"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { VERSION } from "@/lib/changelog";

// Mostra il logo personalizzato dell'utente (public/logo.png, es. il tuo Tux).
// Se il file manca, ripiega sull'icona a foglia. Versione sempre visibile.
export default function Logo() {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <span className="flex items-center gap-2 font-semibold">
      {logoOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-contain"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white">
          <Leaf size={18} />
        </span>
      )}
      <span>
        Ke<span className="text-emerald-700">Piante</span>
      </span>
      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
        v{VERSION}
      </span>
    </span>
  );
}
