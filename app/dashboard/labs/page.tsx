/**
 * LabsPage (Server Component)
 * ----------------------------
 * - Lists all labs for authenticated users.
 * - Uses server-side Supabase client (with session from cookies).
 * - Redirects to /auth/login if no session exists.
 * - Passes labs to AnimatedLabs client component for animations.
 */

import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AnimatedLabs from '../AnimatedLabs';

export default async function LabsPage() {
  // ✅ Create server-side Supabase client
  const supabase = createServerComponentClient({ cookies });

  // ✅ Verify active session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // ✅ Fetch all labs (most recent first)
  const { data: labs = [], error } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold">Labs</h1>
          <p className="text-red-400 mt-4">Failed to load labs: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-amber-500">All Labs</h1>
        </header>

        <section>
          <AnimatedLabs labs={labs} />
        </section>
      </div>
    </div>
  );
}
