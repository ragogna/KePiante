import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Config edge-safe condivisa (usata dal middleware): nessun import Node/Firebase.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/accesso",
    error: "/accesso",
  },
  callbacks: {
    // Usato dal middleware: autorizzato solo se loggato.
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
};
