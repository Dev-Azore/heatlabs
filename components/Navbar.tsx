'use client';

/**
 * Navbar Component
 * =================
 * - Displays a sticky top navigation bar across the site.
 * - Auth-aware: adjusts links depending on whether the user is logged in or out.
 *   - Logged OUT → shows Login + Signup.
 *   - Logged IN  → shows Dashboard + Logout.
 * - Admin link is intentionally omitted (security by obscurity).
 * - Always shows the ThemeToggle component for dark/light mode.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  // State: track whether a user is logged in
  const [user, setUser] = useState<any>(null);

  /**
   * Effect: On mount, check for current user
   * - Uses Supabase Auth helpers
   * - Subscribes to auth state changes (login/logout)
   */
  useEffect(() => {
    // Fetch logged-in user (if any)
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    // Subscribe to login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Handle Logout:
   * - Signs user out via Supabase
   * - Clears local state
   * - Redirects back to landing page (/)
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-slate-100 shadow">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Site Branding (always visible) */}
        <Link
          href="/"
          className="font-extrabold text-xl tracking-tight text-amber-400 hover:text-amber-300 transition"
        >
          HEAT Labs
        </Link>

        {/* Right: Navigation links (dynamic based on auth state) */}
        <div className="flex items-center gap-4">
          {user ? (
            // Logged IN state → show Dashboard + Logout
            <>
              <Link
                href="/dashboard"
                className="hidden md:inline-block px-3 py-2 rounded hover:bg-slate-800 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:inline-block px-3 py-2 rounded text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // Logged OUT state → show Login + Signup
            <>
              <Link
                href="/auth/login"
                className="hidden md:inline-block px-3 py-2 rounded hover:bg-slate-800 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="hidden md:inline-block px-3 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
              >
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
