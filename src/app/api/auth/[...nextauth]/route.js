import NextAuth from 'next-auth/next';
// import GitHubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';
import { authOptions } from '../[...nextauth]/options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
