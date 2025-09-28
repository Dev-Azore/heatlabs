'use client';

/**
 * Navbar Component
 * =================
 * - Displays the site-wide navigation bar.
 * - Dynamically updates based on authentication state:
 *    - Logged OUT → shows "Login" and "Signup".
 *    - Logged IN  → shows "Dashboard" and "Logout".
 * - Intentionally does NOT link to /admin (security by obscurity).
 * - Always shows ThemeToggle.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  // Track current user state
  const [user, setUser] = useState<any>(null);

  /**
   * On mount, fetch the logged-in user
   * and subscribe to auth state changes
   */
  useEffect(() => {
    // Get current session user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Handles logout
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/'; // Redirect to home after logout
  };

  return (
    <nav className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand / Home Link */}
        <Link href="/" className="font-bold text-lg">
          HEAT Labs
        </Link>

        {/* Right-side navigation */}
        <div className="flex items-center gap-3">
          {user ? (
            // If user is logged in
            <>
              <Link href="/dashboard" className="hidden md:inline-block">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:inline-block text-red-400 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is logged out
            <>
              <Link href="/auth/login" className="hidden md:inline-block">
                Login
              </Link>
              <Link href="/auth/signup" className="hidden md:inline-block">
                Signup
              </Link>
            </>
          )}
          {/* Theme toggle (always visible) */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
