'use client';

/**
 * Update Password Page
 * --------------------
 * - This page is opened when user clicks the reset link in their email
 * - User can set a new password here
 * - After success → redirect to /dashboard
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      // ✅ Redirect to dashboard after password reset
      router.push('/dashboard');
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="bg-slate-800 p-8 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Set New Password</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-slate-700 border border-slate-600"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
