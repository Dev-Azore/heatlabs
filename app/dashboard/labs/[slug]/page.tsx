/**
 * Lab Detail Page
 * ----------------
 * - Shows one lab and its modules.
 * - Protected: requires login (middleware + server check).
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LabPage({ params }: { params: { slug: string } }) {
  // ✅ Get cookie store (must be awaited in Next.js 15+)
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

  // ✅ Fetch lab
  const { data: lab } = await supabase
    .from('labs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!lab) return <div className="p-6">Lab not found</div>

  // ✅ Fetch modules
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('lab_id', lab.id)
    .order('created_at')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold">{lab.title}</h1>
        <p className="text-slate-400">{lab.description}</p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {modules?.map((m: any) => (
            <div key={m.id} className="p-4 border rounded bg-slate-800">
              <h3 className="font-semibold">{m.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{m.summary}</p>
              <Link
                href={`/dashboard/modules/${m.id}`}
                className="mt-3 inline-block px-3 py-2 bg-amber-500 rounded"
              >
                Open Module
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
