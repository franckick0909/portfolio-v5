"use client";
import AnimatedTitle from "@/components/AnimatedTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * HeroSection - Style Olha Lazarieva
 */
export default function HeroSection() {
  const { t } = useI18n();
  const container = useRef<HTMLDivElement>(null);
  const titleWrapper = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  // Vidéo: commence invisible
  const [videoStyle, setVideoStyle] = useState<React.CSSProperties>({
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "33.333333%",
    maxWidth: "448px",
    aspectRatio: "16 / 9",
    opacity: 0,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: 106, // Original high z-index
    pointerEvents: "none",
    visibility: "hidden",
  });

  // Écoute l'événement imagesImploded
  const handleImagesImploded = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    
    if (detail && detail.x !== undefined && detail.y !== undefined && container.current) {
      // Le Preloader est en 'fixed inset-0', donc detail.x et detail.y sont les coordonnées viewport.
      // Comme le HeroSection fait exactement 100vw et 100vh, ces coordonnées correspondent
      // exactement à la position absolue souhaitée à l'intérieur du HeroSection.
      // On ne soustrait pas heroRect.top car si on recharge la page plus bas, heroRect.top est négatif
      // ce qui fausserait complètement le calcul !
      const relativeX = detail.x;
      const relativeY = detail.y;
      
      // Clamping de sécurité
      const heroRect = container.current.getBoundingClientRect();
      const clampedX = Math.max(0, Math.min(relativeX, (window.innerWidth || 0) - (detail.width || 0)));
      const clampedY = Math.max(0, Math.min(relativeY, (window.innerHeight || 0) - (detail.height || 0)));

      setVideoStyle(prev => ({
        ...prev,
        position: "absolute",
        left: `${clampedX}px`,
        top: `${clampedY}px`,
        width: `${detail.width}px`,
        height: `${detail.height}px`,
        transform: "scale(0) rotate(-15deg)",
        visibility: "visible",
      }));
    } else {
      setVideoStyle(prev => ({
        ...prev,
        visibility: "visible",
      }));
    }

    // Anime l'apparition : scale + rotation fluide
    gsap.fromTo(
      videoRef.current,
      {
        scale: 0,
        rotate: -15,
        opacity: 0,
      },
      {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        delay: 0.5, // Petit délai pour laisser les images d'implosion disparaître
      }
    );
  }, []);

  useEffect(() => {
    window.addEventListener("imagesImploded", handleImagesImploded);
    return () => {
      window.removeEventListener("imagesImploded", handleImagesImploded);
    };
  }, [handleImagesImploded]);

  useEffect(() => {
    const handlePreloaderComplete = () => {
      // Reveal micro-tags
      gsap.fromTo(
        ".olha-tag",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.5,
        },
      );
      // Expand title lines left-to-right
      gsap.fromTo(
        ".title-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power1.out",
          stagger: 0.12,
          delay: 1.5,
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
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      scrollTl.to(titleWrapper.current, { yPercent: -50, ease: "none" }, 0);
      scrollTl.to(".parallax-fast", { yPercent: -80, ease: "none" }, 0);
      scrollTl.to(".parallax-slow", { yPercent: -30, ease: "none" }, 0);
    },
    { scope: container },
  );

  return (
    <section
      id="hero"
      ref={container}
      className="h-screen w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-transparent text-foreground overflow-hidden "
    >
      <SectionWrapper className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <div ref={titleWrapper} className="relative z-10 pointer-events-none flex flex-col items-center w-full mb-10 -mt-32 md:mt-0 md:mb-10">
          <div className="olha-tag opacity-0 pointer-events-none parallax-fast text-start w-full px-4 md:px-12 mb-4">
            <span className="text-xs md:text-sm font-sans tracking-[0.1em] uppercase font-bold opacity-80 text-foreground">
              RATIO 1,618 // v3.0
            </span>
          </div>

          <div className="hidden md:block w-max">
            {/* Top rule — animates in on preloaderComplete */}
            <div
              className="title-rule w-full h-px opacity-60 origin-left bg-foreground"
              style={{ transform: "scaleX(0)" }}
            />
            <AnimatedTitle
              text="CREATIVE DESIGNER"
              sizeClass="text-[clamp(3rem,13vw,15rem)]"
              trigger="event"
              delay={0}
              className="font-anton text-foreground text-center leading-none font-semibold"
              staggerFrom="center"
            />
            {/* Bottom rule */}
            <div
              className="title-rule w-full h-1 bg-foreground opacity-60 origin-right"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <div className="md:hidden flex flex-col items-start gap-2">
            <AnimatedTitle
              text="CREATIVE"
              sizeClass="text-[18vw]"
              trigger="event"
              delay={0}
              className="font-anton text-foreground leading-none font-semibold"
            />
            <AnimatedTitle
              text="DESIGNER"
              sizeClass="text-[18vw]"
              trigger="event"
              delay={0.15}
              className="font-anton text-foreground leading-none -mt-2 font-semibold"
            />
          </div>

          <div className="olha-tag opacity-0 pointer-events-none parallax-slow text-end w-full px-4 md:px-12">
            <span className="text-xs md:text-sm font-serif italic tracking-[0.12em] uppercase opacity-90 text-foreground">
              Architecture of Balance
            </span>
          </div>
        </div>
      </SectionWrapper>

      {/* VIDÉO */}
      <div ref={videoRef} style={videoStyle} className="pointer-events-none z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="olha-tag opacity-0 absolute bottom-24 left-4 md:bottom-16 md:left-12 flex flex-col gap-1 pointer-events-none parallax-fast z-30 tracking-widest">
        {["/ ART DIRECTION", "/ WEB DESIGN", "/ DEVELOPMENT"].map((service, idx) => (
          <span key={idx} className="text-[10px] md:text-xs font-sans uppercase font-bold opacity-70">{service}</span>
        ))}
      </div>

      <div className="olha-tag opacity-0 absolute bottom-20 right-4 md:bottom-7 md:right-12 flex flex-col items-end pointer-events-none parallax-slow z-30">
        <div className="flex items-center gap-3 opacity-80">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
          </span>
          <span className="text-[9px] md:text-[10px] mix-blend-difference font-sans font-bold tracking-[0.25em] uppercase">Available for Freelance</span>
        </div>
        <span className="text-xs md:text-sm font-serif uppercase tracking-[0.4em] opacity-90 mix-blend-difference">Dordogne, FR</span>
      </div>
    </section>
  );
}
