import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // adapter: MongoDBAdapter(dbConnect),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        //       // session.accessToken = token.accessToken;
        // console.log('Token:', token);
        // session.user = token.user
        session.user.id = token.sub;
        session.user.accessToken = token.accessToken;
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
  secret: process.env.NEXTAUTH_SECRET,
};

// export default authOptions;
