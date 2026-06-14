"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { VERSION } from "@/lib/changelog";

// Logo header: icona a foglia (fallback a public/logo.png se presente),
// nome KePiante e, subito sotto, la versione in carattere più piccolo.
export default function Logo() {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <span className="flex items-center gap-2 font-semibold">
      {logoOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="Logo"
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-contain"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white">
          <Leaf size={20} />
        </span>
      )}
      <span className="flex flex-col leading-tight text-emerald-950">
        <span className="text-base">
          Ke<span className="text-emerald-800">Piante</span>
        </span>
        <span className="text-[11px] font-medium text-emerald-800">
          v {VERSION}
        </span>
      </span>
    </span>
  );
}
