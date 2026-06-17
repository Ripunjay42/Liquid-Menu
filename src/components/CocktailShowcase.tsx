import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COCKTAILS } from "../data";
import ImagePlaceholder from "./ImagePlaceholder";
import { 
  Wine, 
  Sparkles, 
  Lock, 
  Play, 
  Pause, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Eye, 
  Grid
} from "lucide-react";

export default function CocktailShowcase() {
  const [activeDrinkIndex, setActiveDrinkIndex] = useState(0);
  const activeDrinkIndexRef = useRef(0);
  activeDrinkIndexRef.current = activeDrinkIndex;

  const currentDrink = COCKTAILS[activeDrinkIndex] || COCKTAILS[0];

  // Distillation Dial level:
  // 1: Glassware & Basic notes (Profile)
  // 2: Flavor Spectrum (Scent)
  // 3: Ingredients Formulation List (Formulas)
  // 4: Systematic Pour Methodology (Build)
  const [distillLevel, setDistillLevel] = useState<number>(1);
  const [alwaysUnlocked, setAlwaysUnlocked] = useState<boolean>(true); // Default to unlocked so user has immediate access, but can toggle lock mode
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({});

  // Video playback states
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // References for local scrolling & swipe detection
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Reset video and states when active drink changes
  useEffect(() => {
    setVideoError(false);
    setVideoPlaying(true);
    setCheckedSteps({});
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Safe fail block if browser blocks auto-play or file does not exist
      });
    }
  }, [activeDrinkIndex]);

  // Handle local smart wheel scrolls and swipe gestures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Avoid stealing scroll if they are scrolling within a scrollable checklist box
      const target = e.target as HTMLElement;
      if (target.closest(".scrollable-detail")) {
        return;
      }

      // Check if scroll is vertical and dominant
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const now = Date.now();
        
        // Cooldown threshold to avoid chaotic rapid switching
        if (now - lastWheelTime.current < 750) {
          // If we are within the cool-down phase, evaluate if we should block
          if (e.deltaY > 0 && activeDrinkIndexRef.current < COCKTAILS.length - 1) {
            e.preventDefault();
          } else if (e.deltaY < 0 && activeDrinkIndexRef.current > 0) {
            e.preventDefault();
          }
          return;
        }

        if (Math.abs(e.deltaY) > 25) {
          if (e.deltaY > 0) {
            // Scroll down -> next drink if more exist
            if (activeDrinkIndexRef.current < COCKTAILS.length - 1) {
              e.preventDefault();
              lastWheelTime.current = now;
              setActiveDrinkIndex((prev) => {
                const next = prev + 1;
                return next < COCKTAILS.length ? next : prev;
              });
            }
          } else {
            // Scroll up -> previous drink if more exist
            if (activeDrinkIndexRef.current > 0) {
              e.preventDefault();
              lastWheelTime.current = now;
              setActiveDrinkIndex((prev) => {
                const next = prev - 1;
                return next >= 0 ? next : prev;
              });
            }
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      
      const diffY = touchStartY.current - currentY;
      const diffX = touchStartX.current - currentX;
      const now = Date.now();

      // Check for swipe gesture (vertical or horizontal dominances over threshold)
      if (Math.abs(diffY) > 60 || Math.abs(diffX) > 60) {
        if (now - lastWheelTime.current < 850) {
          // Block inside threshold
          if (Math.abs(diffY) > Math.abs(diffX)) {
            if (diffY > 0 && activeDrinkIndexRef.current < COCKTAILS.length - 1) {
              if (e.cancelable) e.preventDefault();
            } else if (diffY < 0 && activeDrinkIndexRef.current > 0) {
              if (e.cancelable) e.preventDefault();
            }
          } else {
            if (e.cancelable) e.preventDefault();
          }
          return;
        }

        lastWheelTime.current = now;
        
        // Switch menu items one-by-one with smart wrap and scroll release
        if (Math.abs(diffY) > Math.abs(diffX)) {
          if (diffY > 0) {
            // Swiped up (user wishes to scroll down)
            if (activeDrinkIndexRef.current < COCKTAILS.length - 1) {
              if (e.cancelable) e.preventDefault();
              setActiveDrinkIndex((prev) => {
                const next = prev + 1;
                return next < COCKTAILS.length ? next : prev;
              });
            }
          } else {
            // Swiped down (user wishes to scroll up)
            if (activeDrinkIndexRef.current > 0) {
              if (e.cancelable) e.preventDefault();
              setActiveDrinkIndex((prev) => {
                const next = prev - 1;
                return next >= 0 ? next : prev;
              });
            }
          }
        } else {
          // Horizontal swipes: we always want to prevent default and switch cocktails
          if (e.cancelable) e.preventDefault();
          if (diffX > 0) {
            setActiveDrinkIndex((prev) => (prev + 1) % COCKTAILS.length);
          } else {
            setActiveDrinkIndex((prev) => (prev - 1 + COCKTAILS.length) % COCKTAILS.length);
          }
        }

        touchStartY.current = null;
        touchStartX.current = null;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const level1Active = alwaysUnlocked || distillLevel >= 1;
  const level2Active = alwaysUnlocked || distillLevel >= 2;
  const level3Active = alwaysUnlocked || distillLevel >= 3;
  const level4Active = alwaysUnlocked || distillLevel >= 4;

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  const handlePrevDrink = () => {
    setActiveDrinkIndex((prev) => (prev - 1 + COCKTAILS.length) % COCKTAILS.length);
  };

  const handleNextDrink = () => {
    setActiveDrinkIndex((prev) => (prev + 1) % COCKTAILS.length);
  };

  const toggleStep = (stepIndex: number) => {
    const key = `${currentDrink.id}-${stepIndex}`;
    setCheckedSteps((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div
      id="signature-serves-section"
      className="relative w-full py-16 sm:py-24 overflow-hidden transition-all duration-[800ms] border-y border-[#3a342a]/30"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${currentDrink.colorTemp}e0 0%, #060504 100%)`
      }}
    >
      {/* Speakeasy Ruling Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,163,76,0.012)_1px,transparent_1px)] [background-size:100%_40px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6">
        
        {/* Editorial Section Header */}
        <div className="border-b border-[#3a342a]/60 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-[#c9a84c] tracking-[3px] uppercase block mb-1">
              THE SEASONAL REVOLUTION DECK
            </span>
            <h2 id="showcase-title" className="font-serif italic text-3xl sm:text-4xl text-[#e8dfc8]">
              Hemakshe's Top Selective Craft Formulations
            </h2>
            <p className="font-sans text-xs text-[#a28e5e] tracking-wide mt-2 max-w-xl leading-relaxed">
              Explore selective creations one-by-one. Scroll your mouse-wheel, swipe anywhere over the panel below, or use the interactive tabs to swap formulations seamlessly on the same page.
            </p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() => setAlwaysUnlocked(!alwaysUnlocked)}
              className={`font-mono text-[8px] tracking-[2px] uppercase border px-3 py-1.5 rounded-[2px] transition-all duration-300 cursor-pointer ${
                alwaysUnlocked 
                  ? "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/40 font-bold" 
                  : "bg-black/40 text-neutral-500 border-[#3a342a]/50 hover:text-neutral-300"
              }`}
            >
              LEVELS DECRYPTION: {alwaysUnlocked ? "UNSEALED" : "MANUAL DIAL"}
            </button>
            <div className="font-mono text-[9px] text-[#c9a84c] tracking-widest uppercase bg-[#c9a84c]/5 border border-[#c9a84c]/20 px-3 py-1.5 rounded-[2px] hidden sm:block">
              SERVES UNLOCKED // 0{COCKTAILS.length}
            </div>
          </div>
        </div>

        {/* TOP SELECTOR RACK: Beautiful Brass Menu Plates (Horizontal Tabs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {COCKTAILS.map((drink, idx) => {
            const isSelected = activeDrinkIndex === idx;
            return (
              <button
                key={drink.id}
                onClick={() => {
                  setActiveDrinkIndex(idx);
                  // Scroll title subtly into view to keep focus locked
                  document.getElementById("showcase-title")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
                className={`relative p-3 rounded-[3px] border text-left transition-all duration-300 group cursor-pointer ${
                  isSelected
                    ? "bg-[#181512] border-[#c9a84c] shadow-lg shadow-[#c9a84c]/5"
                    : "bg-[#0c0a08]/60 border-[#3a342a]/30 hover:border-[#6b5520]/60 hover:bg-[#0c0a08]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[8px] tracking-wider transition-colors ${
                    isSelected ? "text-[#c9a84c]" : "text-[#6b5520]"
                  }`}>
                    FORMULATION // 0{idx + 1}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isSelected ? "bg-[#c9a84c] shadow-[0_0_6px_#c9a84c]" : "bg-neutral-800"
                    }`}
                  />
                </div>
                <div
                  className="font-serif italic text-[14px] sm:text-[15px] transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: isSelected ? drink.accentColor : "#e8dfc8" }}
                >
                  {drink.name}
                </div>
                
                {/* Visual glow indicator line at bottom */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-2 right-2 h-[1px] bg-[#c9a84c]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* MAIN DECK CONTAINER (Listens to touches and wheel scroll) */}
        <div 
          ref={containerRef}
          className="relative bg-[#0d0a07]/80 backdrop-blur-md border border-[#c9a84c]/20 rounded-md p-4 sm:p-8 shadow-2xl overflow-hidden group/deck"
        >
          {/* Subtle Swipe indicator bar for tech-feeling */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#3a342a]/30 overflow-hidden">
            <div className="w-[15%] h-full bg-[#c9a84c]/40 animate-[shimmer_3s_infinite_linear]" 
                 style={{ animation: "shimmer 3s infinite linear" }} />
          </div>

          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(700%); }
            }
          `}</style>

          {/* Left/Right One-By-One Switchers (Floating) */}
          <button 
            onClick={handlePrevDrink}
            aria-label="Previous Formulation"
            className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#3a342a]/60 bg-black/70 flex items-center justify-center text-[#e8dfc8]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNextDrink}
            aria-label="Next Formulation"
            className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#3a342a]/60 bg-black/70 flex items-center justify-center text-[#e8dfc8]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Master Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start px-6 sm:px-4">
            
            {/* COLUMN 1 (5/12): SENSORY VIEWPORT DISPLAY */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="font-mono text-[8px] text-[#6b5520] tracking-[3px] uppercase border-b border-[#3a342a]/40 pb-2 flex justify-between items-center">
                <span>SENSORY REAL-TIME MATRIX</span>
                {currentDrink.videoSrc && !videoError && (
                  <span className="text-[#c9a84c] text-[8px] bg-[#c9a84c]/10 px-1.5 py-0.5 rounded-[1px] uppercase tracking-widest animate-pulse font-semibold">
                    VIDEO ACTIVE
                  </span>
                )}
              </div>

              {/* Responsive Video/Image Portal Frame */}
              <div className="relative aspect-square w-full max-w-[340px] xl:max-w-[380px] mx-auto bg-[#070605] border border-[#c9a84c]/20 rounded-[2px] p-2 shadow-2xl transition-all duration-500 hover:border-[#c9a84c]/45">
                {/* High-end decorative corners */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#c9a84c]" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#c9a84c]" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#c9a84c]" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#c9a84c]" />

                <div className="w-full h-full overflow-hidden relative rounded-[1px] bg-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDrink.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full relative"
                    >
                      {currentDrink.videoSrc && !videoError ? (
                        <div className="w-full h-full relative group/video">
                          <video
                            ref={videoRef}
                            src={currentDrink.videoSrc}
                            autoPlay
                            loop
                            muted={videoMuted}
                            playsInline
                            onError={() => setVideoError(true)}
                            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
                          />
                          {/* Fine technical labels overlay */}
                          <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-[1px] border border-white/5 font-mono text-[7.5px] text-[#e8dfc8]/50 tracking-widest uppercase">
                            STREAM: L_FPS_04
                          </div>

                          {/* Float media controller HUD overlay */}
                          <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-[2px] border border-[#3a342a]/70 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                            <button 
                              onClick={handleTogglePlay}
                              className="text-[#e8dfc8] hover:text-[#c9a84c] font-mono text-[8px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer"
                            >
                              {videoPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                              {videoPlaying ? "PAUSE" : "PLAY"}
                            </button>
                            <button
                              onClick={() => setVideoMuted(!videoMuted)}
                              className="text-[#e8dfc8] hover:text-[#c9a84c] text-[8px] flex items-center gap-1.5 cursor-pointer"
                            >
                              {videoMuted ? <VolumeX className="w-2.5 h-2.5 text-neutral-500" /> : <Volume2 className="w-2.5 h-2.5 text-[#c9a84c]" />}
                              <span className="font-mono tracking-wider">{videoMuted ? "MUTED" : "UNMUTE"}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Image Fallback compiled with user placeholders */
                        <ImagePlaceholder
                          filename={currentDrink.placeholderPhoto}
                          className="w-full h-full border-none rounded-none"
                          themeGradient={`linear-gradient(135deg, ${currentDrink.colorTemp} 0%, #0c0b08 100%)`}
                          overlayText={currentDrink.name}
                          imageSrc={currentDrink.imageSrc}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Glassware metadata block */}
              <div className="bg-black/30 border border-[#3a342a]/40 p-3 rounded-[2px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#c9a84c]" />
                  <div>
                    <span className="text-[7.5px] font-mono text-[#6b5520] uppercase block">RECOMMENDED GLASSWARE</span>
                    <span className="text-xs font-serif italic text-[#e8dfc8]">{currentDrink.glass}</span>
                  </div>
                </div>
                <div className="text-right border-l border-[#3a342a]/40 pl-3">
                  <span className="text-[7.5px] font-mono text-[#6b5520] uppercase block">SERVING STYLE</span>
                  <span className="text-[10px] font-mono text-[#c9a84c]">NEAT / SPECIAL</span>
                </div>
              </div>

            </div>

            {/* COLUMN 2 (7/12): MOLECULAR SPECIFICATION DETAILS */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Active Formulation Title & Specs */}
              <div className="pb-3 border-b border-[#3a342a]/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] text-[#c9a84c] tracking-widest uppercase">
                    ACTIVE SERVE: 0{activeDrinkIndex + 1} OF 0{COCKTAILS.length}
                  </span>
                </div>
                
                <h3 
                  className="font-serif italic text-3xl transition-colors duration-400"
                  style={{ color: currentDrink.accentColor }}
                >
                  {currentDrink.name}
                </h3>
              </div>

              {/* CALIBRATION DECK DIAL (Progressive Dial Slider) */}
              <div className="bg-[#15110e]/95 border border-[#c9a84c]/15 p-4 rounded-[2px] space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#3a342a]/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-mono text-[8px] text-[#c9a84c] tracking-[2px] uppercase">
                      FORMULATION SPECIFICATION DECK
                    </span>
                  </div>
                  <span className="font-mono text-[8px] text-[#e8dfc8]/60 bg-black/50 border border-[#3a342a]/60 px-2 py-0.5 rounded-[1px] uppercase">
                    LAYER: LV_0{distillLevel}
                  </span>
                </div>

                {/* Dial Slider Knob */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500 tracking-wider">
                    <span className={distillLevel === 1 ? "text-[#c9a84c] font-bold" : ""}>01: PROFILE</span>
                    <span className={distillLevel === 2 ? "text-[#c9a84c] font-bold" : ""}>02: SCENT</span>
                    <span className={distillLevel === 3 ? "text-[#c9a84c] font-bold" : ""}>03: FORMULAS</span>
                    <span className={distillLevel === 4 ? "text-[#c9a84c] font-bold" : ""}>04: POUR METHOD</span>
                  </div>

                  <div className="relative pt-1 flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={distillLevel}
                      onChange={(e) => {
                        setDistillLevel(parseInt(e.target.value));
                        setAlwaysUnlocked(false); // Switch off always-unlocked bypass to observe manual dial
                      }}
                      className="w-full accent-[#c9a84c] h-1 bg-[#1d1813] rounded-lg appearance-none cursor-pointer border border-[#3a342a]/60"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1.5">
                    <span className="font-sans text-[9px] text-neutral-500 italic block">
                      {alwaysUnlocked 
                        ? "★ System is unsealed. Displaying complete specifications below." 
                        : "▲ Dial upward to unseal molecular ingredients and methods progressively."}
                    </span>
                    <button
                      onClick={() => setAlwaysUnlocked(!alwaysUnlocked)}
                      className="font-mono text-[7px] text-[#c9a84c] hover:underline uppercase tracking-widest cursor-pointer"
                    >
                      {alwaysUnlocked ? "[ USE MANUAL DIALS ]" : "[ BYPASS & UNSEAL ALL ]"}
                    </button>
                  </div>
                </div>

                {/* Dial Level quick tab selects */}
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((lvl) => {
                    const isSelect = distillLevel === lvl && !alwaysUnlocked;
                    return (
                      <button
                        key={lvl}
                        onClick={() => {
                          setDistillLevel(lvl);
                          setAlwaysUnlocked(false);
                        }}
                        className={`py-1 text-[8.5px] font-mono border text-center transition-all duration-300 rounded-[1px] cursor-pointer ${
                          isSelect
                            ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c] font-semibold"
                            : alwaysUnlocked 
                            ? "border-neutral-900 text-neutral-500 bg-transparent"
                            : "border-neutral-800/80 text-neutral-400 hover:border-[#6b5520] hover:text-[#e8dfc8]"
                        }`}
                      >
                        LVL 0{lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC CONTENT VIEWER (Cross-fades on Dial/Cocktail switches) */}
              <div className="min-h-[220px] max-h-[340px] overflow-y-auto pr-1 scrollable-detail scrollbar-thin scrollbar-thumb-amber-950/40">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentDrink.id}-${distillLevel}-${alwaysUnlocked}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 text-left"
                  >
                    
                    {/* SPECIFICATION LAYER 1: Basic Tasting Profile */}
                    {level1Active && (
                      <div className="bg-black/20 border border-[#3a342a]/20 p-4 rounded-[2px] space-y-2">
                        <span className="font-mono text-[7.5px] text-[#6b5520] tracking-[2px] uppercase block">
                          SENSORY STORY & TONE
                        </span>
                        <div className="font-serif italic text-sm text-[#e8dfc8]/90 leading-relaxed pl-1 border-l border-[#c9a84c]/30">
                          "{currentDrink.tastingNote}"
                        </div>
                      </div>
                    )}

                    {/* SPECIFICATION LAYER 2: Flavor Spectrum */}
                    {level2Active && (
                      <div className="bg-black/20 border border-[#3a342a]/20 p-4 rounded-[2px] space-y-2">
                        <span className="font-mono text-[7.5px] text-[#6b5520] tracking-[2px] uppercase block mb-1">
                          SCENT SPECTRUM & PILLS
                        </span>
                        <div className="flex flex-wrap gap-1.5 pl-0.5">
                          {currentDrink.flavorPills.map((pill) => (
                            <span
                              key={pill}
                              className="font-mono text-[8px] sm:text-[9px] border border-[#c9a84c]/20 text-[#e8dfc8] bg-[#1a1511] px-2.5 py-1 rounded-[1.5px] tracking-wider font-medium shadow-sm flex items-center gap-1 hover:border-[#c9a84c]/50 transition-colors"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#c9a84c]" />
                              {pill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SPECIFICATION LAYER 3: Ingredients Formulation List */}
                    {level3Active ? (
                      <div className="bg-black/20 border border-[#3a342a]/20 p-4 rounded-[2px] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[7.5px] text-[#6b5520] tracking-[2px] uppercase block">
                            INGREDIENTS FOR THE MIXOLOGIST
                          </span>
                          <span className="font-mono text-[7.5px] text-[#c9a84c] bg-[#c9a84c]/10 px-1.5 py-0.2 rounded-[1px]">
                            PROPORTIONAL SCHEME
                          </span>
                        </div>
                        
                        <div className="space-y-1.5 pl-0.5 pt-1">
                          {currentDrink.ingredients.map((ing) => (
                            <div key={ing.name} className="flex items-end justify-between text-xs relative group/ing">
                              <span className="font-sans font-medium text-[#e8dfc8]/95 group-hover/ing:text-white transition-colors">
                                {ing.name}
                              </span>
                              <div className="flex-1 border-b border-dashed border-[#3a342a]/50 mx-2 mb-1 group-hover/ing:border-[#6b5520] transition-colors" />
                              <span className="font-mono text-[#c9a84c] text-xs font-semibold bg-black/40 px-2 py-0.5 rounded-[1.5px]">
                                {ing.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Seal Mask Lock Screen if they choose locked mode and dial isn't 3+ */
                      <div 
                        onClick={() => {
                          setDistillLevel(3);
                          setAlwaysUnlocked(false);
                        }}
                        className="bg-[#0b0806] border border-dashed border-amber-950/45 p-6 rounded-[2px] flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:border-[#c9a84c]/40 transition-colors"
                      >
                        <Lock className="w-6 h-6 text-amber-600/60 animate-bounce" />
                        <h4 className="font-serif italic text-xs text-[#e8dfc8]/85">Ingredients database is currently locked</h4>
                        <p className="font-mono text-[8px] text-[#6b5520] uppercase tracking-[1.5px]">
                          [ TAP HERE OR SLIDE DIAL TO L3 TO UNSEAL ]
                        </p>
                      </div>
                    )}

                    {/* SPECIFICATION LAYER 4: Systematic Pour Methodology */}
                    {level4Active ? (
                      currentDrink.method && (
                        <div className="bg-black/20 border border-[#3a342a]/20 p-4 rounded-[2px] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[7.5px] text-[#6b5520] tracking-[2px] uppercase block">
                              SYSTEMATIC POUR METHODOLOGY
                            </span>
                            <span className="font-mono text-[7.5px] text-[#c9a84c]  bg-black/50 px-1.5 py-0.2 rounded-[1.5px]">
                              0{currentDrink.method.length} STEPS
                            </span>
                          </div>

                          <ol className="space-y-2 pl-0.5 pt-1">
                            {currentDrink.method.map((step, sIdx) => {
                              const stepKey = `${currentDrink.id}-${sIdx}`;
                              const isChecked = !!checkedSteps[stepKey];
                              return (
                                <li 
                                  key={sIdx}
                                  onClick={() => toggleStep(sIdx)}
                                  className="flex items-start gap-2 text-xs font-sans text-[#e8dfc8]/80 leading-relaxed cursor-pointer group hover:text-[#e8dfc8] transition-colors"
                                >
                                  <button className={`mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-[2.5px] border flex items-center justify-center transition-all ${
                                    isChecked 
                                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                      : "border-neutral-700 bg-[#161210] group-hover:border-[#c9a84c]"
                                  }`}>
                                    {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-scale-in" />}
                                  </button>
                                  <span className={`transition-all ${isChecked ? "line-through text-neutral-500 italic" : "text-[#e8dfc8]/80"}`}>
                                    {step}
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      )
                    ) : (
                      /* Seal Mask for build instructions */
                      <div 
                        onClick={() => {
                          setDistillLevel(4);
                          setAlwaysUnlocked(false);
                        }}
                        className="bg-[#0b0806] border border-dashed border-amber-950/45 p-6 rounded-[2px] flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:border-[#c9a84c]/40 transition-colors"
                      >
                        <Lock className="w-6 h-6 text-amber-600/40 animate-pulse" />
                        <h4 className="font-serif italic text-xs text-[#e8dfc8]/80">Pour methodology is currently locked</h4>
                        <p className="font-mono text-[8px] text-[#6b5520] uppercase tracking-[1.5px]">
                          [ TAP HERE OR DIAL TO L4 TO UNSEAL METHODS ]
                        </p>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation instruction line / status indicator */}
              <div className="flex justify-between items-center text-[8.5px] font-mono text-neutral-500 border-t border-[#3a342a]/40 pt-3">
                <div className="flex items-center gap-1.5">
                  <Grid className="w-3 h-3 text-[#c9a84c]/70" />
                  <span className="uppercase tracking-widest hidden sm:inline">SWIPE DECK / SCROLL HERE TO CYCLE FORMULAS</span>
                  <span className="uppercase tracking-widest sm:hidden">SWIPE DECK TO CYCLE</span>
                </div>
                <div className="text-right">
                  <span className="text-[#c9a84c] uppercase">HEMAKSHE NAGARAJ © 2026</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
