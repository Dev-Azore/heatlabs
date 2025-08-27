'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { logInfo } from '@/lib/logger'

/**
 * Mount once per page (e.g., in a layout or top-level page component).
 * Redirects to /auth/login on SIGNED_OUT.
 */
export default function AuthSessionWatcher() {
  const router = useRouter()
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      logInfo('auth_state_change', { event })
      if (event === 'SIGNED_OUT') {
        router.replace('/auth/login')
      }
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/update-password')
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [router])
  return null
}
