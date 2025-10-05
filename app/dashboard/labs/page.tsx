// app/dashboard/labs/page.tsx
/**
 * Dashboard Labs Listing Page
 * 
 * Purpose:
 * - Shows all available HEAT labs for authenticated users
 * - Provides detailed overview of each lab with module counts
 * - Protected by middleware (redirects to login if not authenticated)
 * - Consistent design with dashboard using TryHackMe color scheme
 * 
 * Route: /dashboard/labs
 * Access: Authenticated users only
 * 
 * Updated: Uses new database structure and consistent styling
 */

import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLabsPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all LABS from the database with proper ordering
  const { data: labs, error } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    return (
      <div className="min-h-screen bg-[#0C0D0E] text-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-[#8BB3FF]">Labs</h1>
          <p className="text-red-400 mt-4">Failed to load labs: {error.message}</p>
        </div>
      </div>
    )
  }

  /**
   * Returns appropriate emoji icon based on lab category
   * Consistent with dashboard icon mapping
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

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-white py-12">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-[#8BB3FF] hover:text-[#A3C4FF] transition mb-6"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-[#8BB3FF] mb-2">All Labs</h1>
          <p className="text-[#B0B8C1] text-lg">Choose a lab to start learning</p>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs?.map((lab) => (
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

              {/* Lab Footer with Action Link */}
              <div className="flex justify-between items-center">
                <Link
                  href={`/dashboard/labs/${lab.id}`}
                  className="px-4 py-2 bg-[#8BB3FF] text-[#0C0D0E] rounded-lg font-semibold hover:bg-[#A3C4FF] transition"
                >
                  Enter Lab
                </Link>
                <span className="text-xs text-[#B0B8C1] capitalize">
                  {lab.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!labs || labs.length === 0) && (
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
      </div>
    </div>
  )
}