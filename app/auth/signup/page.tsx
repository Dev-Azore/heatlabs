'use client'

/**
 * Signup Page
 * ------------------------
 * - Creates a new user with email + password.
 * - On success → does NOT auto-login (security).
 * - Instead → redirects to /auth/login so user must log in.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'

export default function SignupPage() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      // ✅ force user to log in after signup
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 px-6">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        <form onSubmit={handleSignup} className="space-y-4">
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-sm text-slate-400 space-y-1">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
