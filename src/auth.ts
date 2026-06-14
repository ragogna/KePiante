import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { isAllowed } from "@/lib/allowlist-db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Blocca il login se l'email non è in allowlist (statica o dinamica).
    async signIn({ profile, user }) {
      return isAllowed(profile?.email ?? user?.email);
    },
  },
});
