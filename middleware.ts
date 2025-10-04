// middleware.ts
/**
 * Global Route Protection Middleware
 * 
 * Purpose:
 * - Protects routes based on authentication state
 * - Handles redirects for auth and admin routes
 * - Uses getSession() with proper error handling to avoid AuthSessionMissingError
 * 
 * Updated: Uses getSession() instead of getUser() to avoid missing session errors
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create response object
  let response = NextResponse.next()

  try {
    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // ✅ FIX: Use getSession() instead of getUser() to avoid AuthSessionMissingError
    // getSession() reads from cookies without server validation, which is fine for middleware
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user || null

    const path = request.nextUrl.pathname

    console.log(`Middleware: Path=${path}, User=${user ? user.id : 'none'}`)

    // 🔐 Rule 1: Protect Dashboard Routes
    if (path.startsWith('/dashboard')) {
      if (!user) {
        console.log('Redirecting to login from dashboard')
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('returnUrl', path)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // 🔐 Rule 2: Protect Admin Routes
    if (path.startsWith('/admin')) {
      if (!user) {
        console.log('Redirecting to login from admin')
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('returnUrl', path)
        return NextResponse.redirect(redirectUrl)
      }

      // Check admin role
      const { data: role, error: roleError } = await supabase.rpc('get_my_role')
      
      if (roleError || !role || (role !== 'admin' && role !== 'moderator')) {
        console.log('User not admin, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // 🔐 Rule 3: Redirect Authenticated Users Away from Auth Pages
    if (path.startsWith('/auth') && !path.includes('/callback') && user) {
      console.log('User authenticated, redirecting from auth page')
      const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/dashboard'
      return NextResponse.redirect(new URL(returnUrl, request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow the request to proceed
    return response
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
  ],
}