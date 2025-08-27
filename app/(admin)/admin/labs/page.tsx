'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AdminGuard from '@/components/AdminGuard'
import AuthSessionWatcher from '@/components/AuthSessionWatcher'
import { logError, logInfo } from '@/lib/logger'

type Lab = { id: string; title: string; description?: string | null; slug?: string | null; icon?: string | null }

export default function AdminLabs() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [form, setForm] = useState<Partial<Lab>>({ title: '', description: '', slug: '', icon: '' })
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const { data, error } = await supabase.from('labs').select('id,title,description,slug,icon').order('title')
    if (error) { logError('admin_labs_load_failed', { error: error.message }) }
    setLabs(data ?? []); setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  async function createLab(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('labs').insert({
      title: form.title, description: form.description, slug: form.slug?.toLowerCase(), icon: form.icon
    } as any)
    if (error) { logError('admin_labs_create_failed', { error: error.message }) }
    else { logInfo('lab_created', { slug: form.slug }) ; setForm({ title: '', description: '', slug: '', icon: '' }); refresh() }
  }

  async function removeLab(id: string) {
    const { error } = await supabase.from('labs').delete().eq('id', id)
    if (error) logError('admin_labs_delete_failed', { error: error.message })
    else refresh()
  }

  return (
    <AdminGuard>
      <AuthSessionWatcher />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Manage Labs</h1>

        <form onSubmit={createLab} className="border rounded p-4 grid gap-3">
          <input className="border rounded p-2" placeholder="Title" value={form.title||''} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Slug (lowercase-dashed)" value={form.slug||''} onChange={e=>setForm({...form, slug:e.target.value})} />
          <input className="border rounded p-2" placeholder="Icon URL" value={form.icon||''} onChange={e=>setForm({...form, icon:e.target.value})} />
          <textarea className="border rounded p-2" placeholder="Description" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} />
          <button className="border rounded p-2">Create Lab</button>
        </form>

        <div>
          <h2 className="text-xl font-semibold mb-2">Existing Labs</h2>
          {loading ? <p>Loading…</p> :
            <ul className="space-y-3">
              {labs.map(l => (
                <li key={l.id} className="border rounded p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{l.title}</div>
                      <div className="text-sm opacity-80">{l.slug}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border rounded px-3 py-1" onClick={()=>removeLab(l.id)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </AdminGuard>
  )
}
