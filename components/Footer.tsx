// components/Footer.tsx
/**
 * Site footer with contact information and dynamic links
 * Shows different navigation based on authentication state
 */
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'

export default function Footer() {
  const [user, setUser] = useState<any>(null)

  // Get current user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle user logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-10">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <h3 className="font-bold text-xl text-amber-400">HEAT Labs</h3>
          <p className="text-sm mt-2 text-slate-400">
            Empowering students through interactive learning experiences.
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="text-sm mt-3 space-y-1 text-slate-400">
            <li>📍 CBT Quarters, 700102, Kano State, Nigeria</li>
            <li>📞 (+234) 07061110002, (+234) 08103214013</li>
            <li>✉️ thetechtribe2025@gmail.com</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="text-sm mt-3 space-y-1">
            {user ? (
              // Authenticated user links
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-amber-400 transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Guest user links
              <>
                <li>
                  <Link href="/" className="hover:text-amber-400 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-amber-400 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-amber-400 transition">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-sm text-slate-600 mt-8">
        © {new Date().getFullYear()} HEAT Labs • The Tech Tribe
      </div>
    </footer>
  )
}