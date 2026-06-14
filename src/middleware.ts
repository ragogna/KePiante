import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Middleware edge-safe: usa solo authConfig (niente Firebase/Node).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/accesso", req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Tutto tranne: api/auth, api/cron, pagina accesso, service worker, asset
    "/((?!api/auth|api/cron|accesso|firebase-messaging-sw.js|_next/static|_next/image|favicon|icon|manifest|.*\\.(?:png|svg|webmanifest|ico|jpg|jpeg|js)).*)",
  ],
};
