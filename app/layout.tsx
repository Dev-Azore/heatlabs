// app/layout.tsx
/**
 * Root application layout
 * Wraps all pages with necessary providers and global components
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
        {/* Supabase authentication provider */}
        <SupabaseProvider>
          {/* Theme management provider */}
          <ThemeProvider>
            {/* Global navigation */}
            <Navbar />

            {/* Main page content */}
            <main className="min-h-screen">{children}</main>

            {/* Global footer */}
            <Footer />
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}