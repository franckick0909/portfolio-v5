"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function AboutHeader() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate the line drawing from left to right
      gsap.fromTo(
        ".about-title-rule",
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
      id="about" 
      ref={container} 
      className="relative flex flex-col z-40 py-24 md:py-32 bg-foreground text-background"
    >
      <div className="w-full max-w-max px-6 md:px-16">
        <AnimatedTitle
          text="A PROPOS"
          sizeClass="text-[clamp(3.5rem,11vw,13rem)]"
          className="font-mona text-background leading-none tracking-tight uppercase z-40"
          trigger="scroll"
        />
        <div
          className="about-title-rule w-full h-[2px] md:h-1 opacity-80 origin-left bg-background"
        />
      </div>
    </section>
  );
}
