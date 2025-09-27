'use client';
/** Navbar - intentionally hides admin link to keep admin area unadvertised */
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/"><a className="font-bold text-lg">HEAT Labs</a></Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard"><a className="hidden md:inline-block">Dashboard</a></Link>
          {/* Admin route exists at /admin but is intentionally not linked here */}
          <Link href="/auth/login"><a className="hidden md:inline-block">Sign in</a></Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
