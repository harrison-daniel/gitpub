// import GitHubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';
// // import { MongoDBAdapter } from '@auth/mongodb-adapter';
// import User from '../../../models/user';
// import dbConnect from '../../../db/dbConnect';
// import bcrypt from 'bcrypt';

// export const authOptions = {
//   // adapter: MongoDBAdapter(dbConnect),
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//  pages: {
//   signIn: '/signin'

//  }
//   secret: process.env.NEXTAUTH_SECRET,
// };
// CredentialsProvider({
//   name: 'Credentials',
//   credentials: {
//     email: {
//       label: 'Email',
//       type: 'email',
//       placeholder: 'email@example.com',
//     },
//     password: { label: 'Password', type: 'password' },
//   },
//   async authorize(credentials) {
//     await dbConnect();
//     const user = await User.findOne({ email: credentials.email });
//     if (!user) {
//       throw new Error('No user found with the email');
//     }
//     const isValid = await bcrypt.compare(
//       credentials.password,
//       user.password,
//     );
//     if (!isValid) {
//       throw new Error('Password is incorrect');
//     }
//     return { email: user.email, name: user.name }; // Adjust according to your User model
//   },

// async authorize(credentials) {
//   const { email, password } = credentials;

//   try {
//     await dbConnect();
//     const user = await User.findOne({ email });

//     if (!user) {
//       return null;
//     }

//     const passwordsMatch = await bcrypt.compare(password, user.password);

//     if (!passwordsMatch) {
//       return null;
//     }

//     return user;
//   } catch (error) {
//     console.log('Error: ', error);
//   }
// },

// pages: {
//   signIn: '/auth/signin',
// },

// session: {
//   strategy: 'jwt',
// },
// `${process.env.NEXT_PUBLIC_API_URL}/api/register`
// callbacks: {
//   async jwt(token, user) {
//     if (user) {
//       token.id = user.id;
//     }
//     return token;
//   },
//   async session(session, token) {
//     if (token) {
//       session.user.id = token.id; // Add the ID to the user's session
//     }
//     return session;
//   },
// },
