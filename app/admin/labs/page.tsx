'use client';
/** Admin Labs CRUD - client side page to create and delete labs */
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
export default function AdminLabs() {
  const [labs,setLabs]=useState<any[]>([]); const [title,setTitle]=useState(''); const [slug,setSlug]=useState(''); const [desc,setDesc]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{ fetchLabs(); },[]);
  async function fetchLabs(){ const { data } = await supabase.from('labs').select('*').order('created_at'); setLabs(data||[]); }
  async function createLab(){ setLoading(true); const { error } = await supabase.from('labs').insert([{ title, description: desc, slug }]); if(error) alert(error.message); else { setTitle(''); setSlug(''); setDesc(''); fetchLabs(); } setLoading(false); }
  async function deleteLab(id:string){ if(!confirm('Delete lab?')) return; const { error } = await supabase.from('labs').delete().eq('id', id); if(error) alert(error.message); else fetchLabs(); }
  return (<div className="p-6"><h2 className="text-xl font-semibold mb-4">Labs</h2><div className="mb-4 space-y-2"><input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="p-2 bg-slate-800 rounded w-full" /><input placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} className="p-2 bg-slate-800 rounded w-full" /><textarea placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} className="p-2 bg-slate-800 rounded w-full" /><button onClick={createLab} className="px-4 py-2 bg-amber-500 rounded" disabled={loading}>Create</button></div><div className="grid gap-3">{labs.map(l=>(<div key={l.id} className="p-3 bg-slate-800 rounded flex justify-between items-center"><div><div className="font-semibold">{l.title}</div><div className="text-sm text-slate-400">{l.slug}</div></div><div className="flex gap-2"><button onClick={()=>deleteLab(l.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button></div></div>))}</div></div>);
}
