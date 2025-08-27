'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import AuthSessionWatcher from '@/components/AuthSessionWatcher'
import { logError } from '@/lib/logger'

type Lab = { id: string; title: string; description?: string | null; slug?: string | null; icon?: string | null }

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from('labs')
          .select('id, title, description, slug, icon')
          .order('title', { ascending: true })
        if (error) throw error
        setLabs(data ?? [])
      } catch (e: any) {
        logError('load_labs_failed', { error: e?.message })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <AuthSessionWatcher />
      <h1 className="text-2xl font-semibold mb-4">Labs</h1>
      {loading ? <p>Loading…</p> :
        <ul className="space-y-3">
          {labs.map(l => (
            <li key={l.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">{l.title}</h2>
                  {l.description && <p className="text-sm opacity-80">{l.description}</p>}
                </div>
                <Link
                  href={l.slug ? `/labs/${l.slug}` : `/labs/id/${l.id}`}
                  className="border rounded px-3 py-1"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}
