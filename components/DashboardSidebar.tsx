'use client';

/**
 * DashboardSidebar Component
 * ==========================
 * - Left-hand navigation inside the student dashboard
 * - Dynamically adjusts links based on authentication:
 *    - Logged IN  → Profile, Labs, Logout
 *    - Logged OUT → Login, Signup
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function DashboardSidebar() {
  // Track current user state
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Logout handler
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/'; // Redirect home
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-200 p-4">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      <ul className="space-y-3">
        {user ? (
          // Logged-in navigation
          <>
            <li>
              <Link href="/dashboard/profile" className="hover:text-amber-400">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/dashboard/labs" className="hover:text-amber-400">
                Labs
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 w-full text-left"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // Logged-out navigation
          <>
            <li>
              <Link href="/auth/login" className="hover:text-amber-400">
                Login
              </Link>
            </li>
            <li>
              <Link href="/auth/signup" className="hover:text-amber-400">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
