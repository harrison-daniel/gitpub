import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from "next-auth"

export const config = {
  // theme: {
  //   logo: "",
  // },
  providers: [
GitHub, Google],


callbacks: {
  authorized({ request, auth }) {
    const { pathname } = request.nextUrl
    if (pathname === "/middleware-example") return !!auth
    return true
  },
  async session({ session, user, token }) {
          if (token && session.user) {
            session.user.id = token.sub || '';
          }
          return session;
        },
},
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

// export const { handlers: { GET, POST }, auth } = NextAuth({
//   providers: [
//     GitHub,
//     Google,
//   ],
//   callbacks: {
//     // async jwt({ token, user, account }) {
//     //   if (account && user) {
//     //     token.accessToken = account.access_token;
//     //     token.userId = user.id;
//     //   }
//     //   return token;
//     // },
  
//     async session({ session, user, token }) {
//       if (token && session.user) {
//         session.user.id = token.sub || '';
//       }
//       return session;
//     },
    
    
//   },
// });



