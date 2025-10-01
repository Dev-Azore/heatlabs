/**
 * Module Loader
 * --------------
 * - Loads one module by ID.
 * - Protected: requires login (middleware + server check).
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ChallengeRoom from '@/components/ChallengeRoom'
import DynamicModuleRenderer from '@/components/DynamicModuleRenderer'

export default async function ModuleLoader({ params }: { params: { id: string } }) {
  // ✅ Get cookie store
  const cookieStore = await cookies()

  // ✅ Supabase client with correct cookie adapter
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

  // ✅ Enforce login
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // ✅ Fetch module
  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!module) return <div className="p-6">Module not found</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <ChallengeRoom moduleData={module}>
          <DynamicModuleRenderer slug={module.slug} moduleId={module.id} metadata={module} />
        </ChallengeRoom>
      </div>
    </div>
  )
}
