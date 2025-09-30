'use client'

/**
 * SupabaseProvider
 * ----------------
 * Wraps the app with Supabase's SessionContextProvider so that:
 * - Auth state is preserved across client pages.
 * - Supabase client is available via React hooks (useSupabaseClient, useSession).
 */

import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // ✅ Initialize Supabase client only once in the browser
  const [supabaseClient] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    // ✅ Provide Supabase client + session context to entire React tree
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
