/**
 * middleware.ts
 * ----------------------
 * Centralized access control for HEAT Labs.
 * Rules enforced:
 *   - /dashboard/*   → must be logged in
 *   - /admin/*       → must be admin
 *   - /auth/*        → only accessible if NOT logged in
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Correct Supabase client for middleware
  const supabase = createMiddlewareClient({ req, res });

  // Get user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // Rule 1: Protect dashboard
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return res;
  }

  // Rule 2: Protect admin
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const { data: role } = await supabase.rpc('get_my_role');
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }

  // Rule 3: Auth pages (login/signup/reset) only for guests
  if (path.startsWith('/auth')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }

  // Default: allow
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
