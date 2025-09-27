/**
 * middleware.ts
 * --------------
 * Next.js Middleware runs BEFORE a request is completed.
 * It can allow, block, or redirect requests at the edge (fast, secure).
 *
 * Purpose here:
 *   - Protect all /admin routes
 *   - Ensure only authenticated users with role = 'admin' can access
 *   - Redirect others to login or dashboard
 *
 * This does NOT replace Row Level Security in Supabase.
 * It’s an extra gate to improve UX and hide admin pages from normal users.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Create a mutable response
  const res = NextResponse.next();

  // Initialize Supabase client with environment variables
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

  // If the path begins with /admin, enforce protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Get logged-in user from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Case A: User not logged in → redirect to login page
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Call DB RPC to get the user's role
    const { data: role, error } = await supabase.rpc('get_my_role');

    if (error) {
      console.error('Error fetching role in middleware:', error.message);
      // Redirect to dashboard on error
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (role !== 'admin') {
      // Case B: User logged in but not admin → redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Case C: User is admin → allow request to continue
    return res;
  }

  // For all other routes, do nothing
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};