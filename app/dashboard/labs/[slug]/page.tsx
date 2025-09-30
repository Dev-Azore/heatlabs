/**
 * LabPage (Server Component)
 * ---------------------------
 * - Shows details of a single lab by slug.
 * - Lists all modules under that lab.
 */

import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  // ✅ Await params for Next.js 15
  const { slug } = await params;

  // ✅ Create server-side client
  const supabase = createServerComponentClient({ cookies });

  // Fetch lab by slug
  const { data: lab } = await supabase
    .from('labs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!lab) return <div className="p-6">Lab not found</div>;

  // Fetch modules under this lab
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('lab_id', lab.id)
    .order('created_at');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{lab.title}</h1>
          <p className="text-slate-400">{lab.description}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {modules?.map((m: any) => (
            <div key={m.id} className="p-4 border rounded bg-slate-800">
              <h3 className="font-semibold">{m.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{m.summary}</p>
              <Link
                href={`/dashboard/modules/${m.id}`}
                className="mt-3 inline-block px-3 py-2 bg-amber-500 rounded"
              >
                Open Module
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
