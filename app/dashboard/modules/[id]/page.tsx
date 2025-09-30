/**
 * ModuleLoader (Server Component)
 * -------------------------------
 * - Loads a single module by ID.
 * - Uses server-side Supabase client (with session from cookies).
 * - Renders ChallengeRoom + DynamicModuleRenderer.
 */

import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ChallengeRoom from '@/components/ChallengeRoom';
import DynamicModuleRenderer from '@/components/DynamicModuleRenderer';

export default async function ModuleLoader({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Await params for Next.js 15
  const { id } = await params;

  // ✅ Create server-side client
  const supabase = createServerComponentClient({ cookies });

  // Fetch module by ID
  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single();

  if (!module) return <div className="p-6">Module not found</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <ChallengeRoom moduleData={module}>
          <DynamicModuleRenderer slug={module.slug} moduleId={module.id} metadata={module} />
        </ChallengeRoom>
      </div>
    </div>
  );
}
