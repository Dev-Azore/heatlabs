/**
 * Landing page (server component).
 * - Shows hero section
 * - Previews a few labs (but locked until login)
 * - Encourages signup
 */
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  // Fetch latest 4 labs from Supabase
  const { data: labs } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <section className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              HEAT Labs — Learn by building
            </h1>
            <p className="text-slate-400 mb-6">
              Interactive labs in Health, Education, Agriculture, Technology.
            </p>

            {/* ✅ Updated Start Button → goes to Signup */}
            <div className="flex gap-3">
              <Link
                href="/auth/signup"
                className="px-5 py-3 rounded-md bg-amber-500 font-semibold"
              >
                Start
              </Link>
              <Link
                href="/auth/login"
                className="px-5 py-3 rounded-md border"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Labs Preview Section (Locked previews) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Explore Labs (Preview)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {labs?.map((lab: any) => (
              <div
                key={lab.id}
                className="block p-4 rounded bg-slate-800 border border-slate-700 hover:shadow cursor-not-allowed opacity-75"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                    <span>🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{lab.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {lab.description}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Sign up to unlock this lab →
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
