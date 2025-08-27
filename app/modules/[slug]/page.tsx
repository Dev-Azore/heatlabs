'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProtectedContent from '@/components/ProtectedContent'
import AuthSessionWatcher from '@/components/AuthSessionWatcher'
import { logError } from '@/lib/logger'

type Module = {
  id: string
  title: string
  summary: string | null
  type: 'theory' | 'simulation'
  content: string | null
}

export default function ModuleDetail({ params }: { params: { slug: string }}) {
  const [mod, setMod] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('id, title, summary, type, content')
          .eq('slug', params.slug)
          .maybeSingle()
        if (error) throw error
        setMod(data)
      } catch (e: any) {
        logError('load_module_failed', { slug: params.slug, error: e?.message })
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
      {mod && <>
        <h1 className="text-2xl font-semibold mb-2">{mod.title}</h1>
        {mod.summary && <p className="mb-4">{mod.summary}</p>}
        <p className="mb-4 text-sm opacity-80">Type: {mod.type}</p>
        <ProtectedContent>
          {mod.content ? (
            <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: mod.content }} />
          ) : (
            <p>No content available.</p>
          )}
        </ProtectedContent>
      </>}
      {!mod && !loading && <p>Module not found.</p>}
    </div>
  )
}
