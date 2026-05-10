"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

const ProjectsCanvas = dynamic(() => import("../ProjectsCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=2000",
        pin: true,
        onEnter: () => {
          gsap.fromTo(
            ".swipe-cta",
            { opacity: 0, x: -20 },
            {
              opacity: 0.5,
              x: 0,
              duration: 1,
              yoyo: true,
              repeat: -1,
              ease: "power2.inOut",
            },
          );
        },
      });
    },
    { scope: container },
  );

  return (
    <section
      id="projects"
      ref={container}
      className="h-screen w-full relative overflow-hidden bg-black flex items-center justify-center cursor-ew-resize z-40"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-x-0 top-[15vh] h-px bg-zinc-900 z-0"></div>
      <div className="absolute inset-x-0 bottom-[15vh] h-px bg-zinc-900 z-0"></div>

      {/* Titre Arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
        <h2 className="text-[25vw] font-(family-name:--font-oswald) uppercase font-bold text-white whitespace-nowrap">
          SHOWROOM
        </h2>
      </div>

      {/* THREE.JS Environment (dynamiquement isolé) */}
      <div className="absolute inset-0 z-10 transition-opacity duration-1000 delay-500">
        {mounted && <ProjectsCanvas />}
      </div>

      {/* UI Elements */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h3 className="text-xl font-(family-name:--font-oswald) font-bold tracking-widest text-[#f0f0f0]">
          [ WORKS ]
        </h3>
      </div>

      <div className="swipe-cta absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-4 text-white">
        <div className="w-12 h-px bg-current"></div>
        <span className="font-sans text-xs tracking-[0.3em] uppercase">
          Drag to explore
        </span>
        <div className="w-12 h-px bg-current"></div>
      </div>
    </section>
  );
}
