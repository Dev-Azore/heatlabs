'use client'

/**
 * Navbar Component
 * =================
 * - Displays a sticky top navigation bar across the site.
 * - Auth-aware via Supabase context (useSession).
 *   - Logged OUT → shows Login + Signup.
 *   - Logged IN  → shows Dashboard + Logout.
 * - Always shows the ThemeToggle component.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  /**
   * Handle Logout:
   * - Signs user out via Supabase
   * - Redirects back to landing page (/)
   */
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-slate-100 shadow">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Site Branding (always visible) */}
        <Link
          href="/"
          className="font-extrabold text-xl tracking-tight text-amber-400 hover:text-amber-300 transition"
        >
          HEAT Labs
        </Link>

        {/* Right: Navigation links (dynamic based on auth state) */}
        <div className="flex items-center gap-4">
          {session ? (
            // Logged IN state → show Dashboard + Logout
            <>
              <Link
                href="/dashboard"
                className="hidden md:inline-block px-3 py-2 rounded hover:bg-slate-800 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:inline-block px-3 py-2 rounded text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // Logged OUT state → show Login + Signup
            <>
              <Link
                href="/auth/login"
                className="hidden md:inline-block px-3 py-2 rounded hover:bg-slate-800 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="hidden md:inline-block px-3 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
              >
                Signup
              </Link>
            </>
          )}

          {/* Theme toggle (always visible) */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
