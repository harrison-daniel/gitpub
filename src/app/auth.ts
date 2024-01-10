import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
// import { NextResponse } from 'next/server';

export const authConfig = {
  providers: [
    GitHub,
    Google,
  ],
  callbacks: {
    // async jwt({ token, user, account }) {
    //   if (account && user) {
    //     token.accessToken = account.access_token;
    //     token.userId = user.id;
    //   }
    //   return token;
    // },
  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
    
    
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

