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

    // Découpage du texte
    const split = new SplitType(textRef.current, { types: "lines,words" } as any);
    const splitSubtitles = new SplitType(".anim-bh-subtitle", { types: "chars" } as any);

    // Wrapper pour l'effet Masked
    const wrapElements = (elems: HTMLElement[], isInline = false) => {
      elems.forEach(el => {
        const wrapper = document.createElement("div");
        wrapper.className = "mask-wrapper";
        wrapper.style.overflow = "hidden";
        wrapper.style.display = isInline ? "inline-block" : "block";
        if (isInline) {
           wrapper.style.paddingBottom = "0.2em";
           wrapper.style.marginBottom = "-0.2em";
        } else {
           wrapper.style.paddingBottom = "0.2em";
           wrapper.style.marginBottom = "-0.2em";
        }
        el.parentNode?.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      });
    };

    if (split.lines) wrapElements(split.lines, false);
    if (splitSubtitles.chars) wrapElements(splitSubtitles.chars, true);

    // On encapsule chaque mot dans un span interne pour l'Observer
    const inners: HTMLElement[] = [];
    split.words?.forEach(word => {
      const inner = document.createElement('span');
      inner.innerHTML = word.innerHTML;
      word.innerHTML = '';
      word.appendChild(inner);
      word.style.display = 'inline-flex';
      word.style.overflow = 'visible';
      inner.style.display = 'inline-block';
      inner.style.transformOrigin = "bottom center";
      inners.push(inner);
    });

    let inView = false;

    // 1. Animation d'apparition au scroll (Lignes + Lettres Masked)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
        onEnter: () => inView = true,
        onLeave: () => inView = false,
        onEnterBack: () => inView = true,
        onLeaveBack: () => inView = false,
      }
    });

    if (splitSubtitles.chars && splitSubtitles.chars.length > 0) {
      tl.from(splitSubtitles.chars, {
        yPercent: 120,
        duration: 0.8,
        stagger: 0.02,
        ease: "power4.out"
      }, 0);
    }

    if (split.lines && split.lines.length > 0) {
      tl.from(split.lines, {
        yPercent: 120,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        onComplete: () => {
          // Permet au skew (Observer) de déborder du masque une fois l'animation finie
          split.lines?.forEach(line => {
            if (line.parentElement?.classList.contains('mask-wrapper')) {
              line.parentElement.style.overflow = "visible";
            }
          });
        }
      }, 0.2); // Légèrement après les sous-titres
    }

    // 2. L'effet magique avec OBSERVER : 
    // Distorsion élastique du texte en fonction de la vélocité du scroll !
    const observer = ScrollTrigger.observe({
      target: window,
      type: "wheel,touch",
      onChangeY: (self) => {
        if (!inView || inners.length === 0) return;
        
        const velocity = self.velocityY;
        const skew = gsap.utils.clamp(-15, 15, velocity * -0.005);
        const scale = 1 + Math.abs(velocity * 0.0001);
        
        inners.forEach((inner, i) => {
          gsap.to(inner, {
            skewX: skew,
            scaleY: scale,
            y: skew * 0.5,
            duration: 0.3,
            ease: "power2.out",
            delay: i * 0.003,
            overwrite: "auto",
          });
        });
      },
      onStop: () => {
        if (!inView || inners.length === 0) return;
        
        inners.forEach((inner, i) => {
          gsap.to(inner, {
            skewX: 0,
            scaleY: 1,
            y: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
            delay: i * 0.003,
            overwrite: "auto",
          });
        });
      }
    });

    return () => {
      observer.kill();
      split.revert();
      splitSubtitles.revert();
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
      <div className="anim-bh-subtitle absolute top-8 left-8 md:top-12 md:left-12 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-sans text-background/80">
        [ 01 ] EXPERTISE
      </div>
      <div className="anim-bh-subtitle absolute top-8 right-8 md:top-12 md:right-12 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-sans text-background/80 text-right">
        VISION & APPROACH
      </div>

      <div className="absolute left-8 md:left-12 w-2/3 md:w-1/2 pointer-events-none mt-8 md:mt-0">
        <h4 
          ref={textRef}
          className="text-[clamp(1.5rem,3.5vw,3.5rem)] font-serif leading-[1.15] tracking-tight font-medium text-balance mix-blend-difference opacity-90 text-background text-start"
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