// providers/SupabaseProvider.tsx
/**
 * Supabase Session Context Provider
 * 
 * Purpose:
 * - Provides auth state to client components
 * - Handles auth state changes and automatic redirects
 * - Manages session synchronization between client and server
 * 
 * Updated: Improved session handling and redirect logic
 */
'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    // Get initial session on mount
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Initial session:', session ? 'Found' : 'None')
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_IN') {
        console.log('User signed in, refreshing router...')
        // Force refresh to update middleware
        router.refresh()
        
        // Wait a bit for middleware to detect the new session
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          router.push('/dashboard')
        }, 500)
      } 
      else if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to home...')
        router.refresh()
        router.push('/')
      }
      else if (event === 'TOKEN_REFRESHED') {
        // Refresh UI when token is updated
        router.refresh()
      }
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return children
}