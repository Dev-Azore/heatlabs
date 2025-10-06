'use client';

/**
 * ThemeToggle Component
 * 
 * Purpose:
 * - Provides user interface for toggling between dark and light themes
 * - Displays appropriate icon and label based on current theme
 * - Offers accessible, keyboard-navigable theme switching
 * - Maintains consistent styling with HEAT Labs design system
 * 
 * Features:
 * - Accessible button with proper ARIA labels
 * - Smooth transitions and hover effects
 * - Professional iconography and labeling
 * - Responsive design
 * - Type-safe implementation
 */

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

// ===========================
// COMPONENT DEFINITION
// ===========================

export default function ThemeToggle() {
  // ===========================
  // CONTEXT CONSUMPTION
  // ===========================
  
  /**
   * Access theme context with proper error handling
   */
  const themeContext = useContext(ThemeContext);

  // ===========================
  // ERROR HANDLING
  // ===========================

  /**
   * Throw error if theme context is not available
   * This ensures component is used within ThemeProvider
   */
  if (!themeContext) {
    throw new Error('ThemeToggle must be used within a ThemeProvider');
  }

  // ===========================
  // CONTEXT DESTRUCTURING
  // ===========================

  const { theme, toggleTheme, isDark } = themeContext;

  // ===========================
  // RENDER
  // ===========================

  return (
    /**
     * Theme Toggle Button
     * 
     * Accessibility Features:
     * - aria-pressed: Indicates toggle state to screen readers
     * - aria-label: Clear description of button purpose
     * - tabIndex: Ensures keyboard accessibility
     * 
     * Styling Details:
     * - Responsive padding for touch targets
     * - Hover and focus states for interaction feedback
     * - Smooth transitions for polished experience
     * - Consistent with HEAT Labs design system
     */
    <button
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="
        /* Layout */
        inline-flex items-center justify-center
        /* Sizing */
        px-4 py-2.5
        /* Typography */
        text-sm font-medium
        /* Colors */
        bg-[#2D3138] hover:bg-[#3D424A]
        text-[#E8EAED] hover:text-white
        /* Borders */
        border border-transparent
        rounded-lg
        /* Effects */
        transition-all duration-200
        hover:border-[#8BB3FF]/20
        hover:shadow-lg
        /* Focus */
        focus:outline-none focus:ring-2 
        focus:ring-[#8BB3FF] focus:ring-opacity-50
        /* Active */
        active:scale-95
        /* Responsive */
        min-h-[44px] /* Minimum touch target size */
      "
    >
      {/**
       * Dynamic Icon and Label
       * 
       * Icon Selection:
       * - Sun (☀️) for light mode indication
       * - Moon (🌙) for dark mode indication
       * 
       * Label Logic:
       * - Shows current theme for clarity
       * - Indicates what will happen on click
       */}
      <span className="flex items-center gap-2">
        {/* Icon with smooth transition */}
        <span className="text-base transition-transform duration-200 hover:scale-110">
          {isDark ? '☀️' : '🌙'}
        </span>
        
        {/* Text label with conditional display */}
        <span className="hidden sm:inline">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
        
        {/* Mobile-only abbreviated label */}
        <span className="sm:hidden">
          {isDark ? 'Light' : 'Dark'}
        </span>
      </span>
    </button>
  );
}