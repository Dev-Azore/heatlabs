/** Registry mapping module slugs to dynamic import functions. Update when adding new coded modules. */
export const moduleRegistry: Record<string, () => Promise<any>> = {
  'traffic-light': () => import('./traffic-light').then(m => m.default),
  'crop-simulator': () => import('./crop-simulator').then(m => m.default),
  'anatomy-quiz': () => import('./anatomy-quiz').then(m => m.default),
  'math-puzzle': () => import('./math-puzzle').then(m => m.default)
};
