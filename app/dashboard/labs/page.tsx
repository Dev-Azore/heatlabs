/**
 * LabsPage (Server Component)
 * ----------------------------
 * - Lists all labs for authenticated users.
 * - Protected by middleware, so guests are redirected before here.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import AnimatedLabs from '../AnimatedLabs'

export default async function LabsPage() {
  // ✅ Get cookie store (must be awaited in Next.js 15+)
  const cookieStore = await cookies()

  // ✅ Supabase client with proper cookie adapter
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

  // ✅ Fetch labs
  const { data: labs = [], error } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold">Labs</h1>
          <p className="text-red-400 mt-4">Failed to load labs: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-amber-500">All Labs</h1>
        </header>

        <section>
          <AnimatedLabs labs={labs} />
        </section>
      </div>
    </div>
  )
}
