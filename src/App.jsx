import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import BackgroundParallax from './components/BackgroundParallax';
import {
  MotionCard,
  MotionButton,
  MotionNavLink,
  MotionTimelineEntry,
} from './components/MotionWrappers';

import profileImg from './assets/Profile.png';
import dataAnalyticsCert from './assets/Certificates/Data_Analytics_Essentials_certificate_elijahpaulalino27-gmail-com_ab825857-ccfb-4989-b6ae-ac1d57383b83.pdf';
import ccnaWirelessCert from './assets/Certificates/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_elijahpaulalino27-gmail-com_a508c82d-e946-441d-99df-59e7c20fca2c.pdf';
import ccnaIntroCert from './assets/Certificates/CCNA-_Introduction_to_Networks_certificate_elijahpaulalino27-gmail-com_b7969ffa-786f-4608-a479-32b505c96081.pdf';

/* ──────────────────────────────────────────────
   Credential Item Sub-Component
   ────────────────────────────────────────────── */
function CredentialItem({ name, date, certId, pdfLink, credlyLink, isNew }) {
  return (
    <li className="flex flex-col gap-2 p-3 border border-border/50 relative overflow-hidden" style={{ backgroundColor: 'rgba(8, 16, 24, 0.4)' }}>
      <div className="flex justify-between items-start gap-2">
        <h4 className="text-text-primary text-[12px] font-bold leading-snug">
          {name}
        </h4>
        {isNew && <span className="retro-badge text-gold border-gold text-[8px] flex-shrink-0">NEW</span>}
      </div>

      <div className="flex flex-col gap-1 text-[10px] font-fira text-text-dim">
        <div className="flex items-center gap-2">
          <span className="text-teal">DATE:</span> {date}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-coral">ID:</span> <span className="tracking-widest">{certId}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <MotionButton
          glowColor="#118AB2"
          className="retro-btn retro-btn-teal flex items-center justify-center py-1.5 px-3 text-[9px] flex-grow"
          onClick={() => window.open(pdfLink, '_blank', 'noopener,noreferrer')}
          title="View Local PDF"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          LOCAL PDF
        </MotionButton>
        <MotionButton
          glowColor="#FFD166"
          className="retro-btn retro-btn-gold flex items-center justify-center py-1.5 px-3 text-[9px] flex-grow"
          onClick={() => window.open(credlyLink, '_blank', 'noopener,noreferrer')}
          title="Verify on Credly"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          CREDLY
        </MotionButton>
      </div>
    </li>
  );
}

/* ──────────────────────────────────────────────
   Tiny helper: fake "typing" animation for the
   terminal boot-up sequence.
   ────────────────────────────────────────────── */
function useTypedLines(lines, msPerLine = 400) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= lines.length) return;
    const id = setTimeout(() => setVisible((v) => v + 1), msPerLine);
    return () => clearTimeout(id);
  }, [visible, lines.length, msPerLine]);
  return lines.slice(0, visible);
}

/* ──────────────────────────────────────────────
   Status indicator pip
   ────────────────────────────────────────────── */
function StatusDot({ color = 'mint' }) {
  return <span className={`status-dot status-dot-${color} mr-2`} />;
}

/* ──────────────────────────────────────────────
   Reusable panel header
   ────────────────────────────────────────────── */
function PanelHeader({ label, color = 'var(--color-teal)', children }) {
  return (
    <div className="retro-header" style={{ borderBottomColor: color }}>
      <span
        className="inline-block w-2 h-2"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span style={{ color }}>{label}</span>
      {children}
    </div>
  );
}

/* ==============================================================
   MAIN APP COMPONENT
   ============================================================== */
export default function App() {
  /* ── Flowise Chat Interface State ── */
  const [chatHistory, setChatHistory] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const chatScrollRef = useRef(null);

  /* ── Auto-scroll to bottom of chat ── */
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTransmitting]);

  /* ── Handle Terminal Input Submission ── */
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isTransmitting) return;

    const userMessage = inputQuery.trim();
    setInputQuery('');
    setChatHistory(prev => [...prev, { role: 'USER', text: userMessage }]);
    setIsTransmitting(true);

    try {
      const response = await fetch(
        `https://cloud.flowiseai.com/api/v1/prediction/${import.meta.env.VITE_FLOWISE_CHATFLOW_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userMessage }),
        }
      );

      if (!response.ok) throw new Error('Uplink handshake failed.');

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'UPLINK', text: data.text }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'SYSTEM', text: `[ERROR]: ${error.message}` }]);
    } finally {
      setIsTransmitting(false);
    }
  };

  /* ── Mobile detection to disable GPU-heavy scroll animations ── */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ── Scroll-driven hero content opacity (desktop only) ── */
  const { scrollY } = useScroll();
  const heroOpacityRaw = useTransform(scrollY, [0, 600], [1, 0]);
  const heroYRaw = useTransform(scrollY, [0, 600], [0, 80]);
  // On mobile, pin to static values — no per-frame recomposite
  const heroOpacity = isMobile ? 1 : heroOpacityRaw;
  const heroY = isMobile ? 0 : heroYRaw;

  /* ── Terminal boot-up lines ── */
  const terminalLines = useTypedLines(
    [
      { text: 'UPLINK v3.1.7 // SECURE CHANNEL', dim: true },
      { text: '[OK] Neural-language processor initialized.', dim: false },
      { text: '[OK] Knowledge base loaded — 2,048 vectors.', dim: false },
      { text: '[OK] Flowise endpoint handshake complete.', dim: false },
      { text: '', dim: true },
      { text: 'SYSTEM READY. Awaiting operator query...', dim: false },
    ],
    500,
  );

  /* ── Certifications data ── */
  const certs = [
    {
      name: 'Data Analytics Essentials — Cisco',
      date: '20 Jun 2026',
      certId: 'ab825857-ccfb-4989-b6ae-ac1d57383b83',
      pdfLink: dataAnalyticsCert,
      credlyLink: 'https://www.credly.com/badges/88ebbf92-d8dd-4c57-ad51-56d27188636a',
      isNew: true
    },
    {
      name: 'CCNA: Switching, Routing, and Wireless Essentials',
      date: '02 Jan 2025',
      certId: 'a508c82d-e946-441d-99df-59e7c20fca2c',
      pdfLink: ccnaWirelessCert,
      credlyLink: 'https://www.credly.com/badges/baa4c882-23ed-469e-807b-672d8abc41c2',
      isNew: false
    },
    {
      name: 'CCNA: Introduction to Networks',
      date: '06 Jul 2024',
      certId: '67969ffa-786f-4608-a479-32b505c96081',
      pdfLink: ccnaIntroCert,
      credlyLink: 'https://www.credly.com/badges/252e915f-a633-40e8-8f3e-0ee1e068b36c',
      isNew: false
    },
  ];

  /* ────────────────────────────────
     RENDER
     ──────────────────────────────── */
  return (
    <>
      {/* CRT overlay scanlines + vignette */}
      <div className="crt-overlay" />
      <div className="vignette" />

      {/* ═══════════════════════════════════════════
          GLOBAL PARALLAX BACKGROUND (fixed, behind everything)
          ═══════════════════════════════════════════ */}
      <BackgroundParallax />

      {/* ═══════════════════════════════════════════
          FIXED TOP CONTROL BAR
          ═══════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 transform-gpu backface-hidden">
        <div className="max-w-6xl mx-auto px-2 md:px-4 py-2 md:py-3">
          <div
            className="retro-panel flex items-center justify-between px-3 py-2 md:px-4 md:py-3 gap-2 md:gap-3"
            style={{
              backgroundColor: 'rgba(5, 11, 20, 0.97)',
            }}
          >
            {/* Left — Branding */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="md:w-8 md:h-8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="1" y="1" width="30" height="30" stroke="#118AB2" strokeWidth="2" />
                <circle cx="16" cy="16" r="5" fill="#118AB2" />
                <line x1="16" y1="1" x2="16" y2="11" stroke="#118AB2" strokeWidth="2" />
                <line x1="16" y1="21" x2="16" y2="31" stroke="#118AB2" strokeWidth="2" />
                <line x1="1" y1="16" x2="11" y2="16" stroke="#118AB2" strokeWidth="2" />
                <line x1="21" y1="16" x2="31" y2="16" stroke="#118AB2" strokeWidth="2" />
              </svg>
              <span className="text-coral font-bold text-sm md:text-base tracking-[0.25em] uppercase text-glow-teal hidden sm:inline">
                ELIJAHSYS
              </span>
            </div>

            {/* Center — Navigation (Compact Grid on Mobile) */}
            <nav id="main-nav" className="grid grid-cols-4 w-full md:w-auto md:flex gap-1 md:gap-2 flex-grow md:flex-grow-0 md:justify-center">
              <MotionNavLink href="#about" className="retro-nav-link min-h-[44px] flex items-center justify-center text-[10px] md:text-xs">About</MotionNavLink>
              <MotionNavLink href="#databanks" className="retro-nav-link min-h-[44px] flex items-center justify-center text-[10px] md:text-xs">Data</MotionNavLink>
              <MotionNavLink href="#credentials" className="retro-nav-link min-h-[44px] flex items-center justify-center text-[10px] md:text-xs">Creds</MotionNavLink>
              <MotionNavLink href="#uplink" className="retro-nav-link min-h-[44px] flex items-center justify-center text-[10px] md:text-xs">Uplink</MotionNavLink>
            </nav>

            {/* Right — Digital Readout (Hidden on Mobile) */}
            <div id="contact-readout" className="hidden md:flex flex-col items-end text-[11px] font-fira tracking-wider flex-shrink-0">
              <span className="text-text-muted">
                <span className="text-coral">PHONE NO.</span> +63 9978646706
              </span>
              <span className="text-text-muted">
                <span className="text-coral">EMAIL</span> elijahpaulalino27@gmail.com
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          MAIN SCROLLABLE CONTENT
          No 3D perspective on mobile to prevent GPU repaint blur
          ═══════════════════════════════════════════ */}
      <div className="relative z-10 w-full overflow-x-hidden">

        {/* ─── HERO / ABOUT SECTION ─── */}
        <section id="about" className="relative w-full min-h-0 md:min-h-[calc(100dvh-4rem)] flex flex-col justify-center pt-20 md:pt-24 pb-8 md:pb-12">
          <motion.div
            className="max-w-5xl w-full mx-auto px-4"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <div
              className="retro-panel flex flex-col md:grid md:grid-cols-[260px_1fr] overflow-visible transform-gpu antialiased [text-rendering:optimizeLegibility]"
              style={{
                backgroundColor: '#050b14',
              }}
            >
              {/* Left — Avatar Zone */}
              <div className="flex flex-col items-center justify-center gap-4 p-8 border-b md:border-b-0 md:border-r-2 border-border">
                <div
                  className="w-36 h-48 border-2 border-teal flex items-center justify-center relative overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(17,138,178,0.2), inset 0 0 40px rgba(17,138,178,0.05)' }}
                >
                  <img src={profileImg} alt="Avatar" className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-[1.1] sepia-[0.2] hue-rotate-[160deg] opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-b from-base-light to-base opacity-40 pointer-events-none" />
                  <div className="absolute bottom-2 left-0 right-0 z-20 text-center pointer-events-none">
                    <span className="text-teal text-[9px] font-fira uppercase tracking-widest bg-base/90 px-2 py-1 inline-block border border-teal/40">AUTHORIZED</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-fira tracking-widest text-text-muted">
                  <StatusDot color="mint" />
                  Status: Online
                </div>
              </div>

              {/* Right — System Objective */}
              <div className="p-5 md:p-8 flex flex-col justify-center gap-4 transform-gpu [transform:translateZ(0)] [backface-visibility:hidden] will-change-transform">
                <div>
                  <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.3em] mb-1">
                    // System Identification
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-teal text-glow-teal tracking-wide antialiased [transform:translateZ(0)] [backface-visibility:hidden]">
                    Elijah Paul P. Aliño
                  </h1>
                  <div className="text-coral font-fira text-[12px] uppercase tracking-[0.2em] mt-1">
                    IT Graduate · Software Developer · QA Specialist
                  </div>
                </div>

                <div className="h-px bg-border w-full" />

                <div className="[transform:translateZ(0)] [backface-visibility:hidden]">
                  <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.3em] mb-3">
                    // System Objective
                  </div>
                  <p className="text-text-primary leading-relaxed text-[13px] antialiased [transform:translateZ(0)] [backface-visibility:hidden]">
                    Dedicated Information Technology graduate equipped with a robust foundation in software development, enterprise networking, and quality assurance.
                  </p>
                  <p className="text-text-muted leading-relaxed text-[13px] mt-3 antialiased [transform:translateZ(0)] [backface-visibility:hidden]">
                    Eager to leverage technical adaptability and analytical problem-solving skills in a dynamic IT role to optimize system performance and contribute to scalable tech solutions.
                  </p>
                </div>

                {/* Mini status bar */}
                <div
                  className="retro-panel flex items-center justify-between px-4 py-2 text-[10px] font-fira uppercase tracking-wider mt-1"
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
          </motion.div>

          {/* Scroll-down hint (desktop only) */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center hidden md:block"
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

        {/* ═══════════════════════════════════════════
            DASHBOARD CONTENT
            Fully opaque bg — no transparency compositing on mobile
            ═══════════════════════════════════════════ */}
        <div style={{ backgroundColor: '#060e18' }}>
          <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8">

            {/* ═══════════════════════════════════════════
                DATABANKS — 3-Column Project Grid
                ═══════════════════════════════════════════ */}
            <section id="databanks">
              <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.3em] mb-3 px-1">
                // Project Databanks
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* ── Module 1: iTALA (Coral) ── */}
                <MotionCard
                  glowColor="#FF7F50"
                  className="retro-panel retro-panel-glow-coral flex flex-col"
                >
                  <PanelHeader label="Module 01 — iTALA" color="var(--color-coral)" />
                  <div className="p-5 flex flex-col flex-grow gap-4">
                    <h3 className="text-coral font-bold text-[14px] leading-snug">
                      iTALA Project: Administrative and Teacher-Oriented Grading System
                    </h3>
                    <div className="text-[11px] font-fira">
                      <span className="text-text-dim">ROLE:</span>{' '}
                      <span className="text-text-primary">Frontend & UI/UX Developer</span>
                    </div>
                    <div className="h-px bg-border" />
                    <p className="text-text-muted text-[12px] leading-relaxed flex-grow">
                      Designed complex interfaces with physical depth and tactile components, utilizing skeuomorphic and neumorphic design principles to create an intuitive grading experience for educators.
                    </p>
                    <MotionButton
                      id="btn-itala"
                      glowColor="#FF7F50"
                      className="retro-btn retro-btn-coral w-full mt-auto"
                      onClick={() => window.open('https://github.com/elijahpaul27/iTALA-App', '_blank', 'noopener,noreferrer')}
                    >
                      View Repository
                    </MotionButton>
                  </div>
                </MotionCard>

                {/* ── Module 2: IntervuAI (Teal) ── */}
                <MotionCard
                  glowColor="#118AB2"
                  className="retro-panel retro-panel-glow-teal flex flex-col"
                >
                  <PanelHeader label="Module 02 — IntervuAI" color="var(--color-teal)" />
                  <div className="p-5 flex flex-col flex-grow gap-4">
                    <h3 className="text-teal font-bold text-[14px] leading-snug">
                      IntervuAI: An AI-Powered Web-Based Coaching Platform for Job Interview Readiness
                    </h3>
                    <div className="text-[11px] font-fira">
                      <span className="text-text-dim">ROLE:</span>{' '}
                      <span className="text-text-primary">Project Manager & Backend Developer</span>
                    </div>
                    <div className="text-[11px] font-fira flex flex-wrap gap-2 mt-[-4px]">
                      {['Python', 'Flask', 'MySQL', 'HTML', 'CSS'].map((t) => (
                        <span key={t} className="retro-badge text-teal border-teal">{t}</span>
                      ))}
                    </div>
                    <div className="h-px bg-border" />
                    <p className="text-text-muted text-[12px] leading-relaxed flex-grow">
                      Directed the project lifecycle and engineered the core backend architecture, integrating AI-driven interview simulation with real-time feedback analysis.
                    </p>
                    <MotionButton
                      id="btn-intervuai"
                      glowColor="#118AB2"
                      className="retro-btn retro-btn-teal w-full mt-auto"
                      onClick={() => window.open('https://www.intervuai.online/?fbclid=IwY2xjawUGPX1wZG9mBWV4dG4DYWVtAjEwAGJyaWQRMUJENUprZFRFZWhnWWV6NldzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe33io3__036MHOk0-0ZoUzQarCQsCmDnJPmjBqtIreOTsfW8FYe-uxNoVm2U_aem_OToaYQiciO6SZDFh2igkng', '_blank', 'noopener,noreferrer')}
                    >
                      View Live Demo
                    </MotionButton>
                  </div>
                </MotionCard>

                {/* ── Module 3: Certifications (Gold) ── */}
                <MotionCard
                  id="credentials"
                  glowColor="#FFD166"
                  className="retro-panel retro-panel-glow-gold flex flex-col"
                >
                  <PanelHeader label="Module 03 — Credentials" color="var(--color-gold)">
                    <span className="retro-badge text-gold border-gold ml-auto animate-pulse">NEW</span>
                  </PanelHeader>
                  <div className="p-5 flex flex-col flex-grow gap-4">
                    <h3 className="text-gold font-bold text-[14px] leading-snug">
                      Cisco Certifications
                    </h3>
                    <div className="h-px bg-border" />
                    <ul className="flex flex-col gap-3 flex-grow overflow-y-auto">
                      {certs.map((c) => (
                        <CredentialItem key={c.certId} {...c} />
                      ))}
                    </ul>
                  </div>
                </MotionCard>

              </div>
            </section>

            {/* ═══════════════════════════════════════════
                LOWER DASHBOARD — 2-Column Desktop / Stacked Mobile
                ═══════════════════════════════════════════ */}
            <section className="flex flex-col lg:grid lg:grid-cols-[1.4fr_1fr] gap-5">

              {/* ── Left: System Logs (Timeline) ── */}
              <MotionCard
                glowColor="#118AB2"
                className="retro-panel retro-panel-glow-teal flex flex-col"
              >
                <PanelHeader label="System Logs" color="var(--color-teal)" />
                <div className="p-6 flex flex-col gap-6">

                  <MotionTimelineEntry className="timeline-entry">
                    <div className="text-text-dim text-[10px] font-fira uppercase tracking-widest mb-1">
                      June 2026
                    </div>
                    <h4 className="text-text-primary font-bold text-[13px] mb-1">
                      Graduated: Bachelor of Science in Information Technology (BSIT)
                    </h4>
                    <p className="text-text-muted text-[12px] leading-relaxed">
                      University of Cebu — Main Campus. Successfully completed the program with a strong emphasis on software development, networking, and IT systems management.
                    </p>
                  </MotionTimelineEntry>

                  <MotionTimelineEntry className="timeline-entry">
                    <div className="text-text-dim text-[10px] font-fira uppercase tracking-widest mb-1">
                      Feb — May 2026
                    </div>
                    <h4 className="text-text-primary font-bold text-[13px] mb-1">
                      Completed QA Internship at SKLoud Software Development Services
                    </h4>
                    <p className="text-text-muted text-[12px] leading-relaxed">
                      Performed rigorous quality assurance and vulnerability assessments on staging environments. Developed robust testing protocols to ensure system stability and deployment readiness across multiple product lines.
                    </p>
                  </MotionTimelineEntry>

                </div>
              </MotionCard>

              {/* ── Right: AI Support Uplink (Terminal) ── */}
              <MotionCard
                glowColor="#06D6A0"
                className="retro-panel retro-panel-glow-mint flex flex-col flowise-retro-overrides"
                id="uplink"
              >
                <PanelHeader label="AI Support Uplink" color="var(--color-mint)">
                  <StatusDot color={isTransmitting ? 'coral' : 'mint'} />
                </PanelHeader>
                <div className="terminal-container flex-grow p-4 md:p-5 flex flex-col h-[65vh] md:h-[500px] lg:h-auto min-h-[400px]">

                  {/* Chat History Display */}
                  <div
                    ref={chatScrollRef}
                    className="flex-grow overflow-y-auto relative z-10 pr-2 custom-scrollbar break-words whitespace-pre-wrap text-sm md:text-[15px] transform-gpu backface-hidden antialiased [text-rendering:optimizeLegibility]"
                    style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                  >

                    {/* Boot Logs */}
                    {terminalLines.map((line, i) => (
                      <div key={i} className={`${line.dim ? 'opacity-40' : 'opacity-90'} ${line.text === '' ? 'h-3' : 'mb-1'}`}>
                        {line.text && (
                          <>
                            <span className="text-teal mr-2">{'>'}</span>
                            {line.text}
                          </>
                        )}
                      </div>
                    ))}

                    {/* Chat Logs */}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`mt-3 ${msg.role === 'USER' ? 'text-teal' : msg.role === 'SYSTEM' ? 'text-coral' : 'text-mint'}`}>
                        <span className="opacity-50 mr-2">[{msg.role}]</span>
                        <span className={msg.role === 'USER' ? 'opacity-90' : 'opacity-100'}>{msg.text}</span>
                      </div>
                    ))}

                    {/* Loading State */}
                    {isTransmitting && (
                      <div className="mt-3 text-coral opacity-80 animate-pulse">
                        <span className="opacity-50 mr-2">[SYSTEM]</span>
                        {'> [TRANSMITTING]...'}
                      </div>
                    )}

                    {/* Spacer for bottom padding */}
                    <div className="h-4"></div>
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={handleQuerySubmit}
                    className="border-t border-mint/30 pt-3 mt-4 relative z-10 flex items-center gap-2 pb-2 md:pb-0"
                  >
                    <span className="text-teal">{'>'}</span>
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      disabled={isTransmitting || terminalLines.length < 6}
                      placeholder="enter query..."
                      className="flex-grow bg-transparent border-none outline-none text-mint placeholder:text-mint/30 font-fira disabled:opacity-50 min-h-[44px] text-base"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={isTransmitting || !inputQuery.trim() || terminalLines.length < 6}
                      className="text-mint hover:text-teal disabled:opacity-30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </form>
                </div>
              </MotionCard>

            </section>

            {/* ═══════════════════════════════════════════
                FOOTER
                ═══════════════════════════════════════════ */}
            <footer className="text-center py-8 border-t-2 border-border">
              <div className="text-text-dim text-[10px] font-fira uppercase tracking-[0.25em] mb-2">
                // End of Transmission
              </div>
              <div className="text-text-muted text-[11px] font-fira">
                © 2026 <span className="text-teal">Elijah Paul P. Aliño</span>. All systems reserved.
              </div>
              <div className="text-text-dim text-[10px] font-fira mt-2">
                This portfolio is a specialized UI/UX demonstration utilizing a retrofuturistic CRT dashboard aesthetic.
              </div>
              <div className="flex justify-center gap-4 mt-3 text-[10px] font-fira">
                <MotionNavLink className="text-text-dim hover:text-teal transition-colors uppercase" onClick={() => window.open('mailto:elijahpaulalino27@gmail.com')}>EMAIL</MotionNavLink>
                <span className="text-border">|</span>
                <MotionNavLink className="text-text-dim hover:text-teal transition-colors uppercase" onClick={() => window.open('https://github.com/elijahpaul27', '_blank', 'noopener,noreferrer')}>GITHUB</MotionNavLink>
                <span className="text-border">|</span>
                <a href="tel:+639978646706" className="text-text-dim hover:text-teal transition-colors uppercase"> 📞 (+63) 997 864 6706</a>
              </div>
            </footer>

          </div>
        </div>

      </div>
    </>
  );
}
