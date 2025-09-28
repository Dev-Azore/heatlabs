'use client';
/**
 * Signup Page
 * ===========
 * - Allows new users to register with email + password.
 * - Uses Supabase Auth (signUp).
 * - After signup → redirects user to dashboard.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();

  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for handling errors and loading state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles signup form submission
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    setError(null);
    setLoading(true);

    // Call Supabase to create a new user
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      // Show error if signup fails
      setError(error.message);
    } else {
      // On success → redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      {/* Signup form */}
      <form
        onSubmit={handleSignup}
        className="bg-slate-800 p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Sign Up</h1>

        {/* Show error message if signup fails */}
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {/* Link to login page */}
        <p className="text-sm text-slate-400 text-center">
          Already have an account?{' '}
          <a href="/auth/login" className="text-amber-400">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
