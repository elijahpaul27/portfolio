import { forwardRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   SHARED: Global scroll-velocity → rotateX tilt
   ─────────────────────────────────────────────────────────
   Every motion wrapper below taps into the same page-level
   scrollY velocity to produce a subtle forward/backward
   tilt as the user scrolls. The spring smoothing gives it
   that satisfying "jelly" inertia when scrolling stops.
   ───────────────────────────────────────────────────────── */
function useScrollTilt() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Map velocity → rotation (clamped ±5°)
  const rawTilt = useTransform(scrollVelocity, [-1500, 0, 1500], [5, 0, -5]);

  // Smooth it with a spring for the "settle-back" feel
  const tilt = useSpring(rawTilt, { stiffness: 200, damping: 30, mass: 0.5 });

  return tilt;
}

/* ─────────────────────────────────────────────────────────
   Shared spring config for all hover/tap transitions
   ───────────────────────────────────────────────────────── */
const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/* ═════════════════════════════════════════════════════════
   MOTION CARD
   ─────────────────────────────────────────────────────────
   Wraps a panel / article with:
     • Scroll-velocity rotateX tilt
     • Hover: scale up, lift, intensify glow
   ═════════════════════════════════════════════════════════ */
export const MotionCard = forwardRef(function MotionCard(
  { children, glowColor = '#118AB2', className = '', ...rest },
  ref,
) {
  const tilt = useScrollTilt();

  return (
    <motion.article
      ref={ref}
      className={className}
      style={{
        rotateX: tilt,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      whileHover={{
        scale: 1.03,
        y: -5,
        boxShadow: `0 12px 40px ${glowColor}33, 0 0 30px ${glowColor}22`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
      {...rest}
    >
      {children}
    </motion.article>
  );
});

/* ═════════════════════════════════════════════════════════
   MOTION BUTTON
   ─────────────────────────────────────────────────────────
   A <motion.button> with hover lift + glow intensification
   and the scroll-velocity rotateX tilt.
   ═════════════════════════════════════════════════════════ */
export const MotionButton = forwardRef(function MotionButton(
  { children, glowColor = '#118AB2', className = '', ...rest },
  ref,
) {
  const tilt = useScrollTilt();

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{
        rotateX: tilt,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      whileHover={{
        scale: 1.05,
        y: -3,
        boxShadow: `0 6px 25px ${glowColor}44, 0 0 15px ${glowColor}33`,
      }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

/* ═════════════════════════════════════════════════════════
   MOTION NAV LINK
   ─────────────────────────────────────────────────────────
   A <motion.a> for navigation items — lighter hover effect.
   ═════════════════════════════════════════════════════════ */
export const MotionNavLink = forwardRef(function MotionNavLink(
  { children, className = '', ...rest },
  ref,
) {
  return (
    <motion.a
      ref={ref}
      className={className}
      whileHover={{
        scale: 1.08,
        y: -2,
        textShadow: '0 0 12px rgba(17, 138, 178, 0.6)',
      }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      {...rest}
    >
      {children}
    </motion.a>
  );
});

/* ═════════════════════════════════════════════════════════
   MOTION TIMELINE ENTRY
   ─────────────────────────────────────────────────────────
   Wraps each System Logs entry with the scroll tilt +
   a subtle hover lift.
   ═════════════════════════════════════════════════════════ */
export const MotionTimelineEntry = forwardRef(function MotionTimelineEntry(
  { children, className = '', ...rest },
  ref,
) {
  const tilt = useScrollTilt();

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: tilt,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      whileHover={{
        scale: 1.02,
        y: -3,
        boxShadow: '0 8px 30px rgba(17, 138, 178, 0.12)',
      }}
      transition={springTransition}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
