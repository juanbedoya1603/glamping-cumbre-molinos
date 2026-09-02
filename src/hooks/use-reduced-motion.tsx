import { useReducedMotion } from 'motion/react';

/**
 * Returns enter/animate/exit variants that collapse to an opacity-only
 * fade when the visitor prefers reduced motion, per motion-foundations
 * rule 3: reduced motion overrides everything.
 */
export function useSafeMotion(fullY: number = 16) {
  const reduce = useReducedMotion();
  return {
    initial: { opacity: 0, y: reduce ? 0 : fullY },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -fullY },
  };
}
