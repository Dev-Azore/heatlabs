/**
 * Dashboard Page
 * ---------------
 * - Only accessible to logged-in users (middleware enforces this).
 * - Displays labs fetched from Supabase.
 */

import LabCard from '@/components/LabCard'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // ✅ Get cookie store (must be awaited in Next.js 15+)
  const cookieStore = await cookies()

  // ✅ Supabase client bound to cookies with proper get/set/remove
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

  // ✅ Enforce login server-side
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // ✅ Fetch labs
  const { data: labs, error } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-red-400">Error loading labs: {error.message}</p>
        </div>
      </div>
    )
  }

  // ✅ Render dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">
          Welcome {user.email || 'Learner'} 👋
        </h1>

        {labs?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No labs yet.</p>
        )}
      </div>
    </div>
  )
}
