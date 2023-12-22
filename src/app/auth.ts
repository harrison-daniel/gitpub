import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        //       // session.accessToken = token.accessToken;
        // console.log('Token:', token);
        // session.user = token.user
        session.user.id = token.sub;
        // session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },

  // callbacks: {
  //   jwt: async ({ token, user }) => {
  //     if (user) {
  //       token.userId = user.id;
  //     }
  //     return token;
  //   },
  // }
  secret: process.env.AUTH_SECRET,
});
