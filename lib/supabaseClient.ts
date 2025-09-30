/**
* lib/supabaseClient.ts
* ---------------------
* Client-side Supabase instance using public ANON key.
* Safe to include in browser bundles. Throws early if env vars missing
* so we don't silently fail in production.
*/


import { createClient } from '@supabase/supabase-js';


const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


// Fail fast if env vars missing — helps catch deployment/misconfiguration early.
if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');


// Export named `supabase` for client-side usage in React components.
export const supabase = createClient(url, anon);
