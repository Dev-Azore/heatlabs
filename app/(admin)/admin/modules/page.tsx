'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AdminGuard from '@/components/AdminGuard'
import AuthSessionWatcher from '@/components/AuthSessionWatcher'
import { logError, logInfo } from '@/lib/logger'

type Lab = { id: string; title: string; slug: string | null }
type Module = { id: string; title: string; slug: string | null; type: 'theory' | 'simulation'; summary: string | null; lab_id: string }

export default function AdminModules() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Module>>({ title: '', slug: '', type: 'simulation', summary: '', lab_id: '' })

  async function refresh() {
    setLoading(true)
    const [labsRes, modsRes] = await Promise.all([
      supabase.from('labs').select('id,title,slug').order('title'),
      supabase.from('modules').select('id,title,slug,type,summary,lab_id').order('title')
    ])
    if (labsRes.error) logError('admin_modules_load_labs_failed', { error: labsRes.error.message })
    if (modsRes.error) logError('admin_modules_load_modules_failed', { error: modsRes.error.message })
    setLabs(labsRes.data ?? [])
    setModules(modsRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  async function createModule(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      title: form.title,
      slug: form.slug?.toLowerCase() || null,
      type: form.type || 'simulation',
      summary: form.summary || null,
      lab_id: form.lab_id
    }
    const { error } = await supabase.from('modules').insert(payload as any)
    if (error) logError('admin_modules_create_failed', { error: error.message })
    else { logInfo('module_created', { slug: form.slug }); setForm({ title:'', slug:'', type:'simulation', summary:'', lab_id:'' }); refresh() }
  }

  async function removeModule(id: string) {
    const { error } = await supabase.from('modules').delete().eq('id', id)
    if (error) logError('admin_modules_delete_failed', { error: error.message })
    else refresh()
  }

  return (
    <AdminGuard>
      <AuthSessionWatcher />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Manage Modules</h1>

        <form onSubmit={createModule} className="border rounded p-4 grid gap-3">
          <input className="border rounded p-2" placeholder="Title" required
            value={form.title||''} onChange={e=>setForm({...form, title:e.target.value})} />
          <input className="border rounded p-2" placeholder="Slug (lowercase-dashed)"
            value={form.slug||''} onChange={e=>setForm({...form, slug:e.target.value})} />
          <select className="border rounded p-2" value={form.type||'simulation'}
            onChange={e=>setForm({...form, type:e.target.value as any})}>
            <option value="simulation">simulation</option>
            <option value="theory">theory</option>
          </select>
          <textarea className="border rounded p-2" placeholder="Summary"
            value={form.summary||''} onChange={e=>setForm({...form, summary:e.target.value})} />
          <select className="border rounded p-2" required value={form.lab_id||''}
            onChange={e=>setForm({...form, lab_id:e.target.value})}>
            <option value="">Select Lab</option>
            {labs.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
          <button className="border rounded p-2">Create Module</button>
        </form>

        <div>
          <h2 className="text-xl font-semibold mb-2">Existing Modules</h2>
          {loading ? <p>Loading…</p> :
            <ul className="space-y-3">
              {modules.map(m => (
                <li key={m.id} className="border rounded p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="text-sm opacity-80">{m.slug} • {m.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border rounded px-3 py-1" onClick={()=>removeModule(m.id)}>Delete</button>
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
