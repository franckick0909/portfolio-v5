"use client";

import { useI18n } from "@/lib/i18n";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import ArrowButton from "@/components/ui/ArrowButton";

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
      className="relative w-full min-h-[calc(100vh-5vh)] flex flex-col items-center justify-center px-6 md:px-12 z-40 bg-transparent overflow-hidden"
      style={{ perspective: "1000px" }} // Nécessaire pour le rotateX 3D
    >
      {/* Micro-typographies (Tags éditoriaux) */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-sans text-background/80">
        [ 01 ] EXPERTISE
      </div>
      <div className="absolute top-8 right-8 md:top-12 md:right-12 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-sans text-background/80 text-right">
        VISION & APPROACH
      </div>

      <div className="absolute left-8 md:left-12 w-2/3 md:w-1/2 pointer-events-none mt-8 md:mt-0">
        <h4 
          ref={textRef}
          className="text-[clamp(2rem,3vw,5rem)] font-serif tracking-tight leading-tight font-medium mix-blend-difference opacity-90 text-background text-start"
        >
          {t.heroExperience}
        </h4>
      </div>

      {/* Étiquette Projet Récent (légende de l'image portal) */}
      <a href="#works" className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex flex-col items-end gap-3 group cursor-pointer pointer-events-auto">
        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-sans text-background/80 group-hover:text-background transition-colors duration-300">
          PROJETS RÉCENTS
        </span>
        <ArrowButton variant="light" className="opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      </a>
    </section>
  );
}