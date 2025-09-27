/**
 * lib/supabaseClient.ts
 * Initializes the Supabase client using public ANON key (safe for client-side).
 * Throws an error if environment variables are missing to avoid silent failures.
 */
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
export const supabase = createClient(url, anon);
