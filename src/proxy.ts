// Next.js 16 Proxy - Protect Admin Routes
// This replaces the deprecated middleware.ts file convention
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Create response and add pathname header
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Protect all admin routes except /admin/login
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // If already logged in, redirect to dashboard
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return response;
    }

    // Require authentication for all other admin routes
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
});

// Configure which routes to run proxy on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};




