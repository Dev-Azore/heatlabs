// components/Navbar.tsx - UPDATE LOGOUT FUNCTION
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Get current user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle user logout - FIXED VERSION
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Clear local state
      setUser(null)
      
      // Force hard redirect to home page - this ensures complete logout
      window.location.href = '/'
      
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback: redirect anyway
      window.location.href = '/'
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 text-slate-100 shadow-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-bold text-2xl tracking-tight bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent hover:from-amber-300 hover:to-amber-500 transition-all"
        >
          HEAT Labs
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {!loading && (
            <>
              {user ? (
                // Authenticated user links
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-400/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Guest user links - Removed as per request
                <></>
              )}
            </>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}