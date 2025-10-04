// app/dashboard/page.tsx
/**
 * Main Dashboard Page
 * 
 * Purpose:
 * - Landing page for authenticated users
 * - Shows user progress and available labs
 * - Server-side protected with proper session validation
 * 
 * Updated: Uses client logout component for proper logout functionality
 */
import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  // Create authenticated Supabase client
  const supabase = await createServerSupabaseClient()

  // Get current user session with error handling
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Dashboard auth error:', userError)
    redirect('/auth/login')
  }

  if (!user) {
    console.log('No user found, redirecting to login')
    redirect('/auth/login')
  }

  console.log('Dashboard: User authenticated:', user.email)

  // Fetch user data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const { data: labs } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: progress } = await supabase
    .from('user_progress')
    .select('module_id, status')
    .eq('user_id', user.id)

  // Calculate stats
  const completedModules = progress?.filter(p => p.status === 'completed').length || 0
  const totalModules = labs?.reduce((total, lab) => total + (lab.modules_count || 0), 0) || 0
  const completionPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        
        {/* Welcome Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋
          </h1>
          <p className="text-slate-400 text-lg">
            Continue your learning journey with HEAT Labs
          </p>
        </header>

        {/* Progress Stats */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-amber-400 mb-2">
              {completedModules}
            </h3>
            <p className="text-slate-400">Modules Completed</p>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-green-400 mb-2">
              {labs?.length || 0}
            </h3>
            <p className="text-slate-400">Available Labs</p>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-blue-400 mb-2">
              {completionPercentage}%
            </h3>
            <p className="text-slate-400">Overall Progress</p>
          </div>
        </section>

        {/* Labs Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Labs</h2>
            <Link
              href="/dashboard/labs"
              className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              View All Labs
            </Link>
          </div>

          {labs && labs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.slice(0, 6).map((lab) => (
                <div
                  key={lab.id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500/50 transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition">
                      <span className="text-xl">🔬</span>
                    </div>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {lab.category || 'General'}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-amber-400 transition">
                    {lab.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4">
                    {lab.description || 'No description available.'}
                  </p>

                  <div className="flex justify-between items-center">
                    <Link
                      href={`/dashboard/labs/${lab.slug}`}
                      className="text-amber-400 hover:text-amber-300 font-medium text-sm transition"
                    >
                      Start Learning →
                    </Link>
                    <span className="text-xs text-slate-500">
                      {lab.estimated_duration ? `${lab.estimated_duration}m` : 'Self-paced'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Labs Available</h3>
              <p className="text-slate-400">
                Labs will be available soon. Check back later!
              </p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/labs"
              className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 text-center transition group"
            >
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-500/30 transition">
                <span className="text-amber-400">📖</span>
              </div>
              <span className="text-white font-medium">Browse Labs</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 text-center transition group"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/30 transition">
                <span className="text-blue-400">👤</span>
              </div>
              <span className="text-white font-medium">My Profile</span>
            </Link>

            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 text-center transition group"
              >
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500/30 transition">
                  <span className="text-green-400">⚙️</span>
                </div>
                <span className="text-white font-medium">Admin Panel</span>
              </Link>
            )}

            {/* Client-side logout button */}
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  )
}