// components/Navbar.tsx
/**
 * Main Navigation Bar Component
 * 
 * Purpose:
 * - Global navigation component displayed on all pages
 * - Provides brand identity and theme toggle functionality
 * - Clean, minimalist design for optimal responsiveness
 * - No authentication-dependent links to avoid duplication
 * 
 * Features:
 * - Responsive design for mobile and desktop
 * - Sticky positioning for constant accessibility
 * - Brand logo with link to homepage
 * - Theme toggle for user preference
 * - No navigation links to prevent conflicts with dashboard sidebar
 * 
 * Design Principles:
 * - Minimalist approach for better performance
 * - Consistent branding across all pages
 * - No authentication state management for simplicity
 * - Compatible with dashboard's existing navigation
 * 
 * Responsive Behavior:
 * - Clean layout on all screen sizes
 * - Proper spacing and sizing adjustments
 * - No overlapping elements on mobile devices
 */

'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    /**
     * Main Navigation Container
     * 
     * Styling Details:
     * - sticky: Maintains position at top during scroll
     * - top-0: Positions at viewport top edge
     * - z-50: High z-index to stay above page content
     * - bg-[#1A1D21]: Primary dark background from design system
     * - backdrop-blur-lg: Modern glassmorphism effect
     * - border-b: Visual separation from content
     * - border-[#2D3138]: Consistent border color
     * - text-white: High contrast text for readability
     * - shadow-xl: Subtle depth for visual hierarchy
     */
    <nav className="sticky top-0 z-50 bg-[#1A1D21] backdrop-blur-lg border-b border-[#2D3138] text-white shadow-xl">
      
      {/**
       * Content Wrapper Container
       * 
       * Layout Details:
       * - container: Responsive max-width container
       * - mx-auto: Horizontal centering
       * - px-6: Comfortable horizontal padding
       * - py-4: Adequate vertical padding
       * - flex: Flexbox for flexible layout
       * - items-center: Vertical alignment
       * - justify-between: Logo left, controls right
       */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/**
         * Brand Logo Section
         * 
         * Functionality:
         * - Primary brand identifier
         * - Links to homepage for navigation
         * - Consistent across all application states
         * 
         * Styling Details:
         * - font-bold: Strong typographic presence
         * - text-2xl: Appropriate brand size
         * - tracking-tight: Optimized letter spacing
         * - text-[#8BB3FF]: Brand primary color
         * - hover:text-[#A3C4FF]: Interactive hover state
         * - transition-all: Smooth color transition
         * - duration-200: Appropriate transition speed
         */}
        <Link
          href="/"
          className="font-bold text-2xl tracking-tight text-[#8BB3FF] hover:text-[#A3C4FF] transition-all duration-200"
        >
          HEAT Labs
        </Link>

        {/**
         * Right Side Controls Container
         * 
         * Purpose:
         * - Houses global application controls
         * - Currently contains only theme toggle
         * - Designed for easy future expansion
         * 
         * Styling Details:
         * - flex: Horizontal layout for controls
         * - items-center: Vertical centering
         * - gap-6: Consistent spacing between items
         */}
        <div className="flex items-center gap-6">
          
          {/**
           * Theme Toggle Component
           * 
           * Features:
           * - Allows light/dark theme switching
           * - Maintains user preference persistently
           * - Accessible and keyboard-navigable
           * - Visual feedback for current state
           * 
           * Integration:
           * - Self-contained functionality
           * - No external dependencies
           * - Consistent with design system
           */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}