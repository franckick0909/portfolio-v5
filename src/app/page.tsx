"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import FluidCursor from "@/components/cursor/FluidCursor";
import Header from "@/components/navigation/Header";
import Preloader from "@/components/preloader/Preloader";

import AboutSection from "@/components/sections/AboutSection";
import BrandSection from "@/components/sections/BrandSection";
import FaqSection from "@/components/sections/FaqSection";
import FooterSection from "@/components/sections/FooterSection";
import HeroSection from "@/components/sections/HeroSection";
import BrandHeader from "@/components/sections/BrandHeader";
import ServicesSection from "@/components/sections/ServicesSection";
import WorksSection from "@/components/sections/WorksSection";

import { I18nProvider } from "@/lib/i18n";
import ManifestoSection from "@/components/sections/ManifestoSection";
import AboutHeader from "@/components/sections/AboutHeader";
import WorkHeader from "@/components/sections/WorkHeader";
import FaqHeader from "@/components/sections/FaqHeader";
import ServicesHeader from "@/components/sections/ServicesHeader";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [cursorReady, setCursorReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Header + Navigation: caché pendant le preloader, révélé au preloaderComplete
  useEffect(() => {
    setIsDesktop(window.innerWidth > 1024);
    
    const handlePreloaderComplete = () => {
      // Mount cursor only after preloader exits (avoids competing for GPU)
      setTimeout(() => {
        setCursorReady(true);
      }, 1500);
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);
    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
  });

  return (
    <I18nProvider>
      <Preloader />
      {cursorReady && isDesktop && <FluidCursor />}
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
        <ServicesHeader />
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
