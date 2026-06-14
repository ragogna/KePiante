import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowed } from "@/lib/allowlist";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/accesso",
    error: "/accesso",
  },
  callbacks: {
    // Blocca il login se l'email non è in allowlist.
    signIn({ profile, user }) {
      return isAllowed(profile?.email ?? user?.email);
    },
    // Usato dal middleware: autorizzato solo se loggato.
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
