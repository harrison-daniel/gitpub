import { auth } from './app/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/addEntry', '/editEntry/:path*', '/userDash'],
};
