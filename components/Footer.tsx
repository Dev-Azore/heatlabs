'use client';

/**
 * Footer Component
 * =================
 * - Displays branding, contact info, and quick navigation links.
 * - Auth-aware: quick links differ depending on login state.
 *   - Logged OUT → Home, Login, Signup.
 *   - Logged IN  → Dashboard, Logout.
 * - Uses a 3-column grid (branding, contact info, quick links).
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Footer() {
  // State: track logged-in user
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch logged-in user on mount
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Handle logout → sign user out and redirect home
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-10">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Column 1: Branding */}
        <div>
          <h3 className="font-bold text-xl text-amber-400">HEAT Labs</h3>
          <p className="text-sm mt-2 text-slate-400">
            Empowering students through interactive learning experiences.
          </p>
        </div>

        {/* Column 2: Contact Info */}
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="text-sm mt-3 space-y-1 text-slate-400">
            <li>📍 CBT Quarters, 700102, Kano State, Nigeria</li>
            <li>📞 (+234) 07061110002, (+234) 08103214013</li>
            <li>✉️ thetechtribe2025@gmail.com</li>
          </ul>
        </div>

        {/* Column 3: Quick Links (dynamic) */}
        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="text-sm mt-3 space-y-1">
            {user ? (
              // Logged IN quick links
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-amber-400 transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Logged OUT quick links
              <>
                <li>
                  <Link href="/" className="hover:text-amber-400 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-amber-400 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-amber-400 transition">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Footer bottom note */}
      <div className="text-center text-sm text-slate-600 mt-8">
        © {new Date().getFullYear()} HEAT Labs • The Tech Tribe
      </div>
    </footer>
  );
}
