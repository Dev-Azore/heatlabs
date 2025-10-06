// middleware.ts
/**
 * Global Route Protection Middleware
 * 
 * Purpose:
 * - Protects routes based on authentication state
 * - Handles redirects for auth and admin routes
 * - Uses getUser() for secure authentication
 * - Protects all authenticated routes including labs and profile
 * 
 * Updated: Fixed user role checking and added comprehensive route protection
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create Supabase client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // FIXED: Return array of objects with name and value properties
          const cookies = request.cookies.getAll()
          return cookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // ... rest of your middleware code remains exactly the same ...
  try {
    // ✅ Use getUser() for secure authentication (validates with Supabase Auth server)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    const path = request.nextUrl.pathname

    console.log(`Middleware: Path=${path}, User=${user ? user.id : 'none'}`)

    // 🔐 Rule 1: Protect All Authenticated Routes
    const protectedRoutes = ['/dashboard', '/labs', '/profile']
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    if (isProtectedRoute && !user) {
      console.log(`Redirecting to login from ${path}`)
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('returnUrl', path)
      return NextResponse.redirect(redirectUrl)
    }

    // 🔐 Rule 2: Protect Admin Routes
    if (path.startsWith('/admin')) {
      if (!user) {
        console.log('Redirecting to login from admin')
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('returnUrl', path)
        return NextResponse.redirect(redirectUrl)
      }

      // ✅ FIXED: Check admin role by querying the profiles table directly
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Allow access only for users with 'admin' role
      if (profileError || !profile || profile.role !== 'admin') {
        console.log(`User ${user.email} not admin, redirecting to dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      console.log(`Admin access granted for: ${user.email}`)
    }

    // 🔐 Rule 3: Redirect Authenticated Users Away from Auth Pages
    if (path.startsWith('/auth') && !path.includes('/callback') && user) {
      console.log('User authenticated, redirecting from auth page')
      const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/dashboard'
      return NextResponse.redirect(new URL(returnUrl, request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow the request to proceed
    return supabaseResponse
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/labs/:path*',
    '/profile/:path*',
  ],
}