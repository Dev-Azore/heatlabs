/**
 * middleware.ts
 * ----------------------
 * Centralized access control for HEAT Labs.
 *
 * Rules enforced:
 *   - /dashboard/*   → must be logged in
 *   - /admin/*       → must be admin
 *   - /auth/*        → only accessible if NOT logged in
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  // Always create a NextResponse to forward cookies/session downstream
  const res = NextResponse.next()

  // ✅ Supabase client tied to middleware req/res
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set({ name: key, value, ...options })
        },
        remove: (key, options) => {
          res.cookies.set({ name: key, value: '', ...options })
        },
      },
    }
  )

  // ✅ Get current session user (null if guest)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  /**
   * Rule 1: Protect /dashboard/*
   * - Guest → redirect to /auth/login
   */
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return res
  }

  /**
   * Rule 2: Protect /admin/*
   * - Guest → /auth/login
   * - Non-admin → /dashboard
   */
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // ✅ Check user role via Postgres RPC
    const { data: role, error } = await supabase.rpc('get_my_role')
    if (error || role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  }

  /**
   * Rule 3: Auth routes (/auth/*)
   * - Logged-in users cannot access → redirect to /dashboard
   */
  if (path.startsWith('/auth')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // ✅ Default → allow
  return res
}

// ✅ Apply only to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
