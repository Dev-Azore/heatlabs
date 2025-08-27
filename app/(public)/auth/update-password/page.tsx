'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string|null>(null)
  const [ok, setOk] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setErr(error.message)
    else {
      setOk(true)
      setTimeout(()=>router.replace('/auth/login'), 1200)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Choose a new password</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="password" required minLength={6} placeholder="New password"
          value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded p-2"/>
        <button className="w-full rounded p-2 border">Update password</button>
        {ok && <p className="text-sm">Password updated. Redirecting…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  )
}
