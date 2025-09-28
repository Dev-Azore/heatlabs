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
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Initialize Supabase client (auth aware)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Fetch current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  /**
   * Rule 1: Protect /dashboard/*
   * -----------------------------
   * - User must be logged in
   * - Covers: dashboard, labs, modules, profile, etc.
   */
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return res; // logged-in users allowed
  }

  /**
   * Rule 2: Protect /admin/*
   * ------------------------
   * - User must be logged in AND have role = admin
   */
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Check role from Supabase via RPC
    const { data: role, error } = await supabase.rpc('get_my_role');

    if (error) {
      console.error('Middleware role check error:', error.message);
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res; // admin allowed
  }

  /**
   * Rule 3: Redirect logged-in users away from /auth/*
   * ---------------------------------------------------
   * - If already logged in, skip login/signup pages
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
    '/dashboard/:path*', // Labs, modules, dashboard — must log in
    '/admin/:path*',     // Admin — must be admin
    '/auth/:path*',      // Auth pages — skip if logged in
  ],
};
