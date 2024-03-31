import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
//import type { NextRequest } from 'next/server'

export default NextAuth(authConfig).auth;

//Added for exp - Najat
/*
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value

  console.log("*** currenteUser", currentUser);
 
  if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/dashboard', request.url))
  }
 
  if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', request.url))
  }
}
*/

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};