// app/admin/page.tsx
/**
 * Admin dashboard for content management
 * Requires admin or moderator role
 * Shows statistics and quick access to management sections
 */
import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  // Create authenticated Supabase client
  const supabase = await createServerSupabaseClient()

  // Get current user - redirect if not authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Check admin privileges
  const { data: role } = await supabase.rpc('get_my_role')
  if (!role || (role !== 'admin' && role !== 'moderator')) {
    redirect('/dashboard')
  }

  // Fetch admin statistics
  const [
    { count: labsCount },
    { count: modulesCount },
    { count: usersCount },
    { data: recentUsers }
  ] = await Promise.all([
    supabase.from('labs').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        
        {/* Admin Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-amber-400 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-400">
                Welcome back, {role === 'admin' ? 'Administrator' : 'Moderator'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Your Role</p>
              <p className="text-amber-400 font-semibold capitalize">{role}</p>
            </div>
          </div>
        </header>

        {/* Statistics Grid */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
            <h3 className="text-3xl font-bold text-amber-400 mb-2">
              {labsCount || 0}
            </h3>
            <p className="text-slate-400">Total Labs</p>
            <Link 
              href="/admin/labs"
              className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block transition"
            >
              Manage Labs →
            </Link>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
            <h3 className="text-3xl font-bold text-green-400 mb-2">
              {modulesCount || 0}
            </h3>
            <p className="text-slate-400">Total Modules</p>
            <Link 
              href="/admin/modules"
              className="text-xs text-green-400 hover:text-green-300 mt-2 inline-block transition"
            >
              Manage Modules →
            </Link>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
            <h3 className="text-3xl font-bold text-blue-400 mb-2">
              {usersCount || 0}
            </h3>
            <p className="text-slate-400">Total Users</p>
            <span className="text-xs text-blue-400 mt-2 inline-block">
              View Users →
            </span>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center shadow">
            <h3 className="text-3xl font-bold text-purple-400 mb-2">
              {recentUsers?.length || 0}
            </h3>
            <p className="text-slate-400">New Users</p>
            <span className="text-xs text-purple-400 mt-2 inline-block">
              Analytics →
            </span>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/labs"
              className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-amber-500/50 transition group"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition">
                <span className="text-amber-400 text-xl">🔬</span>
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Manage Labs</h3>
              <p className="text-slate-400 text-sm">
                Create, edit, and organize learning labs
              </p>
            </Link>

            <Link
              href="/admin/modules"
              className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-green-500/50 transition group"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition">
                <span className="text-green-400 text-xl">📚</span>
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Manage Modules</h3>
              <p className="text-slate-400 text-sm">
                Add learning content and challenges
              </p>
            </Link>

            <Link
              href="/admin/posts"
              className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition group"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition">
                <span className="text-blue-400 text-xl">📢</span>
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Manage Posts</h3>
              <p className="text-slate-400 text-sm">
                Create announcements and news posts
              </p>
            </Link>
          </div>
        </section>

        {/* Recent Users Table */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Users</h2>
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            {recentUsers && recentUsers.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {recentUsers.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-750 transition">
                    <div>
                      <p className="font-medium text-white">
                        {user.full_name || 'Unnamed User'}
                      </p>
                      <p className="text-slate-400 text-sm">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : user.role === 'moderator'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-slate-500 text-xs mt-1">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p>No users found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}