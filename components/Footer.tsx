'use client';

/**
 * Footer Component
 * =================
 * - Displays branding, contact info, and quick links.
 * - Quick links are dynamic based on user authentication:
 *    - Logged OUT → Home, Login, Signup.
 *    - Logged IN  → Dashboard, Logout.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Footer() {
  // Track current user state
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/'; // Redirect home after logout
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
        {/* Branding */}
        <div>
          <h3 className="font-semibold text-white">HEAT Labs</h3>
          <p className="text-sm mt-2">
            Empowering students through interactive learning experiences.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="text-sm mt-2">
            Address: CBT Quarters, 700102, Kano State, Nigeria
          </p>
          <p className="text-sm mt-1">
            GSM: (+234) 07061110002, (+234) 08103214013
          </p>
          <p className="text-sm mt-1">Email: thetechtribe2025@gmail.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="text-sm mt-2 space-y-1">
            {user ? (
              // Logged IN → Dashboard + Logout
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-amber-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-400"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Logged OUT → Home + Login + Signup
              <>
                <li>
                  <Link href="/" className="hover:text-amber-400">
                    Home
                  </Link>
                </li>
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
        </div>
      </div>

      {/* Footer bottom note */}
      <div className="text-center text-sm text-slate-600 mt-6">
        © HEAT Labs • The Tech Tribe
      </div>
    </footer>
  );
}
