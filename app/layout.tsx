/**
 * Root Layout
 * =============
 * - Wraps all pages with global UI elements:
 *   - ThemeProvider (dark/light mode context).
 *   - Navbar (top navigation).
 *   - Footer (bottom navigation & info).
 * - Applies global Tailwind styles (globals.css).
 * - Ensures consistent structure across the site.
 */

import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'HEAT Labs',
  description: 'Interactive learning in Health, Education, Agriculture, Technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        <ThemeProvider>
          {/* Navbar at top */}
          <Navbar />

          {/* Main content (dynamic per page) */}
          <main className="min-h-screen">{children}</main>

          {/* Footer at bottom */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
