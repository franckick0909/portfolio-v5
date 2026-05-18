"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function FaqHeader() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titleRule = container.current?.querySelector(".faq-title-rule");
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
    <section ref={container} className="relative w-full pt-32 pb-8 md:pt-48 md:pb-16 bg-foreground text-background z-40">
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between px-6 md:px-16 gap-8 max-w-[1800px] mx-auto">
        
        <div className="flex flex-col w-full md:w-auto">
          <span className="text-background/60 text-xs md:text-sm tracking-[0.3em] uppercase font-sans mb-4 block">
            Des questions ?
          </span>
          <AnimatedTitle
            text="F.A.Q"
            sizeClass="text-[clamp(3.5rem,11vw,13rem)]"
            className="font-mona leading-none tracking-tight uppercase"
            trigger="scroll"
          />
          {/* Animated Line */}
          <div className="faq-title-rule w-full h-[2px] md:h-[3px] bg-current mt-4 md:mt-8 origin-left opacity-80" />
        </div>
        
        <div className="pb-2 md:pb-6">
          <p className="max-w-md text-[clamp(1rem,1.2vw,1.3rem)] text-background/80 leading-relaxed font-sans">
            Retrouvez les réponses aux questions les plus fréquentes. Pour toute autre demande, n'hésitez pas à nous contacter directement.
          </p>
        </div>

      </div>
    </section>
  );
}
