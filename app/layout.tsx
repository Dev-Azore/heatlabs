/**
 * Root layout wraps every page with ThemeProvider, Navbar, Footer.
 * Important: Navbar intentionally does NOT link to /admin to keep admin hidden.
 */
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = { title: 'HEAT Labs' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
