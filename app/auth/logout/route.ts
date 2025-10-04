// app/auth/logout/route.ts
/**
 * Logout Route Handler
 * 
 * Purpose:
 * - Handles server-side logout
 * - Clears session cookies properly
 * - Redirects to home page after logout
 * 
 * Updated: Ensures complete session termination
 */
import { createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )

  // Sign out from Supabase
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
  }

  // Create response and clear ALL auth cookies
  const response = NextResponse.redirect(new URL('/', request.url))
  
  // Clear all Supabase auth cookies to ensure complete logout
  const authCookies = [
    'sb-access-token',
    'sb-refresh-token', 
    'sb-provider-token',
    'supabase-auth-token'
  ]
  
  authCookies.forEach(cookieName => {
    response.cookies.set(cookieName, '', { 
      maxAge: 0, 
      path: '/',
      expires: new Date(0)
    })
  })

  return response
}