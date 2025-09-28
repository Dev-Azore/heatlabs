/**
 * LabCard component
 * -----------------
 * - Displays a Lab summary card
 * - Two modes:
 *    1. Locked (preview) → no navigation, shows 🔒, used on Landing page
 *    2. Unlocked (default) → clickable link to lab detail, used in Dashboard
 */
import Link from 'next/link';

interface LabCardProps {
  lab: any;          // lab object from Supabase
  locked?: boolean;  // optional flag, true = preview/locked
}

export default function LabCard({ lab, locked = false }: LabCardProps) {
  if (locked) {
    // Locked mode → preview only (Landing Page)
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

  // Default mode → clickable card
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
