/**
 * middleware.ts
 * ----------------------
 * Centralized access control for HEAT Labs.
 * Runs on every request that matches config.matcher.
 *
 * Rules enforced:
 *   - /dashboard/*   → must be logged in (any role)
 *   - /admin/*       → must be logged in AND role = admin
 *   - /auth/*        → logged-in users redirected to /dashboard
 *
 * Notes:
 *   - Landing page (/) only shows previews. All real lab content is inside /dashboard/*,
 *     so users must sign up or log in first.
 *   - Middleware works together with Supabase RLS (DB-level protection).
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'; // ✅ FIXED helper

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ Correct client for middleware
  const supabase = createMiddlewareClient({ req, res });

  // Get current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  /**
   * Rule 1: Protect /dashboard/*
   * -----------------------------
   * Must be logged in.
   */
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return res;
  }

  /**
   * Rule 2: Protect /admin/*
   * ------------------------
   * Must be logged in AND have role = admin.
   */
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const { data: role, error } = await supabase.rpc('get_my_role');

    if (error || role !== 'admin') {
      console.error('Middleware role check error:', error?.message);
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  }

  /**
   * Rule 3: Redirect logged-in users away from /auth/*
   * ---------------------------------------------------
   * Skip login/signup/reset pages if already logged in.
   */
  if (path.startsWith('/auth')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }

  // Default → allow request
  return res;
}

/**
 * Matcher
 * --------
 * Defines which routes run through middleware.
 */
export const config = {
  matcher: [
    '/dashboard/:path*', // must log in
    '/admin/:path*',     // must be admin
    '/auth/:path*',      // skip if logged in
  ],
};
