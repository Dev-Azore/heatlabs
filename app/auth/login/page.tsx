'use client';
/**
 * Login Page
 * ==========
 * - Allows existing users to log in with email + password.
 * - On success → redirects to dashboard.
 * - Includes links to Signup + Reset Password pages.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for handling error + loading
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles login form submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    setError(null);
    setLoading(true);

    // Call Supabase Auth to sign in user
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Show error if login fails
      setError(error.message);
    } else {
      // On success → redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      {/* Login form */}
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        {/* Show error if login fails */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 rounded bg-slate-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded bg-slate-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Extra links for Signup + Reset Password */}
        <p className="text-sm text-slate-400 text-center">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-amber-400">
            Sign Up
          </a>
        </p>
        <p className="text-sm text-slate-400 text-center">
          Forgot your password?{' '}
          <a href="/auth/reset" className="text-amber-400">
            Reset Password
          </a>
        </p>
      </form>
    </div>
  );
}
