import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Protegge tutte le pagine e le API tranne login, asset statici e callback auth.
export default auth((req) => {
  if (!req.auth) {
    const url = new URL("/accesso", req.nextUrl.origin);
    // 401 per le API, redirect per le pagine
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 401 });
    }
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Tutto tranne: api/auth, pagina accesso, asset, file pubblici
    "/((?!api/auth|accesso|_next/static|_next/image|favicon|icon|manifest|.*\\.(?:png|svg|webmanifest|ico|jpg|jpeg)).*)",
  ],
};
