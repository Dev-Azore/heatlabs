'use client';
/**
 * DynamicModuleRenderer: client-side dynamic import loader for coded modules.
 * - Uses a registry mapping slug -> dynamic import
 * - Provides default onComplete that calls upsert_user_progress RPC
 */
import { useEffect, useState } from 'react';
import { moduleRegistry } from '@/app/dashboard/modules/coded/registry';

export default function DynamicModuleRenderer({ slug, moduleId, metadata }: any) {
  const [ModuleComp, setModuleComp] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!slug) return;
      const importer = moduleRegistry[slug];
      if (!importer) {
        setModuleComp(() => () => <div className="p-4 text-center">Module not implemented yet.</div>);
        return;
      }
      try {
        const Comp = await importer();
        if (mounted) setModuleComp(() => Comp);
      } catch (err) {
        console.error('failed to import', err);
        setModuleComp(() => () => <div className="p-4 text-center">Error loading module</div>);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  if (!ModuleComp) return <div className="p-6">Loading module…</div>;

  return <ModuleComp moduleId={moduleId} metadata={metadata} onComplete={async () => {
    const { supabase } = await import('@/lib/supabaseClient');
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('You must be signed in to complete the module');
    const { error } = await supabase.rpc('upsert_user_progress', {
      p_module_id: moduleId,
      p_user_id: user.id,
      p_status: 'completed'
    });
    if (error) alert('Failed to mark complete: ' + error.message);
    else alert('Module marked complete!');
  }} />;
}
