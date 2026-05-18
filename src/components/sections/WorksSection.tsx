"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

// Placeholder images for the projects
const projectImages = [
  "/projets/tatoo/tatoo1.jpg",
  "/projets/harmonie/harmonie1.jpg",
  "/projets/imo/imo1.jpg",
  "/projets/sophie/sophie1.png",
  "/projets/movie/movie1.jpg",
];

export default function WorksSection() {
  const container = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const { t } = useI18n();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Custom Cursor Setup ---
    const cursor = cursorRef.current;
    let removeListener: (() => void) | undefined;
    
    if (cursor) {
      gsap.set(cursor, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });

      const onMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("mousemove", onMouseMove);
      removeListener = () => window.removeEventListener("mousemove", onMouseMove);
    }

    // --- Fade up reveal & Hover Animations ---
    const cards = gsap.utils.toArray(".project-card") as HTMLElement[];
    
    cards.forEach((card) => {
      // Reveal Animation
      gsap.fromTo(card, 
        { opacity: 0, y: 100 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Hover Interactive Logic (Continuous Liquid / Flag + Custom Cursor)
      const liquidContainer = card.querySelector('.liquid-container') as HTMLElement;
      const imageWrapper = card.querySelector('.image-wrapper') as HTMLElement;
      const image = card.querySelector('.parallax-img') as HTMLElement;
      const displacement = card.querySelector('.liquid-displacement') as HTMLElement;
      const turbulence = card.querySelector('.liquid-turbulence') as HTMLElement;

      if (!liquidContainer || !imageWrapper || !image || !displacement || !turbulence) return;

      let waveTween: gsap.core.Tween;
      const proxy = { bf: 0.01 };

      liquidContainer.addEventListener("mouseenter", () => {
        if (cursor) {
          gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
        }
        if (arrowRef.current) {
          gsap.killTweensOf(arrowRef.current);
          gsap.fromTo(arrowRef.current, 
            { x: -25, y: 25, opacity: 0 }, 
            { x: 0, y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: "power3.out" }
          );
        }
        // Liquid distortion scale in (plus doux)
        gsap.to(displacement, { attr: { scale: 20 }, duration: 2, ease: "power2.out" });
        gsap.to(image, { scale: 1.08, duration: 2, ease: "power2.out" });

        // Continuous wave flow (Flag/Water effect - ralenti et adouci)
        proxy.bf = 0.01;
        waveTween = gsap.to(proxy, {
          bf: 0.015, // variation beaucoup plus subtile
          duration: 6, // deux fois plus lent
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          onUpdate: () => {
            turbulence.setAttribute("baseFrequency", `0.01 ${proxy.bf}`);
          }
        });
      });

      liquidContainer.addEventListener("mouseleave", () => {
        if (cursor) {
          gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.4, ease: "power2.in" });
        }
        if (arrowRef.current) {
          gsap.killTweensOf(arrowRef.current);
          gsap.to(arrowRef.current, { 
            x: 25, 
            y: -25, 
            opacity: 0, 
            duration: 0.4, 
            ease: "power3.in" 
          });
        }
        // Liquid distortion out
        gsap.to(displacement, { attr: { scale: 0 }, duration: 1.2, ease: "power3.out" });
        gsap.to(image, { scale: 1, duration: 1.2, ease: "power3.out" });
        
        if (waveTween) waveTween.kill();
      });
    });

    // --- Parallax effect for images ---
    const images = gsap.utils.toArray(".parallax-img") as HTMLElement[];
    images.forEach((img) => {
      gsap.fromTo(img,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    return () => {
      if (removeListener) removeListener();
    };

  }, { scope: container });

  return (
    <section ref={container} id="works" className="relative w-full pt-16 pb-32 md:pt-32 md:pb-48 bg-[#050505] text-[#F5F5F5] z-40 overflow-hidden">

      {/* Asymmetrical Grid */}
      <div className="w-full px-6 md:px-16 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-32 gap-y-24 md:gap-y-0">
          {t.worksProjects.map((project, idx) => {
            const isRight = idx % 2 !== 0;
            return (
              <a
                href={`/projets/${project.name.toLowerCase().replace(/[. ]/g, "_")}`}
                key={idx}
                className={`project-card group relative flex flex-col w-full cursor-pointer ${isRight ? 'md:mt-64' : 'md:mb-64'}`}
              >
                {/* Image Container with Liquid Effect & Custom Cursor tracking */}
                <div className={`liquid-container relative w-full cursor-none ${isRight ? 'aspect-[3/4] md:aspect-[4/5]' : 'aspect-[4/5] md:aspect-[3/4]'}`}>
                  
                  {/* Unique SVG Filter per card for isolated liquid effect */}
                  <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none">
                    <filter id={`liquid-filter-${idx}`}>
                      <feTurbulence 
                        className="liquid-turbulence"
                        type="fractalNoise" 
                        baseFrequency="0.01 0.01" 
                        numOctaves="2" 
                        result="noise" 
                        seed={idx}
                      />
                      <feDisplacementMap 
                        className="liquid-displacement"
                        in="SourceGraphic" 
                        in2="noise" 
                        scale="0" 
                        xChannelSelector="R" 
                        yChannelSelector="G" 
                      />
                    </filter>
                  </svg>

                  <div 
                    className="image-wrapper absolute inset-0 overflow-hidden bg-[#111]"
                  >
                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                    <div 
                      className="parallax-img absolute pointer-events-none"
                      style={{ 
                        filter: `url(#liquid-filter-${idx})`,
                        top: "-15%", 
                        left: "-5%", 
                        width: "110%", 
                        height: "130%" 
                      }}
                    >
                      <Image 
                        src={projectImages[idx % projectImages.length]} 
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-8 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full border border-[#F5F5F5] bg-transparent group-hover:bg-[#F5F5F5] transition-colors duration-300 ease-out shrink-0" />
                    <h3 className="font-bebas text-3xl md:text-5xl uppercase tracking-tight group-hover:tracking-normal transition-all duration-500">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center opacity-60 font-sans text-sm md:text-base uppercase tracking-widest pl-6 mt-2">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="w-full h-px bg-[#F5F5F5]/20 mt-4 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="w-full flex justify-center mt-32 md:mt-48 px-6">
        <button className="px-12 py-6 bg-[#F5F5F5] text-[#050505] font-semibold rounded-full hover:scale-105 hover:bg-white transition-all duration-300 uppercase text-xs md:text-sm tracking-[0.2em] cursor-pointer">
          Voir tous les projets
        </button>
      </div>
      {/* Global Custom Cursor for Project Cards */}
      <div 
        ref={cursorRef} 
        className="pointer-events-none fixed top-0 left-0 w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center z-[100] opacity-0 scale-0 shadow-2xl"
      >
        <svg 
          ref={arrowRef}
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-[#050505]"
        >
          <line x1="5" y1="19" x2="19" y2="5"></line>
          <polyline points="9 5 19 5 19 15"></polyline>
        </svg>
      </div>

    </section>
  );
}
