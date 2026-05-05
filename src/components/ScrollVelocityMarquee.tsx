"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

interface ScrollVelocityMarqueeProps {
  className?: string;
}

export default function ScrollVelocityMarquee({ className = "" }: ScrollVelocityMarqueeProps) {
  return (
    <section className={`relative w-full overflow-hidden z-30  ${className}`}>
      <ScrollVelocityContainer className="text-[clamp(3rem,8vw,8rem)] font-bold tracking-tighter uppercase font-sans">
        {/* Ligne 1 → vers la droite */}
        <ScrollVelocityRow baseVelocity={3} direction={1} className="">
          <span className="px-4 bg-clip-text text-transparent drop-shadow-sm drop-shadow-black bg-background">
            NEXT.JS • REACT • TYPESCRIPT • GSAP • THREE.JS • TAILWIND •{" "}
          </span>
        </ScrollVelocityRow>

        {/* Ligne 2 → vers la gauche */}
        <ScrollVelocityRow baseVelocity={1} direction={-1}>
          <span className="px-4 bg-clip-text text-transparent drop-shadow-sm drop-shadow-black bg-background">
            UI/UX DESIGN • WEB DEVELOPMENT • ART DIRECTION • CREATIVE CODE •{" "}
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      {/* Dégradés latéraux pour un effet premium */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10" />
    </section>
  );
}
