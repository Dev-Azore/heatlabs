// components/LogoutButton.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Force hard redirect to home page
      window.location.href = '/'
      
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback: redirect anyway
      window.location.href = '/'
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-slate-800 hover:bg-red-900/50 rounded-lg p-4 text-center transition group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-red-500/30 transition">
        <span className="text-red-400">🚪</span>
      </div>
      <span className="text-white font-medium">
        {loading ? 'Signing Out...' : 'Sign Out'}
      </span>
    </button>
  )
}