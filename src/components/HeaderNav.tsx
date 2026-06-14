"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  Clock,
  HelpCircle,
  BookOpen,
  ScrollText,
} from "lucide-react";

const iconBtn =
  "grid h-9 w-9 place-items-center rounded-full text-emerald-900 transition hover:bg-emerald-300/60";

export default function HeaderNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav className="flex items-center gap-1">
      <Link href="/" className={iconBtn} title="Identifica" aria-label="Identifica">
        <Search size={20} />
      </Link>
      <Link
        href="/promemoria"
        className={iconBtn}
        title="Promemoria"
        aria-label="Promemoria"
      >
        <CalendarDays size={20} />
      </Link>
      <Link
        href="/cronologia"
        className={iconBtn}
        title="Cronologia"
        aria-label="Cronologia"
      >
        <Clock size={20} />
      </Link>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={iconBtn}
          title="Aiuto"
          aria-label="Aiuto"
          aria-expanded={open}
        >
          <HelpCircle size={20} />
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-44 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 shadow-lg">
            <Link
              href="/manuale"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-900 hover:bg-emerald-100"
            >
              <BookOpen size={16} /> Manuale
            </Link>
            <Link
              href="/log"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-900 hover:bg-emerald-100"
            >
              <ScrollText size={16} /> Log
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
