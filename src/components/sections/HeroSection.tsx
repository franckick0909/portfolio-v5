"use client";
import AnimatedTitle from "@/components/AnimatedTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useI18n } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

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
  const slotRef = useRef<HTMLDivElement>(null);

  // Refs pour l'effet portal "Cappen"
  const portalRef = useRef<HTMLDivElement>(null);
  const portalImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handlePreloaderComplete = () => {
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
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);
    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
    };
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let diffX = 0;
      let diffY = 0;
      let startClip = "";

      if (vw < 768) {
        startClip = `inset(${vh / 2 - 20}px ${vw / 2 - 40}px ${vh / 2 - 20}px ${vw / 2 - 40}px round 4px)`;
      } else if (slotRef.current && container.current) {
        // Obtenir la position EXACTE du trou dans la section
        const rect = slotRef.current.getBoundingClientRect();
        const heroRect = container.current.getBoundingClientRect();

        // Calculer la position relative à la section (qui a la taille de l'écran)
        const relativeTop = rect.top - heroRect.top;
        const relativeLeft = rect.left - heroRect.left;
        const relativeBottom = relativeTop + rect.height;
        const relativeRight = relativeLeft + rect.width;

        startClip = `inset(${relativeTop}px ${vw - relativeRight}px ${vh - relativeBottom}px ${relativeLeft}px round 4px)`;

        // Calcul du décalage pour centrer le Spline dans le trou
        const slotCenterX = relativeLeft + rect.width / 2;
        const slotCenterY = relativeTop + rect.height / 2;
        diffX = slotCenterX - vw / 2;
        diffY = slotCenterY - vh / 2;
      } else {
        startClip = `inset(45vh 41vw 45vh 41vw round 4px)`; // fallback
      }

      // Initialiser le clip-path en pixels exacts
      gsap.set(portalRef.current, { clipPath: startClip });

      // Positionner et scaler la scène Spline pour qu'elle soit pile au centre du trou
      gsap.set(portalImageRef.current, { x: diffX, y: diffY });

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
    },
    { scope: container },
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
        {/* Spline 3D Scene */}
        <div
          ref={portalImageRef}
          className="w-full h-full scale-[0.25] pointer-events-auto"
        >
          <Spline scene="https://prod.spline.design/uXQszxYeNTwjBGUo/scene.splinecode" />
        </div>
      </div>

      <section
        id="hero"
        ref={container}
        className="h-screen w-full relative z-0 flex flex-col items-center justify-center bg-transparent text-foreground"
      >
        <SectionWrapper className="relative z-30 w-full h-full flex flex-col items-center justify-start pt-48 md:justify-center md:pt-0">
          <div
            ref={titleWrapper}
            className="relative z-10 pointer-events-none flex flex-col items-center w-full md:mb-10"
          >
            {/* ══════════════ DESKTOP TITLE (LOCKED) ══════════════ */}
            <div className="hidden md:flex flex-col items-center justify-center w-full relative max-w-[90vw] leading-[0.9]">
              {/* Line 1: CONCEVOIR - ALIGN START */}
              <div className="w-full flex justify-start ">
                <AnimatedTitle
                  text="CONCEVOIR"
                  sizeClass="text-[12vw]"
                  trigger="event"
                  delay={0}
                  className="font-bebas text-foreground font-black tracking-tighter mix-blend-difference"
                  staggerFrom="start"
                />
              </div>

              {/* Tag under CONCEVOIR */}
              <div className="olha-tag opacity-0 pointer-events-none w-full flex justify-start ml-2">
                <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium opacity-60 text-foreground">
                  RATIO 1,618 — v3.0
                </span>
              </div>

              {/* Line 2: LE [GAP] FUTUR - ALIGN CENTER */}
              <div className="w-full flex justify-center items-center gap-10">
                <AnimatedTitle
                  text="LE"
                  sizeClass="text-[12vw]"
                  trigger="event"
                  delay={0.15}
                  className="font-bebas text-foreground font-black tracking-tighter mix-blend-difference"
                  staggerFrom="start"
                />
                <div
                  ref={slotRef}
                  className="w-[18vw] h-[10vw] flex-shrink-0"
                />
                <AnimatedTitle
                  text="FUTUR"
                  sizeClass="text-[12vw]"
                  trigger="event"
                  delay={0.25}
                  className="font-bebas text-foreground font-black tracking-tighter mix-blend-difference"
                  staggerFrom="start"
                />
              </div>

              {/* Subtitle above DÈS AUJOURD'HUI */}
              <div className="olha-tag opacity-0 pointer-events-none w-full flex justify-end mr-2">
                <span className="text-[10px] md:text-xs font-serif italic tracking-[0.15em] uppercase opacity-80 text-foreground">
                  Architecture of Balance
                </span>
              </div>

              {/* Line 3: DÈS AUJOURD'HUI - ALIGN END */}
              <div className="w-full flex justify-end">
                <AnimatedTitle
                  text="DÈS AUJOURD'HUI"
                  sizeClass="text-[12vw]"
                  trigger="event"
                  delay={0.4}
                  className="font-bebas text-foreground font-black tracking-tighter mix-blend-difference"
                  staggerFrom="center"
                />
              </div>
            </div>

            {/* ══════════════ MOBILE / TABLET TITLE ══════════════ */}
            <div className="md:hidden flex flex-col items-start w-full px-4 sm:px-8">
              <AnimatedTitle
                text="CONCEVOIR"
                sizeClass="text-[16vw] sm:text-[14vw]"
                trigger="event"
                delay={0}
                className="font-bebas text-foreground leading-none font-black tracking-tighter"
              />
              {/* Mobile tag */}
              <span className="olha-tag opacity-0 text-[8px] sm:text-[10px] font-sans tracking-[0.2em] uppercase font-medium opacity-70 mt-0.5 ml-1">
                RATIO 1,618 — v3.0
              </span>
              <div className="flex items-center justify-end gap-3 sm:gap-4 w-full">
                <AnimatedTitle
                  text="LE"
                  sizeClass="text-[16vw] sm:text-[14vw]"
                  trigger="event"
                  delay={0.1}
                  className="font-bebas text-foreground leading-none font-black tracking-tighter"
                />
                <div className="w-10 sm:w-14 h-px bg-foreground/30" />
                <AnimatedTitle
                  text="FUTUR"
                  sizeClass="text-[16vw] sm:text-[14vw]"
                  trigger="event"
                  delay={0.2}
                  className="font-bebas text-foreground leading-none font-black tracking-tighter"
                />
              </div>
              {/* Mobile subtitle */}
              <span className="olha-tag opacity-0 self-end text-[8px] sm:text-[10px] font-serif italic tracking-[0.15em] uppercase opacity-80 mb-0.5 mr-1">
                Architecture of Balance
              </span>
              <AnimatedTitle
                text="DÈS AUJOURD'HUI"
                sizeClass="text-[16vw] sm:text-[14vw]"
                trigger="event"
                delay={0.3}
                className="font-bebas text-foreground leading-none font-black tracking-tighter self-end"
              />
            </div>
          </div>
        </SectionWrapper>

        {/* ══════════════ BOTTOM BAR — Desktop ══════════════ */}
        <div className="hidden md:flex absolute bottom-6 left-0 right-0 px-12 z-40 items-end justify-between pointer-events-none">
          {/* LEFT: Services */}
          <div className="olha-tag opacity-0 flex flex-col gap-0.5 parallax-fast">
            {["/ Art Direction", "/ Web Design", "/ Development"].map(
              (service, idx) => (
                <span
                  key={idx}
                  className="text-[10px] lg:text-xs font-sans uppercase tracking-[0.15em] font-medium opacity-70"
                >
                  {service}
                </span>
              ),
            )}
          </div>

          {/* CENTER: Scroll Indicator */}
          <div className="olha-tag opacity-0 flex flex-col items-center gap-1.5">
            <span className="text-[8px] font-sans uppercase tracking-[0.3em] font-medium opacity-40">
              Scroll
            </span>
            <div className="w-px h-6 bg-foreground/40 origin-top animate-pulse" />
          </div>

          {/* RIGHT: Status */}
          <div className="olha-tag opacity-0 flex items-center gap-3 parallax-slow">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
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
        <div className="md:hidden absolute bottom-20 left-0 right-0 px-4 sm:px-8 z-40 flex items-end justify-between pointer-events-none">
          {/* LEFT: Services */}
          <div className="olha-tag opacity-0 flex flex-col gap-0.5">
            {["Art Direction", "Web Design", "Development"].map(
              (service, idx) => (
                <span
                  key={idx}
                  className="text-[11px] sm:text-sm font-sans uppercase tracking-[0.15em] font-medium opacity-80"
                >
                  / {service}
                </span>
              ),
            )}
          </div>

          {/* RIGHT: Status + scroll */}
          <div className="olha-tag opacity-0 flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-green-500"></span>
              </span>
              <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase opacity-50">
                Disponible
              </span>
            </div>
            <div className="w-px h-5 bg-foreground/15 origin-top animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}
