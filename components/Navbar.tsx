'use client';

/**
 * Navbar Component
 * - Displays top navigation bar
 * - Intentionally hides admin link (admin login is at /admin)
 * - Includes theme toggle
 */
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand / Home Link */}
        <Link href="/" className="font-bold text-lg">
          HEAT Labs
        </Link>

        {/* Right-side navigation */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden md:inline-block">
            Dashboard
          </Link>
          {/* Admin route exists at /admin but is intentionally not linked here */}
          <Link href="/auth/login" className="hidden md:inline-block">
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
