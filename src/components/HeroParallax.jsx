import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';

/* ── Asset imports (Vite resolves these at build time) ── */
import starsImg from '../assets/Stars.png';
import retroBgImg from '../assets/Retro Background.jpg';
import mountainImg from '../assets/Mountain.png';
import thunderImg from '../assets/thunder.png';
import platformImg from '../assets/Platform.png';
import lineImg from '../assets/Line.png';

/* ─────────────────────────────────────────────────────────
   StatusDot — tiny reusable glowing pip
   ───────────────────────────────────────────────────────── */
function StatusDot({ color = 'mint' }) {
  return <span className={`status-dot status-dot-${color} mr-2`} />;
}

/* ═════════════════════════════════════════════════════════
   HERO PARALLAX COMPONENT
   ═════════════════════════════════════════════════════════ */
export default function HeroParallax() {
  const containerRef = useRef(null);

  /* ── Scroll tracking — scoped to the hero container ──
     We track the full page scroll and map it so that
     within the first 100vh of scroll distance the layers
     translate at different speeds. */
  const { scrollY } = useScroll();

  /* Each useTransform maps scrollY pixels → layer translateY.
     Slower = deeper, faster = foreground. */
  const yStars     = useTransform(scrollY, [0, 800], [0,  80]);   // 0.1
  const yRetro     = useTransform(scrollY, [0, 800], [0, 160]);   // 0.2
  const yMountain  = useTransform(scrollY, [0, 800], [0, 320]);   // 0.4
  const yThunder   = useTransform(scrollY, [0, 800], [0, 320]);   // same as mountain
  const yPlatform  = useTransform(scrollY, [0, 800], [0, 640]);   // 0.8
  const yLine      = useTransform(scrollY, [0, 800], [0, 640]);   // same as platform
  const yContent   = useTransform(scrollY, [0, 800], [0, 100]);   // ~1.0 slight

  /* Fade-out the hero content as user scrolls deeper */
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  /* ── Lightning flicker state ──
     We cycle through random intervals to trigger a
     Framer Motion animation. The key forces re-mount
     which re-fires the keyframe animation. */
  const [lightningKey, setLightningKey] = useState(0);
  useEffect(() => {
    function scheduleFlicker() {
      const delay = 2000 + Math.random() * 6000; // 2–8s between strikes
      return setTimeout(() => {
        setLightningKey((k) => k + 1);
        timerId = scheduleFlicker();
      }, delay);
    }
    let timerId = scheduleFlicker();
    return () => clearTimeout(timerId);
  }, []);

  /* ────────────────────────────────
     RENDER
     ──────────────────────────────── */
  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#081018' }}
    >
      {/* ─── LAYER 1: Stars (deepest, slowest) ─── */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{ y: yStars }}
      >
        <img
          src={starsImg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover will-change-transform"
          style={{ animation: 'starTwinkle 4s ease-in-out infinite alternate' }}
        />
      </motion.div>

      {/* ─── LAYER 2: Retro Background (horizon) ─── */}
      <motion.div
        className="absolute inset-0 z-[2]"
        style={{ y: yRetro }}
      >
        <img
          src={retroBgImg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover will-change-transform"
        />
      </motion.div>

      {/* ─── LAYER 3: Mountain (midground) ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[3]"
        style={{ y: yMountain }}
      >
        <img
          src={mountainImg}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-cover object-bottom will-change-transform"
        />
      </motion.div>

      {/* ─── LAYER 4: Thunder / Lightning (atmospheric) ─── */}
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
          aria-hidden="true"
          className="w-full h-full object-cover will-change-transform"
        />
      </motion.div>

      {/* ─── LAYER 5: Platform (foreground base, fastest) ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[5]"
        style={{ y: yPlatform }}
      >
        <img
          src={platformImg}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-cover object-bottom will-change-transform"
        />
      </motion.div>

      {/* ─── LAYER 6: Neon Line (accent glow on platform) ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[6] pointer-events-none"
        style={{ y: yLine }}
      >
        <img
          src={lineImg}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-cover object-bottom will-change-transform"
          style={{ filter: 'drop-shadow(0 0 10px #FF7F50) drop-shadow(0 0 25px rgba(255,127,80,0.4))' }}
        />
      </motion.div>

      {/* ─── LAYER 7: UI / Text Content (highest z) ─── */}
      <motion.div
        className="absolute inset-0 z-[10] flex items-center justify-center"
        style={{ y: yContent, opacity: heroOpacity }}
      >
        <div className="max-w-5xl w-full mx-auto px-4">
          <div className="retro-panel grid grid-cols-1 md:grid-cols-[260px_1fr] overflow-hidden"
            style={{
              backgroundColor: 'rgba(8, 16, 24, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Left — Avatar Zone */}
            <div className="flex flex-col items-center justify-center gap-4 p-8 border-b md:border-b-0 md:border-r-2 border-border">
              <div
                className="w-36 h-48 border-2 border-teal flex items-center justify-center relative overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(17,138,178,0.2), inset 0 0 40px rgba(17,138,178,0.05)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-base-light to-base opacity-80" />
                <div className="relative z-10 text-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-2" aria-hidden="true">
                    <circle cx="24" cy="18" r="10" stroke="#118AB2" strokeWidth="2" fill="none" />
                    <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#118AB2" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-text-dim text-[10px] font-fira uppercase tracking-widest">Profile<br />Avatar</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-fira tracking-widest text-text-muted">
                <StatusDot color="mint" />
                Status: Online
              </div>
            </div>

            {/* Right — System Objective */}
            <div className="p-8 flex flex-col justify-center gap-4">
              <div>
                <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.3em] mb-1">
                  // System Identification
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-teal text-glow-teal tracking-wide">
                  Elijah Paul P. Aliño
                </h1>
                <div className="text-coral font-fira text-[12px] uppercase tracking-[0.2em] mt-1">
                  IT Graduate · Software Developer · QA Specialist
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div>
                <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.3em] mb-3">
                  // System Objective
                </div>
                <p className="text-text-primary leading-relaxed text-[13px]">
                  Dedicated Information Technology graduate equipped with a robust foundation in software development, enterprise networking, and quality assurance.
                </p>
                <p className="text-text-muted leading-relaxed text-[13px] mt-3">
                  Eager to leverage technical adaptability and analytical problem-solving skills in a dynamic IT role to optimize system performance and contribute to scalable tech solutions.
                </p>
              </div>

              {/* Mini status bar */}
              <div className="retro-panel flex items-center justify-between px-4 py-2 text-[10px] font-fira uppercase tracking-wider mt-1"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="text-text-dim flex items-center gap-2">
                  <StatusDot color="mint" />
                  All Systems Nominal
                </span>
                <span className="text-text-dim">
                  SECTOR <span className="text-teal">7G</span> // CLEARANCE <span className="text-coral">L5</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Bottom fade gradient (eye-relief transition) ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[15] h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #081018 100%)',
        }}
      />

      {/* ─── Scroll-down hint ─── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[16] text-center"
        style={{ opacity: heroOpacity }}
      >
        <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.3em] mb-2">
          Scroll to Explore
        </div>
        <motion.div
          className="w-5 h-8 border-2 border-teal/40 mx-auto flex justify-center pt-1"
          initial={{ opacity: 0.6 }}
        >
          <motion.div
            className="w-1 h-2 bg-teal"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
