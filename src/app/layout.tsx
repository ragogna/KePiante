import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Logo from "@/components/Logo";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KePiante — Identifica e cura le tue piante",
  description:
    "Scatta o carica una foto: identifica la pianta, ricevi la scheda completa, la diagnosi dello stato attuale e i promemoria per le cure.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "KePiante", statusBarStyle: "default" },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-emerald-100 text-emerald-950">
        <header className="sticky top-0 z-10 border-b border-emerald-300 bg-emerald-200">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/">
              <Logo />
            </Link>
            <nav className="flex gap-3 text-sm font-medium text-emerald-950 sm:gap-4">
              <Link href="/" className="hover:text-emerald-700">
                Identifica
              </Link>
              <Link href="/promemoria" className="hover:text-emerald-700">
                Promemoria
              </Link>
              <Link href="/manuale" className="hover:text-emerald-700">
                Manuale
              </Link>
              <Link href="/log" className="hover:text-emerald-700">
                Log
              </Link>
              {session?.user && (
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/accesso" });
                  }}
                >
                  <button
                    type="submit"
                    title={`Esci (${session.user.email})`}
                    className="flex items-center gap-1 text-emerald-950 hover:text-emerald-700"
                  >
                    <LogOut size={15} /> Esci
                  </button>
                </form>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          {children}
        </main>
        <footer className="space-y-2 border-t border-emerald-200 py-4 text-center text-xs text-emerald-800">
          <p>
            KePiante · identificazione e cura piante · foto non salvate sui
            server
          </p>
          <p className="flex items-center justify-center gap-2 font-medium">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tux_k3kk0.png"
              alt="Tux K3kk0"
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
            Sviluppato da K3kk0
          </p>
        </footer>
      </body>
    </html>
  );
}
