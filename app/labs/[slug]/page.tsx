'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ProtectedContent from '@/components/ProtectedContent'
import AuthSessionWatcher from '@/components/AuthSessionWatcher'
import { logError } from '@/lib/logger'

type Module = { id: string; title: string; slug: string | null; summary: string | null; type: 'theory' | 'simulation' }
type Lab = { id: string; title: string; description?: string | null; slug?: string | null }

export default function LabDetail({ params }: { params: { slug: string }}) {
  const [lab, setLab] = useState<Lab | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data: labData, error: labErr } = await supabase
          .from('labs')
          .select('id, title, description, slug')
          .eq('slug', params.slug)
          .maybeSingle()
        if (labErr) throw labErr
        setLab(labData)
        if (labData) {
          const { data: moduleData, error: modErr } = await supabase
            .from('modules')
            .select('id, title, slug, summary, type')
            .eq('lab_id', labData.id)
            .order('title', { ascending: true })
          if (modErr) throw modErr
          setModules(moduleData ?? [])
        }
      } catch (e: any) {
        logError('load_lab_detail_failed', { slug: params.slug, error: e?.message })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.slug])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <AuthSessionWatcher />
      {loading && <p>Loading…</p>}
      {lab && <>
        <h1 className="text-2xl font-semibold mb-2">{lab.title}</h1>
        {lab.description && <p className="mb-4">{lab.description}</p>}
        <ProtectedContent>
          <h2 className="text-xl font-semibold mb-3">Modules</h2>
          <ul className="space-y-3">
            {modules.map(m => (
              <li key={m.id} className="border rounded p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{m.title}</h3>
                    {m.summary && <p className="text-sm opacity-80">{m.summary}</p>}
                  </div>
                  <Link href={m.slug ? `/modules/${m.slug}` : '#'} className="border rounded px-3 py-1">Open</Link>
                </div>
              </li>
            ))}
          </ul>
        </ProtectedContent>
      </>}
      {!lab && !loading && <p>Lab not found.</p>}
    </div>
  )
}
