import { useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';

/* ── Asset imports ── */
import starsImg from '../assets/Stars.png';
import retroBgImg from '../assets/Retro Background.jpg';
import mountainImg from '../assets/Mountain.png';
import thunderImg from '../assets/thunder.png';
import platformImg from '../assets/Platform.png';
import lineImg from '../assets/Line.png';

/* ═════════════════════════════════════════════════════════
   GLOBAL BACKGROUND PARALLAX
   ─────────────────────────────────────────────────────────
   Renders as a position:fixed backdrop behind the entire
   app. Scroll position drives parallax depth continuously
   as the user scrolls through ALL sections.
   ═════════════════════════════════════════════════════════ */
export default function BackgroundParallax() {
  const { scrollY } = useScroll();

  /*  Extended range: the user will scroll well past one
      viewport, so we map [0 → 3000px] of scroll into
      varying translateY for each depth layer.
      Deeper layers move less, foreground moves more. */
  const yStars    = useTransform(scrollY, [0, 3000], [0, 150]);    // 0.05
  const yRetro    = useTransform(scrollY, [0, 3000], [0, 300]);    // 0.10
  const yMountain = useTransform(scrollY, [0, 3000], [0, 600]);    // 0.20
  const yThunder  = useTransform(scrollY, [0, 3000], [0, 600]);    // 0.20
  const yPlatform = useTransform(scrollY, [0, 3000], [0, 1200]);   // 0.40
  const yLine     = useTransform(scrollY, [0, 3000], [0, 1200]);   // 0.40

  /* Overall scene fades out as user scrolls deeper, so the
     dark #081018 base naturally takes over. */
  const sceneOpacity = useTransform(scrollY, [0, 1800, 3000], [1, 0.5, 0.15]);

  /* ── Lightning flicker ── */
  const [lightningKey, setLightningKey] = useState(0);
  useEffect(() => {
    function scheduleFlicker() {
      const delay = 2500 + Math.random() * 5500;
      return setTimeout(() => {
        setLightningKey((k) => k + 1);
        timerId = scheduleFlicker();
      }, delay);
    }
    let timerId = scheduleFlicker();
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={{ opacity: sceneOpacity }}>

        {/* ─── LAYER 1: Stars ─── */}
        <motion.div className="absolute inset-0 z-[1]" style={{ y: yStars }}>
          <img
            src={starsImg}
            alt=""
            className="w-full h-full object-cover will-change-transform"
            style={{ animation: 'starTwinkle 4s ease-in-out infinite alternate' }}
          />
        </motion.div>

        {/* ─── LAYER 2: Retro Background ─── */}
        <motion.div className="absolute inset-0 z-[2]" style={{ y: yRetro }}>
          <img
            src={retroBgImg}
            alt=""
            className="w-full h-full object-cover will-change-transform"
          />
        </motion.div>

        {/* ─── LAYER 3: Mountain ─── */}
        <motion.div className="absolute bottom-0 left-0 right-0 z-[3]" style={{ y: yMountain }}>
          <img
            src={mountainImg}
            alt=""
            className="w-full h-auto object-cover object-bottom will-change-transform"
          />
        </motion.div>

        {/* ─── LAYER 4: Thunder / Lightning ─── */}
        <motion.div
          key={lightningKey}
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{ y: yThunder }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.2, 1, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={thunderImg}
            alt=""
            className="w-full h-full object-cover will-change-transform"
          />
        </motion.div>

        {/* ─── LAYER 5: Platform ─── */}
        <motion.div className="absolute bottom-0 left-0 right-0 z-[5]" style={{ y: yPlatform }}>
          <img
            src={platformImg}
            alt=""
            className="w-full h-auto object-cover object-bottom will-change-transform"
          />
        </motion.div>

        {/* ─── LAYER 6: Neon Line ─── */}
        <motion.div className="absolute bottom-0 left-0 right-0 z-[6]" style={{ y: yLine }}>
          <img
            src={lineImg}
            alt=""
            className="w-full h-auto object-cover object-bottom will-change-transform"
            style={{ filter: 'drop-shadow(0 0 10px #FF7F50) drop-shadow(0 0 25px rgba(255,127,80,0.4))' }}
          />
        </motion.div>

      </motion.div>
    </div>
  );
}
