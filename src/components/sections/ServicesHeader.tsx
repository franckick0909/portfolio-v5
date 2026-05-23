"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function ServicesHeader() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate the line drawing from left to right
      gsap.fromTo(
        ".services-title-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section 
      ref={container} 
      className="relative flex flex-col z-40 py-24 md:py-32 bg-[#E8E5E0] text-[#0a0a0a]"
    >
      <div className="w-full max-w-max px-6 md:px-16">
        <div className="hidden md:block">
          <AnimatedTitle
            text="NOS SERVICES"
            sizeClass="text-[clamp(3.5rem,11vw,13rem)]"
            className="font-mona leading-none tracking-tight uppercase z-40"
            trigger="scroll"
          />
        </div>
        <div className="block md:hidden">
          <AnimatedTitle
            text="SERVICES"
            sizeClass="text-[clamp(3.5rem,11vw,13rem)]"
            className="font-mona leading-none tracking-tight uppercase z-40"
            trigger="scroll"
          />
        </div>
        <div
          className="services-title-rule w-full h-[2px] md:h-1 opacity-80 origin-left bg-current mt-2"
        />
      </div>
    </section>
  );
}
