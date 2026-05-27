import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schemas";
import { env } from "../env.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: env.google.clientId,
      clientSecret: env.google.clientSecret,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user?.password) return null; // Google-only account

        const valid = await bcrypt.compare(credentials.password as string, user.password);

        return valid ? user : null;
      },
    }),
  ],
  session: { strategy: "jwt" }, // required for Credentials provider
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id; // runs on sign-in, persists id into the token
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string; // exposes it on the session object
      return session;
    },
  },
});
