/**
 * Dashboard Page (Server Component)
 * ---------------------------------
 * - Protected by middleware (must be logged in).
 * - Fetches labs server-side via supabaseServer.
 * - Can also fetch user session (optional).
 */

import LabCard from '@/components/LabCard'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function DashboardPage() {
  // ✅ Get logged-in user (optional personalization)
  const {
    data: { user },
  } = await supabaseServer.auth.getUser()

  // ✅ Fetch labs (server-side)
  const { data: labs, error } = await supabaseServer
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-red-400">Error loading labs: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">
          Welcome {user?.email || 'Learner'} 👋
        </h1>

        {labs?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No labs available yet.</p>
        )}
      </div>
    </div>
  )
}
