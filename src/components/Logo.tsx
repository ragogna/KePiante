import { Leaf } from "lucide-react";
import { VERSION } from "@/lib/changelog";

// Logo header: icona a foglia + nome + versione sotto, in piccolo.
export default function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold text-emerald-950">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
        <Leaf size={20} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base">
          Ke<span className="text-emerald-700">Piante</span>
        </span>
        <span className="text-[11px] font-medium text-emerald-800">
          v {VERSION}
        </span>
      </span>
    </span>
  );
}
