'use client'

/**
 * Login Page
 * ------------------------
 * - Authenticates existing users with email + password.
 * - Redirects to /dashboard on success.
 * - Uses Supabase context (useSupabaseClient).
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  // Local form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Handle login form submit
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh() // ✅ ensures Navbar updates immediately
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 px-6">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-amber-500 rounded font-semibold hover:bg-amber-600"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Links below form */}
        <div className="mt-4 text-sm text-slate-400 space-y-1">
          <p>
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="text-amber-400">
              Sign up
            </Link>
          </p>
          <p>
            Forgot password?{' '}
            <Link href="/auth/reset" className="text-amber-400">
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
