/**
 * Landing page (server component).
 * - Fetches sample labs from Supabase
 * - Renders hero section + LabCard previews
 */
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import LabCard from '@/components/LabCard';

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

            {/* ✅ Updated Links (no <a> tag inside) */}
            <div className="flex gap-3">
              <Link
                href="/dashboard"
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

        {/* Labs Preview Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Explore Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {labs?.map((lab: any) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
