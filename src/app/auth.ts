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
    // async jwt({ token, user, account }) {
    //   if (account && user) {
    //     token.accessToken = account.access_token;
    //     token.userId = user.id;
    //   }
    //   return token;
    // },
    // async session({ session, token }) {
    //   session.user.id = token.userId; // Make sure this is the ID you use in your database
    //   session.accessToken = token.accessToken; // Include the access token in the session
    //   return session;
    // },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});
