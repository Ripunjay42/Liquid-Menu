import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Award, 
  Download, 
  Compass, 
  Bookmark, 
  Menu, 
  Instagram, 
  Mail, 
  CheckCircle2, 
  Calendar,
  ZoomIn,
  ZoomOut,
  X,
  Search
} from "lucide-react";

import { COVER_INFO, METRIC_CARDS, PHILOSOPHY, VENUES, CERTIFICATIONS, SKILLS, DIAGEO_CERTIFICATES } from "./data";
import { generatePortfolioPDF, generateCertificatesOnlyPDF } from "./utils/pdfGenerator";
import ImagePlaceholder from "./components/ImagePlaceholder";
import CocktailShowcase from "./components/CocktailShowcase";

// Reusable CountUp component with cubic-bezier easeOut
function CountUp({ end, suffix = "", duration = 1200, delay = 0 }: { end: number; suffix?: string; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasStarted(true);
      }
    }, { threshold: 0.15 });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    const timer = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [hasStarted, end, duration, delay]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

// Fade-in scroll container using standard IntersectionObserver
function ScrollFadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; key?: React.Key }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.12 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[800ms] cubic-bezier(0.25, 0.1, 0.1, 1.0) ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cover typewriter name trigger
  const [typedName, setTypedName] = useState("");
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [ruleWidth, setRuleWidth] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [blueprintZoom, setBlueprintZoom] = useState(1);

  // Download checker for custom portfolio PDF
  const handleDownloadPortfolio = async () => {
    try {
      const response = await fetch("/portfolio.pdf");
      if (response.ok) {
        const blob = await response.blob();
        // A valid PDF is always larger than 100 bytes (unlike a blank 0-byte file or text fallback)
        if (blob.size > 100) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "The_Liquid_Menu_Hemakshe_Nagaraj.pdf";
          link.click();
          window.URL.revokeObjectURL(url);
          return;
        }
      }
      // Fallback to client-side generation if the file is missing or empty (0 bytes)
      generatePortfolioPDF();
    } catch {
      generatePortfolioPDF();
    }
  };

  // Time stamp in Bengaluru (using local standard coordinates mockup)
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Force Bengaluru time
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setTypedName("");

    // Phase 1: Tagline (100ms)
    const tagTimer = setTimeout(() => {
      if (isMounted) setTaglineVisible(true);
    }, 100);

    // Phase 2: Typewriter "Hemakshe Nagaraj" (200ms start, 40ms per letter)
    const nameStr = "Hemakshe Nagaraj";
    let index = 0;
    let nameInterval: NodeJS.Timeout;
    const nameTimer = setTimeout(() => {
      if (!isMounted) return;
      nameInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(nameInterval);
          return;
        }
        if (index < nameStr.length) {
          setTypedName(nameStr.substring(0, index + 1));
          index++;
        } else {
          clearInterval(nameInterval);
        }
      }, 40);
    }, 200);

    // Phase 3: Rule draws (900ms)
    const ruleTimer = setTimeout(() => {
      if (isMounted) setRuleWidth(100);
    }, 900);

    // Phase 4: Subtitle (1100ms)
    const subTimer = setTimeout(() => {
      if (isMounted) setSubtitleVisible(true);
    }, 1100);

    // Phase 5: Quote (1400ms)
    const quoteTimer = setTimeout(() => {
      if (isMounted) setQuoteVisible(true);
    }, 1400);

    // Phase 6: Metrics counter delay (1900ms)
    const metricsTimer = setTimeout(() => {
      if (isMounted) setMetricsVisible(true);
    }, 1900);

    return () => {
      isMounted = false;
      clearTimeout(tagTimer);
      clearTimeout(nameTimer);
      if (nameInterval) clearInterval(nameInterval);
      clearTimeout(ruleTimer);
      clearTimeout(subTimer);
      clearTimeout(quoteTimer);
      clearTimeout(metricsTimer);
    };
  }, []);

  // Soft background gradient transition depending on scrolling status
  const bgGradients = [
    "radial-gradient(circle at 50% 50%, #1a0f05 0%, #0a0906 100%)", // Cover Glow
    "radial-gradient(circle at 10% 50%, #1e1b16 0%, #0a0906 100%)", // Aperitif Warmth
    "radial-gradient(circle at 90% 80%, #2a2520 0%, #0a0906 100%)"  // Ingredients Deep
  ];

  // Manual jump to specific section
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0906] text-[#e8dfc8] font-sans selection:bg-[#c9a84c] selection:text-[#0a0906]">
      
      {/* Editorial Page Background - Slow-moving ambient floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0906]" />
        
        {/* Fine gold lines across full height (Ruling Lines 40px apart) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,163,76,0.02)_1px,transparent_1px)] [background-size:100%_40px]" />
        
        {/* Soft radial moving warm speakeasy background lamps */}
        <div className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-[#6b5520] opacity-[0.03] blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#5c1a0a] opacity-[0.02] blur-[180px] pointer-events-none" />
      </div>

      {/* Modern Top Linear Progress Indicator representing "Pour Level" */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#c9a84c] z-50 origin-[0%]"
        style={{ scaleX }}
      />

      {/* Floating Header Matrix (Speakeasy Navigation Bar) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0906]/75 hover:bg-[#0a0906]/95 backdrop-blur-md border-b border-[#3a342a]/30 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs font-mono tracking-widest text-[#6b5520]">
          
          {/* Brand stamp identity */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleScrollToSection("cover-section")}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#c9a84c] group-hover:animate-ping" />
            <span className="text-[#e8dfc8] font-medium transition-colors group-hover:text-[#c9a84c]">
              H. NAGARAJ <span className="text-[#6b5520]">/ ADVO</span>
            </span>
          </div>

          {/* Location coordinates and local Clock */}
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-[#e8dfc8] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#c9a84c]" /> BENGALURU, IN
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c9a84c]" /> <span className="text-[#e8dfc8]">{time || "12:00:00"}</span>
            </span>
          </div>

          {/* Quick Menu Anchors */}
          <nav className="flex items-center gap-5">
            <button 
              onClick={() => handleScrollToSection("philosophy-section")}
              className="hover:text-[#e8dfc8] transition-colors cursor-pointer"
            >
              APERITIF
            </button>
            <button 
              onClick={() => handleScrollToSection("experience-section")}
              className="hover:text-[#e8dfc8] transition-colors cursor-pointer"
            >
              VENUE
            </button>
            <button 
              onClick={() => handleScrollToSection("signature-serves-section")}
              className="hover:text-[#e8dfc8] text-[#c9a84c] font-medium transition-colors cursor-pointer"
            >
              SERVES
            </button>
            <button 
              onClick={() => handleScrollToSection("ingredients-section")}
              className="hover:text-[#e8dfc8] transition-colors cursor-pointer"
            >
              POWER
            </button>
            <button 
              onClick={() => {
                setIsBlueprintOpen(true);
                setBlueprintZoom(1);
              }}
              className="hover:text-[#e8dfc8] border border-[#c9a84c]/40 hover:border-[#c9a84c] px-2.5 py-1 text-[10px] text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-sm transition-all cursor-pointer"
              id="header-btn-ledger"
              title="View physical mixology notebook / master menu sheet"
            >
              MENU BLUEPRINT
            </button>
          </nav>

        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — COVER (FULL VIEWPORT)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section 
        id="cover-section"
        className="relative min-h-screen flex items-center justify-center pt-16 z-10"
      >
        <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12">
          
          {/* Cover Left Column: Speakeasy copy sequential reveal */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7">
            
            {/* Tag line fade up */}
            <div className="h-5 overflow-hidden">
              {taglineVisible && (
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-mono text-[11px] text-[#6b5520] tracking-[4px] uppercase block"
                >
                  {COVER_INFO.tagline}
                </motion.span>
              )}
            </div>

            {/* Typewritten name */}
            <h1 className="font-serif font-bold italic text-5xl sm:text-6xl lg:text-7xl text-[#e8dfc8] tracking-tight leading-none min-h-[72px]">
              {typedName}
              <span className="text-[#c9a84c] animate-pulse">|</span>
            </h1>

            {/* Rule draws left to right */}
            <div className="w-full h-[1px] bg-[#3a342a] relative overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#c9a84c] transition-all duration-[600ms] ease-out"
                style={{ width: `${ruleWidth}%` }}
              />
            </div>

            {/* Role Title */}
            <div className="h-6 overflow-hidden">
              {subtitleVisible && (
                <motion.p 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-mono text-xs sm:text-sm text-[#6b5520] tracking-[2px]"
                >
                  {COVER_INFO.role}
                </motion.p>
              )}
            </div>

            {/* Quote Block left-bordered with gold rule */}
            <div className="min-h-[70px]">
              {quoteVisible && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="border-l-2 border-[#c9a84c] pl-5 space-y-1 py-1"
                >
                  <p className="font-serif italic text-base sm:text-lg text-[#e8dfc8]/70 leading-relaxed">
                    "{COVER_INFO.quote}"
                  </p>
                </motion.div>
              )}
            </div>

            {/* Credential Counters counting simultaneously */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#3a342a]/30">
              {metricsVisible ? (
                <>
                  <div className="text-left space-y-1">
                    <div className="font-serif font-bold text-3xl sm:text-4xl text-[#c9a84c] gold-glow">
                      <CountUp end={7} suffix="+" />
                    </div>
                    <div className="font-mono text-[9px] text-[#6b5520] tracking-wider uppercase">
                      Years Pro
                    </div>
                  </div>

                  <div className="text-left space-y-1 border-l border-[#3a342a]/60 pl-4">
                    <div className="font-serif font-bold text-3xl sm:text-4xl text-[#c9a84c] gold-glow">
                      <CountUp end={15} suffix="+" />
                    </div>
                    <div className="font-mono text-[9px] text-[#6b5520] tracking-wider uppercase">
                      Diageo Certs
                    </div>
                  </div>

                  <div className="text-left space-y-1 border-l border-[#3a342a]/60 pl-4">
                    <div className="font-serif font-bold text-3xl sm:text-4xl text-[#c9a84c] gold-glow">
                      <CountUp end={5} />
                    </div>
                    <div className="font-mono text-[9px] text-[#6b5520] tracking-wider uppercase">
                      Elite Venues
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-3 text-xs font-mono text-[#6b5520]/40 italic animate-pulse">
                  Pre-steeping credentials metadata...
                </div>
              )}
            </div>

            {/* Pulse scroll indicator */}
            <div className="pt-6">
              {metricsVisible && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  onClick={() => handleScrollToSection("philosophy-section")}
                  className="font-mono text-[10px] text-[#3a342a] tracking-widest uppercase hover:text-[#c9a84c] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {COVER_INFO.scrollText}
                </motion.button>
              )}
            </div>

          </div>

          {/* Cover Right Column: Portrait image framed */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] lg:aspect-[3/4] flex justify-center items-center">
            
            {/* Absolute blur backglow */}
            <div className="absolute inset-4 rounded-sm bg-[#2d0e08] opacity-30 blur-2xl z-0" />
            
            <div className="relative w-full h-full z-10 transition-transform duration-700 hover:scale-[1.02]">
              <ImagePlaceholder
                filename="1000116690.jpg"
                className="w-full h-full shadow-2xl transition-all duration-500"
                overlayText="Hemakshe Nagaraj - Pour Command"
                themeGradient="linear-gradient(135deg, #1a0f05 0%, #0a0906 100%)"
                imageSrc="/hemakshe_portrait.jpeg"
              />
              {/* Luxury Speakeasy Badge Overlay */}
              <div className="absolute top-4 right-4 bg-[#c9a84c] text-[#0a0906] font-mono text-[8px] font-bold tracking-[3px] uppercase px-2.5 py-1 rounded-[2px]" id="speakeasy-badge">
                BENGALURU ADVO
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — THE APERITIF (ABOUT)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section 
        id="philosophy-section"
        className="relative py-28 md:py-36 border-t border-[#3a342a]/30 bg-[#12100d]/90 z-10"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Stat Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {METRIC_CARDS.map((card, idx) => (
              <ScrollFadeIn key={card.label} delay={idx * 120}>
                <div className="bg-[#1e1b16] border border-[#3a342a] p-6 rounded-sm text-left hover:border-[#6b5520] transition-colors relative group">
                  <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#c9a84c]/20 group-hover:bg-[#c9a84c]" />
                  <h4 className="font-serif font-bold text-3xl text-[#c9a84c] mb-1">
                    {/* Render standard countups if they contain digits */}
                    {parseInt(card.value) ? (
                      <CountUp end={parseInt(card.value)} suffix={card.value.includes("+") ? "+" : ""} />
                    ) : (
                      card.value
                    )}
                  </h4>
                  <p className="font-mono text-[10px] text-[#e8dfc8]/60 uppercase tracking-widest leading-relaxed">
                    {card.label}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          {/* Right Column: Copy of philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollFadeIn delay={100}>
              <span className="font-mono text-[10px] text-[#6b5520] tracking-[3px] uppercase block">
                {PHILOSOPHY.tag}
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl text-[#c9a84c] mt-2 mb-4">
                {PHILOSOPHY.heading}
              </h2>
            </ScrollFadeIn>

            <ScrollFadeIn delay={200}>
              <div className="border-l-2 border-[#c9a84c] pl-5 py-1">
                <p className="font-serif italic text-lg sm:text-xl text-[#e8dfc8] leading-relaxed">
                  "{PHILOSOPHY.pullQuote}"
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={300} className="space-y-4 text-sm sm:text-base text-[#e8dfc8]/70 leading-relaxed font-sans">
              <p>{PHILOSOPHY.body1}</p>
              <p>{PHILOSOPHY.body2}</p>
            </ScrollFadeIn>

            {/* Tag Pills */}
            <ScrollFadeIn delay={400} className="pt-4">
              <div className="flex flex-wrap gap-2.5">
                {PHILOSOPHY.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="font-serif italic text-xs border border-[#c9a84c]/40 text-[#c9a84c] bg-[#1e1b16] px-4 py-1.5 rounded-full hover:bg-[#c9a84c]/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollFadeIn>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — THE HOUSE SPECIALS (EXPERIENCE)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section 
        id="experience-section"
        className="relative py-28 md:py-36 border-t border-[#3a342a]/30 bg-[#0a0906] z-10"
      >
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header Layout */}
          <div className="text-center space-y-3 mb-16">
            <span className="font-mono text-[10px] text-[#6b5520] tracking-[3px] uppercase block">
              03 — THE HOUSE SPECIALS
            </span>
            <h2 className="font-serif italic text-4xl text-[#c9a84c]">
              Locations Curated
            </h2>
            <p className="font-mono text-[11px] text-[#e8dfc8]/60 uppercase tracking-widest max-w-lg mx-auto">
              A curated selection of environments that shaped the tradecraft.
            </p>
          </div>

          {/* Venues Stacking Layout (Michelin Menu Formatting) */}
          <div className="space-y-6">
            {VENUES.map((venue, idx) => {
              return (
                <ScrollFadeIn key={venue.id} delay={idx * 150}>
                  <div
                    id={`venue-row-${venue.id}`}
                    className={`p-6 md:p-8 border-l-2 transition-all duration-500 relative overflow-hidden group ${
                      venue.recommended
                        ? "border-[#c9a84c] bg-[#1e1b16] shadow-xl border border-dashed border-[#6b5520]"
                        : "border-[#3a342a] bg-[#12100d] hover:bg-[#1e1b16]"
                    }`}
                  >
                    {/* Background glow for chef recommendation */}
                    {venue.recommended && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#c9a84c]/5 via-transparent to-transparent pointer-events-none" />
                    )}

                    {/* Corner badge for Recommended item */}
                    {venue.recommended && (
                      <div className="absolute top-3 right-4 flex items-center gap-1 bg-[#c9a84c]/20 border border-[#c9a84c]/40 px-2 py-0.5 rounded-[2px]" id="chef-recommend-badge">
                        <Sparkles className="w-2.5 h-2.5 text-[#c9a84c]" />
                        <span className="font-mono text-[7px] text-[#c9a84c] tracking-widest uppercase">
                          CHEF RECOMMENDATION
                        </span>
                      </div>
                    )}

                    {/* Flex Container for details */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                      
                      {/* Left Block */}
                      <div className="space-y-2 max-w-xl">
                        <div className="flex flex-wrap items-baseline gap-2.5">
                          <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#e8dfc8] group-hover:text-[#c9a84c] transition-colors">
                            {venue.name}
                          </h4>
                          <span className="font-mono text-[10px] text-[#6b5520] tracking-widest uppercase">
                            · {venue.role}
                          </span>
                        </div>

                        <p className="font-sans text-xs sm:text-sm text-[#e8dfc8]/70 leading-relaxed font-light">
                          {venue.description}
                        </p>
                      </div>

                      {/* Right Block: Tags */}
                      <div className="flex flex-wrap md:flex-col gap-2 items-end md:shrink-0">
                        <span className="hidden md:inline-block font-mono text-[8px] text-[#6b5520] tracking-widest uppercase">
                          CRAFT MATRIX:
                        </span>
                        {venue.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="font-mono text-[9px] text-[#c9a84c] bg-[#0a0906]/60 border border-[#3a342a] px-2.5 py-1 rounded-[2px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Menu rule below */}
                    <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-[#3a342a]/40" />

                  </div>
                </ScrollFadeIn>
              );
            })}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — THE SIGNATURE SERVES (STICKY DRINKS COCKTAIL BREAKDOWN)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="drinks-section">
        <CocktailShowcase />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — THE INGREDIENTS (CERTIFICATIONS & COMPETENCIES)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section 
        id="ingredients-section"
        className="relative py-28 md:py-36 border-t border-[#3a342a]/30 bg-[#12100d]/90 z-10"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Diageo Academy Waterfall & Modules */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="font-mono text-[10px] text-[#6b5520] tracking-[3px] uppercase block">
                05 — THE INGREDIENTS
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl text-[#c9a84c] mt-2">
                Hard Power & Credentials
              </h2>
              <p className="font-mono text-[10px] text-[#e8dfc8]/60 uppercase tracking-widest mt-2 leading-relaxed">
                15+ intensive modules completed via the Diageo Bar Academy. Raw knowledge designed for trade advocacy.
              </p>
            </div>

            {/* Certification Waterfall List wrapper */}
            <div className="bg-[#0a0906]/60 border border-[#3a342a] p-6 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c9a84c]" />
              
              <div className="font-mono text-[9px] text-[#6b5520] tracking-[2px] uppercase mb-4 border-b border-[#3a342a]/60 pb-3 flex items-center justify-between">
                <span>DIAGEO BAR ACADEMY CURRICULUM</span>
                <span className="text-[#c9a84c] font-black">★ VERIFIED</span>
              </div>

              {/* Waterfall Pills Grid */}
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((cert) => (
                  <span 
                    key={cert.name}
                    className={`font-sans text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-300 rounded-[2px] ${
                      cert.highlighted
                        ? "border-[#c9a84c] text-[#e8dfc8] bg-[#c9a84c]/20 font-medium"
                        : "border-[#3a342a]/70 text-[#e8dfc8]/60 hover:text-[#e8dfc8] hover:border-[#6b5520] bg-black/30"
                    }`}
                  >
                    {cert.name}
                  </span>
                ))}
              </div>

              {/* Spectacular Badge Indicator */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#3a342a]/60">
                <div className="font-serif font-bold text-6xl text-[#c9a84c] tracking-tighter" id="dba-modules-count">
                  15
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#e8dfc8] tracking-[3px] uppercase font-bold">
                    Modules Cleared
                  </div>
                  <div className="font-mono text-[8px] text-[#6b5520] tracking-[2px] uppercase mt-0.5">
                    DIAGEO BAR ACADEMY VERIFIED ID: HN-9610
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Skills Progress Bars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-[#3a342a]/60 pb-4">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#e8dfc8]">
                Mixologist competency model
              </h3>
              <p className="font-sans text-xs text-[#6b5520]/80 tracking-wide mt-1">
                Representing trade-execution velocity and strategic marketing integration coordinates:
              </p>
            </div>

            {/* Core Competencies Bars */}
            <div className="space-y-7">
              {SKILLS.map((skill, idx) => {
                return (
                  <ScrollFadeIn key={skill.name} delay={idx * 100}>
                    <div className="space-y-1.5" id={`skill-container-${skill.name.toLowerCase().replace(" ", "-")}`}>
                      
                      <div className="flex items-baseline justify-between font-mono text-[11px] tracking-wider text-[#e8dfc8]">
                        <span className="font-medium text-amber-100/90">{skill.name}</span>
                        <span className="text-[#c9a84c] font-bold">{skill.percentage}%</span>
                      </div>

                      {/* Bar and Track element */}
                      <div className="h-[2.5px] bg-[#3a342a]/50 w-full relative rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.1, 1.0] }}
                          className="absolute left-0 top-0 h-full bg-[#c9a84c]"
                        />
                      </div>

                    </div>
                  </ScrollFadeIn>
                );
              })}
            </div>

          </div>

          {/* Diageo Bar Academy Certificates of Completion Shelf (Full Width) */}
          <div className="col-span-full mt-20 pt-16 border-t border-[#3a342a]/40 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] text-[#6b5520] tracking-[3px] uppercase block">
                  CRAFT ENDORSEMENTS
                </span>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#e8dfc8] mt-1">
                  Verified Bar Academy Certificates
                </h3>
                <p className="font-sans text-xs text-[#e8dfc8]/50 mt-1 max-w-xl">
                  These certifications represent specialized courses completed via the Diageo Bar Academy. Click download on any certificate card to generate and download its single-page PDF, or download the full verified bundle.
                </p>
              </div>

              {/* Master download trigger for certificates pack */}
              <button
                onClick={generateCertificatesOnlyPDF}
                className="font-mono text-[10px] uppercase tracking-[2px] text-[#c9a84c] border border-[#c9a84c]/50 hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all duration-300 px-5 py-2.5 rounded-sm flex items-center gap-2 self-start md:self-auto cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Certificates (PDF)
              </button>
            </div>

            {/* Interactive Grid of Certificates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {DIAGEO_CERTIFICATES.map((cert, index) => {
                return (
                  <motion.div 
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-black/40 border border-[#3a342a] p-5 hover:border-[#c9a84c]/50 transition-all duration-300 rounded-sm relative flex flex-col justify-between h-56 group overflow-hidden"
                  >
                    {/* Top burgundy tiny indicator */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8B0A1A]" />

                    {/* Top Header */}
                    <div className="space-y-1">
                      <span className="font-mono text-[8px] text-[#c9a84c] tracking-widest uppercase block">
                        {cert.type}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#e8dfc8]/90 group-hover:text-[#c9a84c] transition-colors leading-snug">
                        {cert.title}
                      </h4>
                    </div>

                    {/* Bottom Segment */}
                    <div className="pt-4 border-t border-[#3a342a]/40 flex items-end justify-between mt-auto">
                      <div className="space-y-0.5">
                        <div className="font-mono text-[9px] text-[#e8dfc8]/40 uppercase tracking-wider block">
                          COMPLETED: {cert.date}
                        </div>
                        <div className="font-mono text-[8px] text-[#6b5520] tracking-wider block">
                          {cert.verificationId}
                        </div>
                      </div>

                      {/* Direct Single Certificate Download click */}
                      <button
                        onClick={() => {
                          const doc = new jsPDF({
                            orientation: "portrait",
                            unit: "mm",
                            format: "a4"
                          });
                          
                          const PAGE_WIDTH = 210;
                          const PAGE_HEIGHT = 297;
                          
                          // Draw burgundy borders
                          doc.setFillColor(139, 10, 26); // Deep Burgundy (#8B0A1A)
                          doc.rect(0, 0, PAGE_WIDTH, 5, "F");
                          doc.rect(0, PAGE_HEIGHT - 5, PAGE_WIDTH, 5, "F");

                          // Logo Header
                          doc.setFont("Helvetica", "normal");
                          doc.setFontSize(10);
                          doc.setTextColor("#4a4135"); // Charcoal dark
                          doc.text("............................ DIAGEO ............................ ", PAGE_WIDTH / 2, 34, { align: "center" });

                          doc.setFont("Helvetica", "bold");
                          doc.setFontSize(26);
                          doc.text("BAR ACADEMY", PAGE_WIDTH / 2, 47, { align: "center" });

                          doc.setFont("Helvetica", "normal");
                          doc.setFontSize(10);
                          doc.text("........................................................................", PAGE_WIDTH / 2, 53, { align: "center" });

                          doc.setFont("Helvetica", "normal");
                          doc.setFontSize(8.5);
                          doc.text("R A I S E   T H E   B A R", PAGE_WIDTH / 2, 60, { align: "center" });

                          // Certificate of Completion Main Title
                          doc.setFont("Helvetica", "bold");
                          doc.setFontSize(32);
                          doc.setTextColor("#111111");
                          doc.text("CERTIFICATE", PAGE_WIDTH / 2, 88, { align: "center" });
                          doc.text("OF COMPLETION", PAGE_WIDTH / 2, 104, { align: "center" });

                          // Acknowledgement and Recipient
                          doc.setFont("Helvetica", "bold");
                          doc.setFontSize(10.5);
                          doc.setTextColor("#444444");
                          doc.text("THIS IS TO ACKNOWLEDGE", PAGE_WIDTH / 2, 126, { align: "center" });

                          doc.setFont("Times", "italic");
                          doc.setFontSize(20);
                          doc.setTextColor("#1a150e");
                          doc.text("Hemakshe Nagaraj", PAGE_WIDTH / 2, 144, { align: "center" });

                          doc.setFont("Helvetica", "bold");
                          doc.setFontSize(10.5);
                          doc.setTextColor("#444444");
                          
                          if (cert.isOnlineCourse) {
                            doc.text("HAS SUCCESSFULLY COMPLETED", PAGE_WIDTH / 2, 163, { align: "center" });
                            doc.text("THE ONLINE COURSE", PAGE_WIDTH / 2, 171, { align: "center" });

                            // Certificate Course Title (Elegant serif italic)
                            doc.setFont("Times", "italic");
                            doc.setFontSize(22);
                            doc.setTextColor("#c9a84c"); // Gold
                            doc.text(cert.title, PAGE_WIDTH / 2, 194, { align: "center" });
                            
                            // Line art glasses drawing mimicking original icon on page 3
                            const iconY = PAGE_HEIGHT - 43;
                            doc.setDrawColor("#4a4135");
                            doc.setLineWidth(0.35);
                            
                            // Draw shaker (slanted lines)
                            doc.line(78, iconY, 81, iconY + 12);
                            doc.line(86, iconY, 83, iconY + 12);
                            doc.line(78, iconY, 86, iconY);
                            doc.line(81, iconY + 12, 83, iconY + 12);
                            
                            // Draw cocktail coupe
                            doc.line(94, iconY, 104, iconY); // rim
                            doc.line(94, iconY, 99, iconY + 6); // left bowl
                            doc.line(104, iconY, 99, iconY + 6); // right bowl
                            doc.line(99, iconY + 6, 99, iconY + 12); // stem
                            doc.line(96, iconY + 12, 102, iconY + 12); // base

                            // Draw circular smile face shaker symbol
                            doc.circle(113, iconY + 6, 4);
                            doc.line(111.5, iconY + 5, 112.5, iconY + 5); // left eye
                            doc.line(113.5, iconY + 5, 114.5, iconY + 5); // right eye
                            doc.line(111.5, iconY + 7.5, 114.5, iconY + 7.5); // smile line

                            // Draw dual bottles outline
                            doc.line(125, iconY, 125, iconY + 12);
                            doc.line(129, iconY, 129, iconY + 12);
                            doc.line(125, iconY, 129, iconY);
                            doc.line(125, iconY + 12, 129, iconY + 12);
                          } else {
                            doc.text("HAS SUCCESSFULLY COMPLETED", PAGE_WIDTH / 2, 163, { align: "center" });

                            // Certificate Course Title (Clean font for standard curriculum)
                            doc.setFont("Helvetica", "bold");
                            doc.setFontSize(18);
                            const titleLines = doc.splitTextToSize(cert.title, PAGE_WIDTH - 45);
                            let currY = 186;
                            titleLines.forEach((line) => {
                              doc.text(line, PAGE_WIDTH / 2, currY, { align: "center" });
                              currY += 9;
                            });
                          }

                          // Seal and Date Footers
                          doc.setFont("Helvetica", "normal");
                          doc.setFontSize(8);
                          doc.setTextColor("#4a4135");
                          doc.text("Sealed under the authority of Diageo trustees", 15, PAGE_HEIGHT - 22);
                          doc.text(cert.date, 15, PAGE_HEIGHT - 17);

                          doc.save(`Diageo_Certificate_${cert.title.replace(/\s+/g, "_")}.pdf`);
                        }}
                        aria-label={`Download certificate for ${cert.title}`}
                        className="bg-black/60 border border-[#3a342a]/85 p-2 rounded-sm text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0906] transition-all duration-300 group-hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — THE BILL (CLOSING + CTA)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section 
        id="contact-section"
        className="relative py-32 md:py-44 border-t border-[#3a342a]/30 bg-[#0a0906] z-10 overflow-hidden"
      >
        {/* Soft centered dark gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#c9a84c]/2 blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
          
          <ScrollFadeIn className="flex justify-center">
            <div className="h-[1px] w-24 bg-[#c9a84c]" />
          </ScrollFadeIn>

          <ScrollFadeIn delay={100} className="space-y-2">
            <span className="font-mono text-[11px] text-[#6b5520] tracking-[4px] uppercase block">
              THE BILL  ·  CLOSING OUT
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#e8dfc8]/95 leading-tight max-w-2xl mx-auto">
              Let's talk about what belongs in the glass.
            </h2>
          </ScrollFadeIn>

          {/* Luxury CTA Action Buttons */}
          <ScrollFadeIn delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              
              {/* PDF generator trigger */}
              <button
                id="btn-download-pdf"
                onClick={handleDownloadPortfolio}
                className="w-full sm:w-auto px-7 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-sm font-serif italic text-sm tracking-widest cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#c9a84c]/10"
              >
                <Download className="w-4 h-4" /> Download Portfolio PDF
              </button>

              <button
                id="btn-view-certs"
                onClick={() => handleScrollToSection("ingredients-section")}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#c9a84c] text-[#0a0906] hover:bg-[#b0903c] rounded-sm font-sans font-semibold text-xs tracking-[2px] uppercase cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-[#c9a84c]/10"
              >
                <Award className="w-4 h-4" /> View Certifications
              </button>

            </div>
          </ScrollFadeIn>

          {/* Social Handles Matrix */}
          <ScrollFadeIn delay={300} className="pt-8 border-t border-[#3a342a]/30 max-w-lg mx-auto">
            <div className="flex justify-center items-center gap-4 font-mono text-xs text-[#6b5520]">
              
              <a 
                href="mailto:hemabar10der@gmail.com?subject=Inquiry%20for%20Hemakshe%20Nagaraj%20Mixologist"
                className="flex items-center gap-1.5 hover:text-[#e8dfc8] transition-colors bg-black/40 border border-[#3a342a]/50 hover:border-[#6b5520] px-3.5 py-2 rounded-sm"
              >
                <Mail className="w-3.5 h-3.5 text-[#c9a84c]" />
                <span>EMAIL</span>
              </a>

              <a 
                href="https://www.instagram.com/hema.a.10?igsh=MXdrdnR5MGlhcm03Zg=="
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#e8dfc8] transition-colors bg-black/40 border border-[#3a342a]/50 hover:border-[#6b5520] px-3.5 py-2 rounded-sm"
              >
                <Instagram className="w-3.5 h-3.5 text-[#c9a84c]" />
                <span>INSTAGRAM</span>
              </a>

            </div>

            <div className="mt-8 text-[9px] text-[#3a342a] tracking-widest uppercase">
              HEMAKSHE NAGARAJ © 2026  ·  THE LIQUID MENU. ALL RIGHTS RESERVED.
            </div>
          </ScrollFadeIn>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LIGHTBOX MODAL — THE MASTER MENU BLUEPRINT
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isBlueprintOpen && (
        <div 
          className="fixed inset-0 bg-[#0a0906]/98 backdrop-blur-lg z-50 flex flex-col justify-between p-4 md:p-8 text-[#e8dfc8] select-none"
          id="blueprint-modal"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#3a342a]/60 pb-4 z-10">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-[#c9a84c] tracking-[4px] uppercase block">
                THE ORIGINAL SPECIFICATION
              </span>
              <h2 className="font-serif italic text-lg sm:text-xl text-[#e8dfc8]">
                Mixologist's Hand-drawn Master Recipe Ledger
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block font-mono text-[9px] text-[#6b5520] tracking-widest mr-2 uppercase block">
                ZOOM: {Math.round(blueprintZoom * 100)}%
              </span>
              
              <button
                onClick={() => setBlueprintZoom(prev => Math.min(3, prev + 0.25))}
                className="p-2 border border-[#3a342a] hover:border-[#c9a84c] rounded-sm text-[#c9a84c] bg-black/40 hover:bg-[#c9a84c]/10 cursor-pointer transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setBlueprintZoom(prev => Math.max(0.5, prev - 0.25))}
                className="p-2 border border-[#3a342a] hover:border-[#c9a84c] rounded-sm text-[#c9a84c] bg-black/40 hover:bg-[#c9a84c]/10 cursor-pointer transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={() => setBlueprintZoom(1)}
                className="px-3 py-1.5 border border-[#3a342a] hover:border-[#c9a84c] text-xs font-mono rounded-sm text-[#c9a84c] bg-black/40 hover:bg-[#c9a84c]/10 cursor-pointer transition-all"
                title="Reset Zoom"
              >
                RESET
              </button>

              <button
                onClick={() => setIsBlueprintOpen(false)}
                className="p-2 bg-[#c9a84c] hover:bg-[#b0903c] text-[#0a0906] rounded-sm cursor-pointer transition-transform duration-300 hover:rotate-90 flex items-center justify-center shadow-lg"
                title="Close Ledger"
                id="btn-close-ledger"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Modal Content: Main Interactive Viewing Stage */}
          <div className="flex-1 w-full overflow-auto flex items-center justify-center p-4 md:p-8 cursor-grab active:cursor-grabbing">
            <div 
              className="relative transition-transform duration-300 ease-out py-8"
              style={{ transform: `scale(${blueprintZoom})` }}
              onDoubleClick={() => setBlueprintZoom(prev => prev === 1 ? 1.75 : 1)}
              title="Double click to quick zoom"
            >
              <div className="border border-[#c9a84c]/30 p-2 sm:p-4 bg-black/40 rounded-sm shadow-2xl relative max-w-full max-h-[70vh] flex items-center justify-center">
                
                {/* Vintage corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#c9a84c]" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#c9a84c]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#c9a84c]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c9a84c]" />

                <img 
                  src="/menu_blueprint.jpeg"
                  alt="Hemakshe's physical master formulation recipes matrix"
                  referrerPolicy="no-referrer"
                  className="max-w-[95vw] md:max-w-[75vw] max-h-[60vh] object-contain transition-all duration-700 select-none hover:brightness-105 filter contrast-[1.05]"
                  onError={(e) => {
                    // Fail gracefully by showing beautiful offline blueprint layout
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const errDiv = document.createElement('div');
                      errDiv.className = 'p-12 text-center max-w-md';
                      errDiv.innerHTML = `
                        <div class="font-serif italic text-lg text-[#c9a84c] mb-4">"The Physical Master Outline Canvas"</div>
                        <p class="font-sans text-xs text-[#e8dfc8]/70 leading-relaxed">
                          Verify placement matrix of Velvet Burn, Split State, Garden Silence & Cut Glass behind Bengaluru network systems.
                        </p>
                        <div class="font-mono text-[9px] text-[#6b5520] mt-6 tracking-[3px] uppercase px-3 py-1.5 border border-[#3a342a]">
                          BLUEPRINT IDENTIFIER: menu_blueprint.jpeg
                        </div>
                      `;
                      parent.appendChild(errDiv);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-[#3a342a]/60 pt-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 z-10 bg-[#0a0906]">
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] text-[#6b5520] tracking-[3px] uppercase block">
                CREDENTIAL RECORD
              </span>
              <p className="font-sans text-xs text-[#e8dfc8]/80 max-w-3xl leading-relaxed">
                Verification schema matching physical menu designs built for selective guest integrations. Double-click the ledger image to quickly toggle focus zoom level.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/menu_blueprint.jpeg';
                  link.download = 'hemakshe_nagaraj_liquid_menu_blueprint.jpeg';
                  link.click();
                }}
                className="px-4 py-2 border border-[#c9a84c] hover:bg-[#c9a84c]/10 text-[#c9a84c] font-sans text-[10px] tracking-widest uppercase cursor-pointer transition-all rounded-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save Blueprint Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
