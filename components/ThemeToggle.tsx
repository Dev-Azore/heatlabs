'use client';

/**
 * ThemeToggle Component
 * ======================
 * - Toggles the site theme between Dark and Light modes.
 * - Uses ThemeContext from ThemeProvider.
 * - Displays an icon + label depending on the current theme.
 */

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm transition"
    >
      {/* Conditional label */}
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
