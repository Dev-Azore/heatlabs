'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProtectedContent({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setOk(false)
      } else setOk(true)
    })
  }, [])
  if (ok === null) return <div className="p-6">Loading…</div>
  if (!ok) return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <p className="mb-4">You need to log in to view this content.</p>
      <button className="border rounded px-4 py-2" onClick={() => router.push('/auth/login')}>Go to Login</button>
    </div>
  )
  return <>{children}</>
}
