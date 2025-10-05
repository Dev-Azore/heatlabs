// app/dashboard/modules/coded/registry.ts
/** 
 * Module Registry
 * 
 * Purpose:
 * - Maps module slugs to their corresponding React components
 * - Enables dynamic loading of interactive module components
 * - Centralized registry for all coded modules
 * 
 * Updated: Added new module slugs from the updated database schema
 */

export const moduleRegistry: Record<string, () => Promise<any>> = {
  // Interactive modules from the new database structure
  'traffic-light-system': () => import('./traffic-light').then(m => m.default),
  'crop-growth-simulator': () => import('./crop-simulator').then(m => m.default),
  'human-anatomy-quiz': () => import('./anatomy-quiz').then(m => m.default),
  'math-puzzle-challenge': () => import('./math-puzzle').then(m => m.default),
  
  // Legacy module slugs (keep for backward compatibility)
  'traffic-light': () => import('./traffic-light').then(m => m.default),
  'crop-simulator': () => import('./crop-simulator').then(m => m.default),
  'anatomy-quiz': () => import('./anatomy-quiz').then(m => m.default),
  'math-puzzle': () => import('./math-puzzle').then(m => m.default)
};