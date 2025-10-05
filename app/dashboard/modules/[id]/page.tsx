// app/dashboard/modules/[id]/page.tsx
/**
 * Module Loader Page
 * 
 * Purpose:
 * - Dynamically loads and renders modules based on their ID
 * - Handles authentication and module validation
 * - Routes to specific module implementations when available
 * - Falls back to DynamicModuleRenderer for generic modules
 * 
 * Route: /dashboard/modules/[id] (UUID from database)
 * Access: Authenticated users only
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ChallengeRoom from '@/components/ChallengeRoom'
import DynamicModuleRenderer from '@/components/DynamicModuleRenderer'

// Next.js 15: params is now a Promise
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModuleLoader({ params }: PageProps) {
  // Await the params promise in Next.js 15
  const { id } = await params

  const cookieStore = await cookies()
  
  // Initialize Supabase server client
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

  // Check user authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch module data from database
  const { data: module, error } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single()

  // Handle module not found
  if (error || !module) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Module Not Found</h1>
          <p className="text-gray-400">The requested module could not be found.</p>
        </div>
      </div>
    )
  }

  // ===========================
  // SPECIAL MODULE HANDLING
  // ===========================
  
  // Handle Digital Circuit module specifically
  if (module.slug === 'digital-circuit') {
    try {
      // Dynamically import the Digital Circuit module component
      const DigitalCircuitModule = await import('../digital-circuit/page')
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <ChallengeRoom moduleData={module}>
            <DigitalCircuitModule.default />
          </ChallengeRoom>
        </div>
      )
    } catch (importError) {
      console.error('Failed to load Digital Circuit module:', importError)
      // Fall back to generic renderer if specific module fails to load
    }
  }

  // ===========================
  // DEFAULT MODULE RENDERING
  // ===========================
  
  // For all other modules, use the generic DynamicModuleRenderer
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto">
        <ChallengeRoom moduleData={module}>
          <DynamicModuleRenderer 
            slug={module.slug} 
            moduleId={module.id} 
            metadata={module} 
          />
        </ChallengeRoom>
      </div>
    </div>
  )
}