'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string|null>(null)
  const [err, setErr] = useState<string|null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setMsg(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`
    })
    if (error) setErr(error.message); else setMsg('Check your email for a reset link.')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Reset your password</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="email" required placeholder="Email address" value={email}
          onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded p-2"/>
        <button className="w-full rounded p-2 border">Send reset link</button>
        {msg && <p className="text-sm">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  )
}
