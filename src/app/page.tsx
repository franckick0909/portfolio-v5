"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import SplashCursor from "@/components/cursor/SplashCursor";
import Header from "@/components/navigation/Header";
import Preloader from "@/components/preloader/Preloader";

import AboutSection from "@/components/sections/AboutSection";
import BrandSection from "@/components/sections/BrandSection";
import AnimatedTitle from "@/components/AnimatedTitle";
import FaqSection from "@/components/sections/FaqSection";
import FooterSection from "@/components/sections/FooterSection";
import HeroSection from "@/components/sections/HeroSection";
import BrandHeader from "@/components/sections/BrandHeader";
import ServicesSection from "@/components/sections/ServicesSection";
import WorksSection from "@/components/sections/WorksSection";

import { I18nProvider } from "@/lib/i18n";
import SectionWrapper from "@/components/SectionWrapper";
import ManifestoSection from "@/components/sections/ManifestoSection";
import AboutHeader from "@/components/sections/AboutHeader";
import WorkHeader from "@/components/sections/WorkHeader";
import FaqHeader from "@/components/sections/FaqHeader";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [cursorReady, setCursorReady] = useState(false);

  // Header + Navigation: caché pendant le preloader, révélé au preloaderComplete
  useEffect(() => {
    const handlePreloaderComplete = () => {
      // Mount cursor only after preloader exits (avoids competing for GPU)
      setCursorReady(true);
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);
    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Expand title lines left-to-right
    gsap.fromTo(
      ".title-rule",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: "power1.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        },
      },
    );

    // === TRANSITION 1: Warm Grey → Black (at pre-brand) ===
    /*
    gsap.to(mainRef.current, {
      backgroundColor: "#050505",
      color: "#ffffff",
      ease: "none",
      scrollTrigger: {
        trigger: "#pre-brand",
        start: "top 60%", // Fade in slowly as text appears
        end: "bottom 30%",
        scrub: true,
      },
    });
    */

    // === TRANSITION 2: Black → Warm Grey (at footer) ===
    /*
    gsap.to(mainRef.current, {
      backgroundColor: "#E8E5E0",
      color: "#0a0a0a",
      ease: "none",
      scrollTrigger: {
        trigger: "#footer",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    });
    */
  });

  return (
    <I18nProvider>
      <Preloader />
      {cursorReady && <SplashCursor />}
      <Header />

      <main
        ref={mainRef}
        className="relative min-h-screen bg-[#E8E5E0] text-[#0a0a0a]"
      >
        <div className="grain-overlay" />

        <div className="relative w-full">
          <HeroSection />
          <BrandHeader />
        </div>

        <BrandSection />
        <AboutHeader />
        <ManifestoSection />
        <ServicesSection />
        <FaqHeader />
        <FaqSection />
        <WorkHeader />
        <WorksSection />
        <FooterSection />
      </main>
    </I18nProvider>
  );
}
