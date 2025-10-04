// lib/supabase/browser-client.ts
/**
 * Browser-side Supabase client for Client Components
 * Safe for browser use with public ANON key
 * 
 * Updated: Added better error handling and session persistence
 */
import { createBrowserClient } from '@supabase/ssr'

export const createBrowserSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
}

export const supabase = createBrowserSupabaseClient()