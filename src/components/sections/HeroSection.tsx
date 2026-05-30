"use client";
import AnimatedTitle from "@/components/AnimatedTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useI18n } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#111] animate-pulse" />,
});

/**
 * HeroSection - Cappen Style Layout (Bebas Neue)
 * Title positions are LOCKED per user preference.
 * Surrounding UI elements: refined editorial placement.
 */
export default function HeroSection() {
  const { t } = useI18n();
  const container = useRef<HTMLDivElement>(null);
  const titleWrapper = useRef<HTMLDivElement>(null);
  const slotDesktopRef = useRef<HTMLDivElement>(null);
  const slotMobileRef = useRef<HTMLDivElement>(null);

  // Refs pour l'effet portal "Cappen"
  const portalRef = useRef<HTMLDivElement>(null);
  const portalImageRef = useRef<HTMLImageElement>(null);

  // Détection adaptive et optimisation de performance GPU
  const [loadSpline, setLoadSpline] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [fpsFallbackActive, setFpsFallbackActive] = useState(false);

  const scrollTlRef = useRef<gsap.core.Timeline | null>(null);

  // Recalculates slot position and updates portalRef and portalImageRef directly in the DOM
  const recalculatePortal = () => {
    if (typeof window === "undefined") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const canvasW = vw < 1024 ? vh * 1.5 : vw;
    const canvasH = vh;

    const activeSlot =
      vw < 1024 ? slotMobileRef.current : slotDesktopRef.current;

    if (activeSlot && portalRef.current && portalImageRef.current) {
      const rect = activeSlot.getBoundingClientRect();
      const insetTop = rect.top;
      const insetRight = vw - rect.right;
      const insetBottom = vh - rect.bottom;
      const insetLeft = rect.left;

      const startClip = `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 4px)`;

      const slotCenterX = rect.left + rect.width / 2;
      const slotCenterY = rect.top + rect.height / 2;

      const diffX = slotCenterX - vw / 2;
      const diffY = slotCenterY - vh / 2;

      const scaleX = rect.width / canvasW;
      const scaleY = rect.height / canvasH;
      const multiplier = vw < 1024 ? 1.05 : 1.2;
      const initialScale = Math.max(scaleX, scaleY) * multiplier;

      gsap.set(portalRef.current, { clipPath: startClip });
      gsap.set(portalImageRef.current, {
        xPercent: -50,
        yPercent: -50,
        x: diffX,
        y: diffY,
        scale: initialScale,
      });

      if (scrollTlRef.current) {
        scrollTlRef.current.invalidate();
      }
      ScrollTrigger.refresh();
    }
  };

  // Debounced resize handler to recreate the ScrollTrigger with perfect coordinates
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();

    const handleResize = () => {
      checkDesktop();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        recalculatePortal();
      }, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Option 2: Active performance monitoring on desktop to detect low FPS
  useEffect(() => {
    if (!loadSpline || !isDesktop || fpsFallbackActive) return;

    let frameCount = 0;
    let startTime = performance.now();
    let rafId: number;

    const checkFps = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - startTime;

      // Monitor performance over a 2.5 second window
      if (elapsed >= 2500) {
        const fps = (frameCount * 1000) / elapsed;
        console.log(`[Performance Monitor] Spline running at ${fps.toFixed(1)} FPS.`);
        
        // If average frame rate drops below 45 FPS, switch to high-performance video fallback
        if (fps < 45) {
          console.warn("[Performance Monitor] Low FPS detected. Swapping to hardware-accelerated video loop.");
          setFpsFallbackActive(true);
        }
      } else {
        rafId = requestAnimationFrame(checkFps);
      }
    };

    // Apply a 500ms delay to ignore initial compilation/layout thrashing lag
    const monitorTimeout = setTimeout(() => {
      startTime = performance.now();
      frameCount = 0;
      rafId = requestAnimationFrame(checkFps);
    }, 500);

    return () => {
      clearTimeout(monitorTimeout);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [loadSpline, isDesktop, fpsFallbackActive]);

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;
    let t4: NodeJS.Timeout;

    const handlePreloaderComplete = () => {
      if (typeof window !== "undefined") {
        (window as any).__preloaderComplete = true;
      }

      // Animate tags
      gsap.fromTo(
        ".olha-tag",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.6,
        },
      );

      // Delay loading Spline to keep the preloader exit buttery-smooth
      setTimeout(() => {
        setLoadSpline(true);
      }, 2200);

      // Force recalculating the slot positions as the preloader exits and the layout reflows/scrollbars settle
      recalculatePortal();
      t1 = setTimeout(recalculatePortal, 150);
      t2 = setTimeout(recalculatePortal, 500);
      t3 = setTimeout(recalculatePortal, 1000);
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);

    // Fallback if the page hot-reloads and the preloader is already gone
    const isHotReload =
      document.readyState === "complete" &&
      !document.querySelector(".preloader-canvas");
    if (isHotReload) {
      if (typeof window !== "undefined") {
        (window as any).__preloaderComplete = true;
      }
      setLoadSpline(true);
      t4 = setTimeout(recalculatePortal, 100);
    }

    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=150%", // On épingle le Hero pour laisser le temps à l'image de s'étendre
          pin: true,
          scrub: 1,
          snap: {
            // Si on a passé 50% du scroll, on "snap" automatiquement jusqu'à la fin (1)
            // Sinon, on ne force rien (on renvoie la valeur actuelle)
            snapTo: (value) => (value > 0.4 ? 1 : value),
            delay: 0.05,
            duration: { min: 0.4, max: 0.8 },
            ease: "power3.inOut",
          },
        },
      });

      scrollTlRef.current = scrollTl;

      // 1. Expansion du portal pour remplir l'écran (inset 0px)
      scrollTl.to(
        portalRef.current,
        {
          clipPath: "inset(0px 0px 0px 0px round 0px)",
          ease: "power2.inOut",
        },
        0,
      );

      // 2. Scale-up de la scène Spline
      // Utilisation de power3.in : reste petit longtemps, puis s'agrandit d'un coup à la fin
      scrollTl.to(
        portalImageRef.current,
        {
          scale: 1,
          x: 0,
          y: 0,
          ease: "power3.in",
        },
        0,
      );

      // 4. Faire disparaître le texte du Hero et le décaler
      scrollTl.to(
        titleWrapper.current,
        {
          yPercent: -30,
          scale: 0.95,
          opacity: 1,
          ease: "power2.inOut",
        },
        0,
      );

      // Animations secondaires (tags etc.)
      scrollTl.fromTo(
        ".parallax-fast",
        { yPercent: 0, opacity: 1 },
        { yPercent: -80, opacity: 0, ease: "none" },
        0,
      );
      scrollTl.fromTo(
        ".parallax-slow",
        { yPercent: 0, opacity: 1 },
        { yPercent: -30, opacity: 0, ease: "none" },
        0,
      );

      // Initial calculation
      recalculatePortal();
    },
    { dependencies: [], scope: container },
  );

  return (
    <>
      {/* ══════════════ FOND CAPPEN (PORTAL) ══════════════ */}
      {/* Sorti de la section pour ne pas être impacté par overflow-hidden ou le pin spacer */}
      <div
        ref={portalRef}
        className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden bg-foreground"
        style={{ zIndex: 30 }}
      >
        {/* Spline 3D Scene - Ratio Paysage forcé sur mobile (150vh) pour reculer la caméra */}
        <div
          ref={portalImageRef}
          className={`absolute top-1/2 left-1/2 w-[150vh] lg:w-[100vw] h-[100vh] pointer-events-auto mix-blend-screen transition-opacity duration-1000 ${
            portalReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full h-full transition-transform duration-1000 ease-out ${
              portalReady ? "scale-100" : "scale-0"
            }`}
          >
            {loadSpline &&
              (isDesktop && !fpsFallbackActive ? (
                <Spline 
                  scene="https://prod.spline.design/uXQszxYeNTwjBGUo/scene.splinecode" 
                  onLoad={() => setPortalReady(true)}
                />
              ) : (
                <video
                  src="/chips.mp4"
                  poster="/hero.png"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedData={() => setPortalReady(true)}
                />
              ))}
          </div>
        </div>
      </div>

      <section
        id="hero"
        ref={container}
        className="h-screen w-full relative z-0 flex flex-col items-center justify-center bg-transparent text-foreground overflow-hidden md:overflow-visible"
      >
        <SectionWrapper className="relative z-30 w-full h-full flex flex-col items-center justify-center">
          <div
            ref={titleWrapper}
            className="relative z-10 pointer-events-none flex flex-col items-center w-full md:mb-10 "
          >
            {/* ══════════════ DESKTOP TITLE (LOCKED) ══════════════ */}
            <div className="hidden lg:flex flex-col items-center justify-center w-full relative max-w-[95vw]">
              {/* Line 1: CONCEVOIR - ALIGN START */}
              <div className="w-full flex justify-start ">
                <AnimatedTitle
                  text="CONCEVOIR"
                  sizeClass="text-[9vw]"
                  trigger="event"
                  delay={0}
                  className="font-mona text-foreground font-black mix-blend-difference"
                  staggerFrom="start"
                />
              </div>

              {/* Tag under CONCEVOIR */}
              <div className="olha-tag opacity-0 pointer-events-none w-full flex justify-start pt-0 pl-[0.5vw]">
                <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium opacity-60 text-foreground">
                  RATIO 1,618 — v3.0
                </span>
              </div>

              {/* Line 2: LE [GAP] FUTUR - ALIGN CENTER */}
              <div className="w-full flex justify-center items-center gap-[2vw] mt-[-1vw]">
                <AnimatedTitle
                  text="LE"
                  sizeClass="text-[9vw]"
                  trigger="event"
                  delay={0.15}
                  className="font-mona font-black text-outline"
                  staggerFrom="start"
                />
                <div
                  ref={slotDesktopRef}
                  className="w-[14vw] h-[8vw] flex-shrink-0"
                />
                <AnimatedTitle
                  text="FUTUR"
                  sizeClass="text-[9vw]"
                  trigger="event"
                  delay={0.25}
                  className="font-mona font-black text-outline"
                  staggerFrom="start"
                />
              </div>

              {/* Subtitle above DÈS AUJOURD'HUI */}
              <div className="olha-tag opacity-0 pointer-events-none w-full flex justify-end pb-1 pr-[0.5vw]">
                <span className="text-[10px] md:text-xs font-serif italic tracking-[0.15em] uppercase opacity-80 text-foreground">
                  Architecture of Balance
                </span>
              </div>

              {/* Line 3: DÈS AUJOURD'HUI - ALIGN END */}
              <div className="w-full flex justify-end mt-[-1vw]">
                <AnimatedTitle
                  text="DÈS AUJOURD'HUI"
                  sizeClass="text-[9vw]"
                  trigger="event"
                  delay={0.4}
                  className="font-mona text-foreground font-black mix-blend-difference"
                  staggerFrom="center"
                />
              </div>
            </div>

            {/* ══════════════ MOBILE / TABLET TITLE (SLOT BELOW) ══════════════ */}
            <div className="lg:hidden flex flex-col items-center w-full px-2 sm:px-4">
              <div className="flex flex-col items-center w-full leading-none gap-4 md:gap-1 text-center">
                {/* Ratio Tag Top */}
                <div className="olha-tag opacity-0 w-full flex justify-start">
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase font-medium opacity-60">
                    RATIO 1,618 — v3.0
                  </span>
                </div>

                <AnimatedTitle
                  text="CONCEVOIR"
                  sizeClass="text-[12vw] sm:text-[11vw] md:text-[9.5vw]"
                  trigger="event"
                  delay={0}
                  className="font-mona text-foreground font-black tracking-tighter mix-blend-difference self-start"
                />

                <AnimatedTitle
                  text="LE FUTUR DÈS"
                  sizeClass="text-[12vw] sm:text-[11vw] md:text-[9.5vw]"
                  trigger="event"
                  delay={0.1}
                  className="font-mona text-foreground font-black tracking-tighter mix-blend-difference"
                />

                <AnimatedTitle
                  text="AUJOURD'HUI"
                  sizeClass="text-[12vw] sm:text-[11vw] md:text-[9.5vw]"
                  trigger="event"
                  delay={0.2}
                  className="font-mona text-foreground font-black tracking-tighter mix-blend-difference self-end"
                />
              </div>

              {/* Architecture Tag Bottom */}
              <div className="olha-tag opacity-0 w-full flex justify-end mt-4">
                <span className="text-[9px] sm:text-[10px] font-serif italic tracking-[0.15em] uppercase opacity-80">
                  Architecture of Balance
                </span>
              </div>

              {/* Slot Mobile — Paysage, ~60% width */}
              <div
                ref={slotMobileRef}
                className="w-[90vw] h-[50vw] md:w-[55vw] md:h-[35vw] mt-20 md:mt-4 border border-foreground/10 bg-transparent rounded-sm flex-shrink-0 mx-auto"
              />
            </div>
          </div>

          {/* CENTER: Scroll Indicator */}
          <div className="olha-tag opacity-0 flex flex-col items-center gap-3 absolute right-4 top-[13vh] md:right-6 md:top-[60vh] lg:right-8 lg:top-[25vh] xl:right-12 ">
            <span className="text-[8px] md:text-[9px] lg:text-[10px] font-sans uppercase tracking-[0.4em] font-medium opacity-40 [writing-mode:vertical-rl] rotate-180">
              Scroll
            </span>
            <div className="w-px h-12 bg-foreground/40 origin-top animate-pulse" />
          </div>
        </SectionWrapper>

        {/* ══════════════ BOTTOM BAR — Desktop ══════════════ */}
        <div className="hidden lg:flex absolute bottom-6 left-0 right-0 px-12 z-40 items-end justify-between pointer-events-none">
          {/* LEFT: Services */}
          <div className="olha-tag opacity-0 flex flex-col gap-0.5 parallax-fast">
            {["/ Art Direction", "/ Web Design", "/ Development"].map(
              (service, idx) => (
                <span
                  key={idx}
                  className="text-xs lg:text-sm font-sans uppercase tracking-[0.15em] font-medium opacity-70"
                >
                  {service}
                </span>
              ),
            )}
          </div>

          {/* RIGHT: Status */}
          <div className="olha-tag opacity-0 flex items-center gap-3 parallax-slow">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/50"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground"></span>
              </span>
              <span className="text-[10px] lg:text-xs font-sans font-medium tracking-[0.2em] uppercase opacity-70">
                Disponible
              </span>
            </div>
            <span className="w-3 h-px bg-foreground/50" />
            <span className="text-[10px] lg:text-xs font-sans tracking-[0.15em] uppercase opacity-70">
              Dordogne, FR
            </span>
          </div>
        </div>

        {/* ══════════════ BOTTOM BAR — Mobile ══════════════ */}
        <div className="lg:hidden absolute bottom-12 left-0 right-0 px-6 sm:px-12 z-40 flex items-end justify-between pointer-events-none">
          {/* LEFT: Services */}
          <div className="olha-tag opacity-0 flex flex-col gap-0.5">
            {["Art Direction", "Web Design", "Development"].map(
              (service, idx) => (
                <span
                  key={idx}
                  className="text-[9px] sm:text-[11px] font-sans uppercase tracking-[0.15em] font-medium opacity-60"
                >
                  / {service}
                </span>
              ),
            )}
          </div>

          {/* RIGHT: Status + scroll */}
          <div className="olha-tag opacity-0 flex flex-col items-end gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/50"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground"></span>
              </span>
              <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase opacity-60">
                Disponible
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
