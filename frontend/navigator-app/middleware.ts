import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import type { NextRequest } from 'next/server'
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import { useSession} from "next-auth/react"

export default NextAuth(authConfig).auth;

//Added for exp - Najat
/*
export async function middleware(request: NextRequest) {
  
  const currentUser = request.cookies.get('currentUser')?.value

  console.log("req.cookies: ", request.cookies);

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