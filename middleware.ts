import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const protectedRoutes = ['/dashboard'];


  if (!req.auth && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};