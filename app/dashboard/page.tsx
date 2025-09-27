/** Dashboard page - server component showing labs */
import { supabase } from '@/lib/supabaseClient';
import LabCard from '@/components/LabCard';

export default async function DashboardPage() {
  const { data: labs } = await supabase.from('labs').select('*').order('created_at', { ascending: false });
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div>Welcome — start a lab</div>
        </header>
        <section>
          <h2 className="text-xl font-semibold mb-3">Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {labs?.map((lab: any) => <LabCard key={lab.id} lab={lab} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
