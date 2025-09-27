/** Module loader - fetches module metadata and renders ChallengeRoom with dynamic module */
import { supabase } from '@/lib/supabaseClient';
import DynamicModuleRenderer from '@/components/DynamicModuleRenderer';
import ChallengeRoom from '@/components/ChallengeRoom';

export default async function ModuleLoader({ params }: { params: { id: string } }) {
  const { data: module } = await supabase.from('modules').select('*').eq('id', params.id).single();
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
