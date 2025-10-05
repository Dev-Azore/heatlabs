// app/dashboard/labs/[id]/page.tsx
/**
 * Individual Lab Page - Responsive Design
 * 
 * Purpose:
 * - Shows detailed view of a specific lab and its modules
 * - Displays module progress and completion status
 * - Provides navigation to individual modules
 * - Fully responsive design for all screen sizes
 * - Protected route (requires authentication)
 * 
 * Route: /dashboard/labs/[id] (uses UUID from database)
 * Access: Authenticated users only
 * 
 * Responsive Features:
 * - Mobile-first design approach
 * - Flexible grid layouts that adapt to screen size
 * - Responsive typography and spacing
 * - Touch-friendly interactive elements
 * - Optimized for all devices from mobile to desktop
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Next.js 15: params is now a Promise
interface LabPageProps {
  params: Promise<{ id: string }>
}

export default async function LabPage({ params }: LabPageProps) {
  // Await the params promise in Next.js 15
  const { id } = await params
  
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch the specific lab by ID
  const { data: lab, error } = await supabase
    .from('labs')
    .select('*')
    .eq('id', id)
    .single()

  // Return 404 if lab not found
  if (error || !lab) {
    notFound()
  }

  // Fetch modules for this lab, ordered by their sequence
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('lab_id', id)
    .order('order_index', { ascending: true })

  // Fetch user progress to show completion status
  const { data: progress } = await supabase
    .from('user_progress')
    .select('module_id, status')
    .eq('user_id', user.id)

  const completedModuleIds = progress?.filter(p => p.status === 'completed').map(p => p.module_id) || []
  const inProgressModuleIds = progress?.filter(p => p.status === 'in_progress').map(p => p.module_id) || []

  /**
   * Returns appropriate emoji icon based on lab category
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
   * Determines the current status of a module for the authenticated user
   */
  const getModuleStatus = (moduleId: string) => {
    if (completedModuleIds.includes(moduleId)) return 'completed'
    if (inProgressModuleIds.includes(moduleId)) return 'in_progress'
    return 'not_started'
  }

  /**
   * Returns appropriate CSS classes for status badges
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20'
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-[#B0B8C1] bg-[#2D3138]'
    }
  }

  /**
   * Returns human-readable status text
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in_progress': return 'In Progress'
      default: return 'Not Started'
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-white">
      {/* Mobile-first responsive container with adaptive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-6 sm:py-8 lg:py-12">
        
        {/* Back Navigation - Responsive sizing and spacing */}
        <Link 
          href="/dashboard/labs" 
          className="inline-flex items-center gap-2 text-[#8BB3FF] hover:text-[#A3C4FF] transition mb-4 sm:mb-6 text-sm sm:text-base"
        >
          ← Back to All Labs
        </Link>

        {/* Lab Header Section - Responsive layout that stacks on mobile */}
        <div className="bg-[#1A1D21] rounded-xl p-4 sm:p-6 lg:p-8 border border-[#2D3138] mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            
            {/* Lab Icon - Responsive sizing that scales appropriately */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2D3138] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl sm:text-3xl">{getLabIcon(lab.category)}</span>
            </div>
            
            {/* Lab Content - Flexible width with proper text alignment */}
            <div className="flex-1 text-center sm:text-left">
              
              {/* Lab Title - Responsive typography with proper line breaks */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 break-words">
                {lab.title}
              </h1>
              
              {/* Lab Description - Responsive text sizing */}
              <p className="text-[#B0B8C1] text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                {lab.description}
              </p>
              
              {/* Lab Metadata - Responsive flex layout with wrapping */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-[#B0B8C1]">
                <span className="bg-[#2D3138] px-2 py-1 rounded">{modules?.length || 0} modules</span>
                <span className="hidden sm:inline">•</span>
                <span className="bg-[#2D3138] px-2 py-1 rounded capitalize">{lab.category}</span>
                <span className="hidden sm:inline">•</span>
                <span className="bg-[#2D3138] px-2 py-1 rounded">{lab.difficulty_level || 'All Levels'}</span>
                {lab.estimated_duration && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="bg-[#2D3138] px-2 py-1 rounded">{lab.estimated_duration} min</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modules List Section */}
        <div className="space-y-3 sm:space-y-4">
          
          {/* Section Title - Responsive sizing and alignment */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center sm:text-left">
            Modules
          </h2>
          
          {modules && modules.length > 0 ? (
            modules.map((module, index) => {
              const status = getModuleStatus(module.id)
              return (
                <div
                  key={module.id}
                  className="bg-[#1A1D21] rounded-xl p-4 sm:p-6 border border-[#2D3138] hover:border-[#8BB3FF] transition group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                    
                    {/* Module Content - Flexible layout that stacks on mobile */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full min-w-0">
                      
                      {/* Module Number/Status Indicator - Responsive sizing */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : status === 'in_progress'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-[#2D3138] text-[#B0B8C1]'
                      }`}>
                        {status === 'completed' ? '✓' : index + 1}
                      </div>
                      
                      {/* Module Details - Flexible content with proper truncation */}
                      <div className="flex-1 min-w-0">
                        
                        {/* Module Title - Responsive and truncatable */}
                        <h3 className="font-semibold text-white group-hover:text-[#8BB3FF] transition text-base sm:text-lg break-words">
                          {module.title}
                        </h3>
                        
                        {/* Module Description - Responsive text with line clamping */}
                        <p className="text-[#B0B8C1] text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2">
                          {module.summary || module.content?.substring(0, 120) + '...'}
                        </p>
                        
                        {/* Module Metadata - Responsive flex layout with wrapping */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
                          
                          {/* Status Badge - Always visible */}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                            {getStatusText(status)}
                          </span>
                          
                          {/* Module Type - Hidden on very small screens */}
                          <span className="text-xs text-[#B0B8C1] capitalize hidden xs:inline">
                            {module.type}
                          </span>
                          
                          {/* Challenge Badge - Conditional display */}
                          {module.is_challenge && (
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                              Challenge
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Start/Review Button - Responsive sizing and full-width on mobile */}
                    <Link
                      href={`/dashboard/modules/${module.id}`}
                      className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-[#8BB3FF] text-[#0C0D0E] rounded-lg font-semibold hover:bg-[#A3C4FF] transition text-sm text-center whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0"
                    >
                      {status === 'completed' ? 'Review' : 'Start'}
                    </Link>
                  </div>
                </div>
              )
            })
          ) : (
            // Empty State for Modules - Responsive design
            <div className="bg-[#1A1D21] rounded-xl p-6 sm:p-8 text-center border border-[#2D3138]">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2D3138] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Modules Available</h3>
              <p className="text-[#B0B8C1] text-sm sm:text-base">
                Modules will be added to this lab soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}