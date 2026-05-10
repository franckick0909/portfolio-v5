"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function WorkHeader() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titleRule = container.current?.querySelector(".works-title-rule");
    if (titleRule) {
      gsap.fromTo(
        titleRule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: titleRule,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full pt-32 pb-16 md:pt-48 md:pb-24 bg-[#E8E5E0] text-[#0a0a0a] z-50">
      <div className="w-full flex flex-col-reverse md:flex-row justify-between md:items-end px-6 md:px-16 gap-12 max-w-[1800px] mx-auto">
        <p className="max-w-sm text-sm uppercase tracking-widest opacity-60 font-sans">
          Sélection de projets récents démontrant notre expertise en design interactif et développement sur-mesure.
        </p>
        <div className="flex flex-col w-full md:w-auto md:items-end">
          <AnimatedTitle 
            text="TRAVAUX" 
            sizeClass="text-[clamp(4rem,12vw,14rem)]" 
            className="font-bebas leading-none tracking-tight uppercase md:text-right"
            trigger="scroll"
          />
          <AnimatedTitle 
            text="RÉCENTS" 
            sizeClass="text-[clamp(4rem,12vw,14rem)]" 
            className="font-bebas leading-none tracking-tight uppercase md:text-right"
            trigger="scroll"
          />
          {/* Animated Line */}
          <div className="works-title-rule w-full h-[2px] md:h-[3px] bg-current mt-4 md:mt-8 origin-right opacity-80" />
        </div>
      </div>
    </section>
  );
}
