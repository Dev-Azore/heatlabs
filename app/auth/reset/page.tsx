'use client';
/**
 * Reset Password Page
 * ===================
 * - Allows user to request a password reset email.
 * - Supabase sends reset link → link points to /auth/update-password.
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPage() {
  // Local state for form input + status
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles sending reset password email
   */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // Tell Supabase to send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for a password reset link.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      {/* Reset form */}
      <form
        onSubmit={handleReset}
        className="bg-slate-800 p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>

        {/* Show messages */}
        {error && <p className="text-red-400">{error}</p>}
        {message && <p className="text-green-400">{message}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-3 py-2 rounded bg-slate-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {/* Link back to login */}
        <p className="text-sm text-slate-400 text-center">
          Back to{' '}
          <a href="/auth/login" className="text-amber-400">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
