'use client';

/**
 * Login Page
 * ----------
 * - Authenticates user with Supabase
 * - Stores session so middleware & dashboard recognize login
 * - Redirects to /dashboard on success
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient(); // ✅ ensures cookie/session sync

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // ✅ After login → go to dashboard
      router.push('/dashboard');
      router.refresh(); // force state refresh so Navbar/Dashboard see the new user
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="bg-slate-800 p-8 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-sm flex justify-between">
          <Link href="/auth/signup" className="text-amber-400 hover:underline">
            Create an account
          </Link>
          <Link href="/auth/reset" className="text-amber-400 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
