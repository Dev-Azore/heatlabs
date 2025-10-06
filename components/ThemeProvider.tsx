'use client';

/**
 * ThemeProvider Component
 * 
 * Purpose:
 * - Provides theme context to the entire application
 * - Manages theme state (dark/light mode)
 * - Synchronizes theme with localStorage for persistence
 * - Applies theme to document root for CSS variable inheritance
 * - Supports system preference detection
 * 
 * Features:
 * - Server-side rendering compatible
 * - Persistent theme storage
 * - System preference detection
 * - Automatic DOM class management
 * - Type-safe context implementation
 */

import { createContext, useEffect, useState, ReactNode } from 'react';

// ===========================
// TYPE DEFINITIONS
// ===========================

/**
 * Theme context type definition
 * Provides theme state and setter function to consumers
 */
interface ThemeContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  isDark: boolean;
}

/**
 * Theme provider props interface
 */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'dark' | 'light' | 'system';
}

// ===========================
// CONTEXT CREATION
// ===========================

/**
 * Theme context for consuming theme state throughout the application
 * Null initial value for proper TypeScript checking
 */
export const ThemeContext = createContext<ThemeContextType | null>(null);

// ===========================
// THEME PROVIDER COMPONENT
// ===========================

export default function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  /**
   * Theme state with intelligent initialization
   * - Checks localStorage for saved preference
   * - Falls back to system preference
   * - Defaults to dark theme for server-side rendering
   */
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    // Server-side rendering fallback
    if (typeof window === 'undefined') {
      return 'dark';
    }

    try {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('heatlabs-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }

      // Handle default theme preference
      if (defaultTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return defaultTheme;
    } catch (error) {
      // Fallback to system preference if localStorage is unavailable
      console.warn('Failed to access localStorage, using system preference:', error);
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  });

  // ===========================
  // SIDE EFFECTS
  // ===========================

  /**
   * Effect to apply theme to DOM and persist changes
   * - Adds/removes 'dark' class from document root
   * - Saves theme preference to localStorage
   * - Updates meta theme-color for mobile browsers
   */
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme class to document root
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Persist theme preference
    try {
      localStorage.setItem('heatlabs-theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        theme === 'dark' ? '#0C0D0E' : '#ffffff'
      );
    }
  }, [theme]);

  /**
   * Effect to listen for system preference changes
   * Only applies when no explicit theme is set
   */
  useEffect(() => {
    if (defaultTheme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('heatlabs-theme');
      // Only update if no explicit theme is saved
      if (!savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // Modern event listener with fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [defaultTheme]);

  // ===========================
  // CONTEXT METHODS
  // ===========================

  /**
   * Sets theme state with validation
   */
  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  /**
   * Toggles between dark and light themes
   */
  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  /**
   * Convenience property for dark theme check
   */
  const isDark = theme === 'dark';

  // ===========================
  // CONTEXT VALUE
  // ===========================

  /**
   * Context value containing theme state and methods
   */
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}