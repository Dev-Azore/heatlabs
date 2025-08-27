'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { logError } from '@/lib/logger'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setAllowed(false)
          router.replace('/auth/login')
          return
        }
        const { data, error } = await supabase.rpc('get_my_role')
        if (error) throw error
        setAllowed(data === 'admin' || data === 'moderator')
        if (data !== 'admin' && data !== 'moderator') {
          router.replace('/auth/login')
        }
      } catch (e: any) {
        logError('admin_guard_check_failed', { error: e?.message })
        router.replace('/auth/login')
      }
    }
    check()
    return () => { mounted = false }
  }, [router])

  if (allowed === null) return <div className="p-6">Checking permissions…</div>
  if (!allowed) return null
  return <>{children}</>
}
