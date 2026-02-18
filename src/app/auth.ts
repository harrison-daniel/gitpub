import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
// import { NextResponse } from 'next/server';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub, Google],

  callbacks: {
    async jwt({ token, account }) {
      // account is only present on initial sign-in; providerAccountId is the
      // stable OAuth user ID (Google sub, GitHub numeric ID). Without this,
      // NextAuth v5 may use an ephemeral user.id that changes each sign-in.
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});
