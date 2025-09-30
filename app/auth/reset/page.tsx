'use client';

/**
 * Reset Password Page
 * -------------------
 * - Sends reset password link to user's email
 * - Redirect not needed; Supabase email link handles reset
 */

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/ssr';
import Link from 'next/link';

export default function ResetPage() {
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Check your email.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="bg-slate-800 p-8 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <form onSubmit={handleReset} className="space-y-4">
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

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-amber-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
