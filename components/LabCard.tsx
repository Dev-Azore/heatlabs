/**
 * LabCard component
 * -----------------
 * - Displays a Lab summary card
 *
 * Modes:
 *   1. Locked (preview only) → used on Landing page
 *       - Shows 🔒
 *       - Not clickable
 *       - Prompts user to sign up
 *
 *   2. Unlocked (default) → used on Dashboard
 *       - Shows 🔬
 *       - Clickable → navigates to lab detail page
 */

import Link from 'next/link';

interface LabCardProps {
  lab: {
    id: string;
    slug?: string;
    title: string;
    description: string;
  };
  locked?: boolean; // optional flag, true = preview mode
}

export default function LabCard({ lab, locked = false }: LabCardProps) {
  /**
   * Locked mode (Landing Page)
   * --------------------------
   * - Card is grayed out
   * - No navigation
   * - Displays 🔒 icon
   * - Encourages signup
   */
  if (locked) {
    return (
      <div className="block p-4 rounded bg-slate-800 border border-slate-700 hover:shadow cursor-not-allowed opacity-75">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
            <span>🔒</span>
          </div>
          <div>
            <h3 className="font-semibold">{lab.title}</h3>
            <p className="text-slate-400 text-sm mt-1">{lab.description}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Sign up to unlock this lab →
        </p>
      </div>
    );
  }

  /**
   * Unlocked mode (Dashboard)
   * -------------------------
   * - Card is fully clickable
   * - Navigates to lab detail page
   * - Displays 🔬 icon
   *
   * ✅ Safety check:
   * If lab.slug is missing, the card will not render as a link
   */
  if (!lab.slug) {
    return (
      <div className="block p-4 rounded bg-red-900 border border-red-700 text-red-200">
        <h3 className="font-semibold">Invalid Lab</h3>
        <p className="text-sm mt-1">This lab has no slug and cannot be opened.</p>
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/labs/${lab.slug}`}
      className="block p-4 rounded bg-slate-800 hover:shadow"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
          <span>🔬</span>
        </div>
        <div>
          <h3 className="font-semibold">{lab.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{lab.description}</p>
        </div>
      </div>
    </Link>
  );
}
