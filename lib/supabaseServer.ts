/**
 * lib/supabaseServer.ts
 * ----------------------------------------
 * Server-only Supabase client.
 *
 * Why:
 * - Uses the SUPABASE_SERVICE_ROLE_KEY (⚠️ NEVER expose this to the client)
 * - Only imported in server components, API routes, and middleware.
 * - Provides unrestricted DB access (respecting RLS policies).
 *
 * Usage:
 *   import { supabaseServer } from '@/lib/supabaseServer';
 *
 * Notes:
 * - Requires env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// Safe: service role key is server-only, not exposed to browser
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !serviceRole) {
  throw new Error(
    '❌ Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Check .env.local'
  )
}

// ✅ Exported server-side Supabase client
export const supabaseServer = createClient(url, serviceRole)
