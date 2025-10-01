/**
 * middleware.ts
 * ----------------------
 * Global gatekeeper for HEAT Labs.
 *
 * Rules:
 *  - /dashboard/* → must be logged in
 *  - /admin/*     → must be admin
 *  - /auth/*      → only for guests
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // ✅ Supabase client tied to request/response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ✅ Get current user (null if guest)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  /**
   * 🔒 Rule 1: Protect Dashboard
   * - Guests → redirect to /auth/login
   */
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  /**
   * 🔒 Rule 2: Protect Admin
   * - Guests → redirect to /auth/login
   * - Logged in non-admin → redirect to /dashboard
   */
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    const { data: role, error } = await supabase.rpc('get_my_role')
    if (error || role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  /**
   * 🔒 Rule 3: Auth pages (login/signup/reset)
   * - Logged-in users cannot access them → redirect to /dashboard
   */
  if (path.startsWith('/auth')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // ✅ Default → allow
  return res
}

// ✅ Apply only to relevant routes
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
