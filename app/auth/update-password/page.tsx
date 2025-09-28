'use client';
/**
 * Update Password Page
 * ====================
 * - User lands here after clicking reset link from email.
 * - Enter new password → update in Supabase.
 * - Redirects to dashboard after success.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function UpdatePasswordPage() {
  const router = useRouter();

  // State for new password
  const [password, setPassword] = useState('');

  // State for error + loading
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles password update
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Tell Supabase to update user’s password
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      {/* Update password form */}
      <form
        onSubmit={handleUpdate}
        className="bg-slate-800 p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Set New Password</h1>

        {/* Show error if update fails */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Password input */}
        <input
          type="password"
          placeholder="New password"
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
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
