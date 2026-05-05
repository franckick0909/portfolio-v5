"use client";

import { useI18n } from "@/lib/i18n";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

export default function BrandHeader() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!textRef.current) return;

    // Découpage du texte en mots et en lignes
    const split = new SplitType(textRef.current, { types: "lines,words" });

    // On encapsule chaque mot dans un span interne pour pouvoir cumuler 
    // l'animation d'apparition et l'animation de distorsion de l'Observer
    const inners: HTMLElement[] = [];
    split.words?.forEach(word => {
      const inner = document.createElement('span');
      inner.innerHTML = word.innerHTML;
      word.innerHTML = '';
      word.appendChild(inner);
      word.style.display = 'inline-flex';
      word.style.overflow = 'visible'; // Permet à la distorsion de déborder
      inner.style.display = 'inline-block';
      inner.style.transformOrigin = "bottom center";
      inners.push(inner);
    });

    // 1. Animation d'apparition au scroll (ScrollTrigger classique)
    gsap.fromTo(split.words, 
      { 
        y: 60, 
        opacity: 0,
        rotateX: -90 // Pliage 3D
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 50%",
          toggleActions: "play reverse play reverse",
        }
      }
    );

    // 1.b Animation de la flèche (Apparition puis flottement)
    gsap.fromTo(".arrow-container", 
      { opacity: 0, y: -20 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play reverse play reverse",
        }
      }
    );

    gsap.to(".arrow-svg", {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Variable pour savoir si on est dans la section
    let inView = false;
    
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => inView = true,
      onLeave: () => inView = false,
      onEnterBack: () => inView = true,
      onLeaveBack: () => inView = false,
    });

    // 2. L'effet magique avec OBSERVER : 
    // Distorsion élastique du texte en fonction de la vélocité du scroll !
    const observer = ScrollTrigger.observe({
      target: window,
      type: "wheel,touch",
      onChangeY: (self) => {
        if (!inView || inners.length === 0) return;
        
        const velocity = self.velocityY;
        // On limite la distorsion pour que ça reste lisible
        const skew = gsap.utils.clamp(-15, 15, velocity * -0.005);
        const scale = 1 + Math.abs(velocity * 0.0001);
        
        inners.forEach((inner, i) => {
          gsap.to(inner, {
            skewX: skew,
            scaleY: scale,
            y: skew * 0.5,
            duration: 0.3,
            ease: "power2.out",
            delay: i * 0.003, // Crée une légère "vague" physique
            overwrite: "auto",
          });
        });
      },
      onStop: () => {
        if (!inView || inners.length === 0) return;
        
        // Retour élastique à la normale quand on arrête de scroller
        inners.forEach((inner, i) => {
          gsap.to(inner, {
            skewX: 0,
            scaleY: 1,
            y: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)", // Effet ressort
            delay: i * 0.003,
            overwrite: "auto",
          });
        });
      }
    });

    return () => {
      observer.kill();
      split.revert();
    };
  }, { scope: sectionRef });

  return (
    <section 
      id="pre-brand" 
      ref={sectionRef}
      className="relative w-full min-h-[calc(100vh-5vh)] flex flex-col items-center justify-center px-6 md:px-12 z-10 bg-foreground overflow-hidden"
      style={{ perspective: "1000px" }} // Nécessaire pour le rotateX 3D
    >
      {/* Micro-typographies (Tags éditoriaux) */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-sans text-background/40">
        [ 01 ] EXPERTISE
      </div>
      <div className="absolute top-8 right-8 md:top-12 md:right-12 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-sans text-background/40 text-right">
        VISION & APPROACH
      </div>

      <div className="max-w-full w-full text-balance pointer-events-none mt-12 md:mt-0">
        <h4 
          ref={textRef}
          className="text-[clamp(2rem,3vw,5rem)] font-serif tracking-tight leading-tight font-medium italic mix-blend-difference opacity-90 text-background"
        >
          {t.heroExperience}
        </h4>
      </div>

      {/* Flèche directionnelle animée */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 arrow-container">
        <span className="text-[9px] uppercase tracking-[0.4em] font-sans text-background/50">Scroll</span>
        <svg 
          width="12" 
          height="40" 
          viewBox="0 0 14 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-svg"
        >
          <path d="M7 0L7 38M7 38L1 32M7 38L13 32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-background/50"/>
        </svg>
      </div>
    </section>
  );
}