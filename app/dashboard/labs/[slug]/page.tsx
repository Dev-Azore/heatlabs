// app/dashboard/labs/[slug]/page.tsx
/**
 * Lab Detail Page
 * 
 * Purpose:
 * - Shows one lab and its modules
 * - Protected: requires login (middleware + server check)
 * 
 * Fixed: TypeScript params type for Next.js 15
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Next.js 15: params is now a Promise
interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LabPage({ params }: PageProps) {
  // Await the params promise in Next.js 15
  const { slug } = await params

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
  if (!user) redirect('/auth/login')

  const { data: lab } = await supabase
    .from('labs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!lab) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-red-400">Lab not found</h1>
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 mt-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('lab_id', lab.id)
    .order('created_at')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{lab.title}</h1>
          <p className="text-slate-400 mt-2">{lab.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {modules?.map((module) => (
            <div key={module.id} className="p-4 border border-slate-700 rounded bg-slate-800">
              <h3 className="font-semibold text-lg">{module.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{module.summary}</p>
              <Link
                href={`/dashboard/modules/${module.id}`}
                className="mt-3 inline-block px-3 py-2 bg-amber-500 text-slate-900 rounded font-semibold hover:bg-amber-400 transition"
              >
                Open Module
              </Link>
            </div>
          ))}
        </div>

        {(!modules || modules.length === 0) && (
          <div className="text-center py-8">
            <p className="text-slate-400">No modules available for this lab yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}