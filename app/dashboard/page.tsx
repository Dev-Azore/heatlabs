// app/dashboard/page.tsx
/**
 * Main Dashboard Page
 * 
 * Purpose:
 * - Landing page for authenticated users after login
 * - Displays user progress, available labs, and quick actions
 * - Shows completion statistics and learning progress
 * - Protected route - redirects to login if not authenticated
 * 
 * Updated:
 * - Fixed progress calculation to use actual module counts from database
 * - Updated lab icons to use category-based icons instead of title parsing
 * - Fixed module counting with proper database queries
 * - Updated lab card links to point to existing /dashboard/labs/[id] routes
 */

import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  console.log('Dashboard: User authenticated:', user.email)

  // Fetch user profile data including full name and role
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // Fetch all available labs from the database
  const { data: labs } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: true })

  // Fetch user's progress data to track completed modules
  const { data: progress } = await supabase
    .from('user_progress')
    .select('module_id, status')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  // Calculate user progress statistics
  const completedModules = progress?.length || 0
  
  // Get total modules count across all labs
  const { count: totalModules } = await supabase
    .from('modules')
    .select('*', { count: 'exact', head: true })

  const completionPercentage = totalModules && totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  /**
   * Returns appropriate emoji icon based on lab category
   * Uses the category field from database for consistent icon mapping
   */
  const getLabIcon = (category: string) => {
    switch (category) {
      case 'health': return '🩺'
      case 'education': return '📚'
      case 'agriculture': return '🌾'
      case 'technology': return '💻'
      default: return '🔬'
    }
  }

  /**
   * Get module count for a specific lab
   * Queries the database to get actual count of modules for each lab
   */
  const getLabModuleCount = async (labId: string) => {
    const { count } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true })
      .eq('lab_id', labId)
    return count || 0
  }

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-white py-8">
      <div className="container mx-auto px-6">
        
        {/* Welcome Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#8BB3FF] mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋
          </h1>
          <p className="text-[#B0B8C1] text-lg">
            Continue your learning journey with HEAT Labs
          </p>
        </header>

        {/* Progress Statistics Section */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completed Modules Card */}
          <div className="bg-[#1A1D21] rounded-xl p-6 text-center border border-[#2D3138] hover:border-[#8BB3FF] transition">
            <h3 className="text-3xl font-bold text-[#8BB3FF] mb-2">
              {completedModules}
            </h3>
            <p className="text-[#B0B8C1]">Modules Completed</p>
          </div>
          
          {/* Available Labs Card */}
          <div className="bg-[#1A1D21] rounded-xl p-6 text-center border border-[#2D3138] hover:border-[#96F2D7] transition">
            <h3 className="text-3xl font-bold text-[#96F2D7] mb-2">
              {labs?.length || 0}
            </h3>
            <p className="text-[#B0B8C1]">Available Labs</p>
          </div>
          
          {/* Overall Progress Card */}
          <div className="bg-[#1A1D21] rounded-xl p-6 text-center border border-[#2D3138] hover:border-[#FFD666] transition">
            <h3 className="text-3xl font-bold text-[#FFD666] mb-2">
              {completionPercentage}%
            </h3>
            <p className="text-[#B0B8C1]">Overall Progress</p>
          </div>
        </section>

        {/* Labs Grid Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">HEAT Labs</h2>
            {/* Link to view all labs in detail - points to existing /dashboard/labs route */}
            <Link
              href="/dashboard/labs"
              className="px-4 py-2 bg-[#8BB3FF] text-[#0C0D0E] rounded-lg font-semibold hover:bg-[#A3C4FF] transition"
            >
              View All Labs
            </Link>
          </div>

          {/* Labs Grid - Shows all available labs */}
          {labs && labs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labs.map(async (lab) => {
                const moduleCount = await getLabModuleCount(lab.id)
                return (
                  <div
                    key={lab.id}
                    className="bg-[#1A1D21] rounded-xl p-6 border border-[#2D3138] hover:border-[#8BB3FF] transition group"
                  >
                    {/* Lab Header with Icon and Difficulty */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#2D3138] rounded-lg flex items-center justify-center group-hover:bg-[#8BB3FF]/20 transition">
                        <span className="text-xl">{getLabIcon(lab.category)}</span>
                      </div>
                      <span className="text-xs bg-[#2D3138] text-[#B0B8C1] px-2 py-1 rounded">
                        {lab.difficulty_level || 'All Levels'}
                      </span>
                    </div>
                    
                    {/* Lab Title and Description */}
                    <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-[#8BB3FF] transition">
                      {lab.title}
                    </h3>
                    
                    <p className="text-[#B0B8C1] text-sm mb-4">
                      {lab.description}
                    </p>

                    {/* Lab Footer with Action Link and Module Count */}
                    {/* UPDATED: Links point to existing /dashboard/labs/[id] route */}
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/dashboard/labs/${lab.id}`}
                        className="px-4 py-2 bg-[#8BB3FF] text-[#0C0D0E] rounded-lg font-semibold hover:bg-[#A3C4FF] transition text-sm"
                      >
                        Enter Lab
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#B0B8C1]">
                          {moduleCount} modules
                        </span>
                        <span className="text-xs bg-[#2D3138] text-[#B0B8C1] px-2 py-1 rounded capitalize">
                          {lab.category}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Empty State - Shown when no labs are available
            <div className="bg-[#1A1D21] rounded-xl p-8 text-center border border-[#2D3138]">
              <div className="w-16 h-16 bg-[#2D3138] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Labs Available</h3>
              <p className="text-[#B0B8C1]">
                Labs will be available soon. Check back later!
              </p>
            </div>
          )}
        </section>

        {/* Quick Actions Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Browse Labs Action - Updated to point to existing route */}
            <Link
              href="/dashboard/labs"
              className="bg-[#1A1D21] hover:bg-[#2D3138] rounded-lg p-4 text-center transition group border border-[#2D3138] hover:border-[#8BB3FF]"
            >
              <div className="w-10 h-10 bg-[#8BB3FF]/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-[#8BB3FF]/30 transition">
                <span className="text-[#8BB3FF]">📖</span>
              </div>
              <span className="text-white font-medium">Browse Labs</span>
            </Link>

            {/* Profile Action */}
            <Link
              href="/profile"
              className="bg-[#1A1D21] hover:bg-[#2D3138] rounded-lg p-4 text-center transition group border border-[#2D3138] hover:border-[#96F2D7]"
            >
              <div className="w-10 h-10 bg-[#96F2D7]/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-[#96F2D7]/30 transition">
                <span className="text-[#96F2D7]">👤</span>
              </div>
              <span className="text-white font-medium">My Profile</span>
            </Link>

            {/* Admin Panel Action - Only shown to admin users */}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-[#1A1D21] hover:bg-[#2D3138] rounded-lg p-4 text-center transition group border border-[#2D3138] hover:border-[#FFD666]"
              >
                <div className="w-10 h-10 bg-[#FFD666]/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-[#FFD666]/30 transition">
                  <span className="text-[#FFD666]">⚙️</span>
                </div>
                <span className="text-white font-medium">Admin Panel</span>
              </Link>
            )}

            {/* Logout Action - Client-side component for secure logout */}
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  )
}