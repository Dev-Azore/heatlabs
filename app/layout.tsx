/**
 * Root Layout
 * =============
 * - Wraps all pages with global UI elements:
 *   - SupabaseProvider → provides auth + session context across the app.
 *   - ThemeProvider → enables light/dark mode.
 *   - Navbar → top navigation (auth-aware).
 *   - Footer → bottom site info.
 * - Applies global Tailwind styles (globals.css).
 */

import './globals.css'
import SupabaseProvider from '@/providers/SupabaseProvider'
import ThemeProvider from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'HEAT Labs',
  description: 'Interactive learning in Health, Education, Agriculture, Technology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        {/* ✅ SupabaseProvider must wrap everything so useSession/useSupabaseClient work */}
        <SupabaseProvider>
          {/* ✅ ThemeProvider enables dark/light mode toggle */}
          <ThemeProvider>
            {/* Global Navbar (always visible, auth-aware) */}
            <Navbar />

            {/* Dynamic page content */}
            <main className="min-h-screen">{children}</main>

            {/* Global Footer */}
            <Footer />
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
