"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import SplitType from "split-type";

export default function AboutSection() {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // --- 1. Animation des blocs images (Scale + ClipPath comme Preloader) ---
      const images = gsap.utils.toArray(".about-image-wrapper");
      images.forEach((wrapper: any) => {
        // Le container s'agrandit et se dévoile
        gsap.fromTo(
          wrapper,
          { 
            scale: 0.6, 
            clipPath: "inset(20% 20% 20% 20% round 30px)",
            opacity: 0 
          },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            opacity: 1,
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
        
        // L'image à l'intérieur fait un léger parallax
        const imgElement = wrapper.querySelector("img");
        if (imgElement) {
          gsap.fromTo(
            imgElement,
            { scale: 1.3, yPercent: 15 },
            {
              scale: 1.1,
              yPercent: -15,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      // --- 2. Animation des textes ligne par ligne ---
      const textElements = gsap.utils.toArray(".split-text-lines");
      
      textElements.forEach((el: any) => {
        // Initialiser SplitType
        const split = new SplitType(el, { types: "lines", lineClass: "split-line" });
        
        // Créer un wrapper (lineParent) pour chaque ligne avec overflow hidden
        split.lines?.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.className = "line-wrapper";
          wrapper.style.overflow = "hidden";
          // On insère le wrapper avant la ligne, puis on déplace la ligne dedans
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        // Animer les lignes enfants (yPercent 100 -> 0)
        gsap.fromTo(
          split.lines,
          { yPercent: 120, rotation: 2, opacity: 0 },
          {
            yPercent: 0,
            rotation: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Nettoyage au demontage
      return () => {
        textElements.forEach((el: any) => {
          if ((el as any)._splitType) {
            (el as any)._splitType.revert();
          }
        });
      };
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative w-full min-h-screen px-6 md:px-16 py-32 bg-background overflow-hidden text-foreground z-40"
    >

      {/* DISPOSITION AÉRÉE ET ÉCLATÉE EN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-y-48 gap-x-8 w-full max-w-[100vw] overflow-hidden">
        
        {/* BLOCK 1: Intro Text + Image */}
        <div className="col-span-1 md:col-span-4 md:col-start-2 flex flex-col justify-center">
          <h3 className="split-text-lines text-4xl md:text-5xl font-serif italic mb-8">Qui suis-je</h3>
          <p className="split-text-lines text-lg md:text-xl opacity-80 leading-relaxed font-light">
            Je m'appelle Franck Chapelon et je suis un développeur web passionné. Je crée des expériences web uniques et engageantes.
          </p>
        </div>
        <div className="col-span-1 md:col-span-5 md:col-start-8">
          <div className="about-image-wrapper w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl relative">
             <img 
               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" 
               className="object-cover w-full h-full absolute inset-0" 
               alt="Design minimaliste" 
               loading="lazy"
             />
          </div>
        </div>

        {/* BLOCK 2: Image large + Text décalé */}
        <div className="col-span-1 md:col-span-6 md:col-start-1 mt-12 md:mt-0">
          <div className="about-image-wrapper w-full aspect-[16/9] md:aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl relative">
             <img 
               src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop" 
               className="object-cover w-full h-full absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700" 
               alt="Architecture" 
               loading="lazy"
             />
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 md:col-start-8 flex flex-col justify-center pt-8 md:pt-32">
          <h3 className="split-text-lines text-4xl md:text-5xl font-serif italic mb-8">Ce que je fais.</h3>
          <p className="split-text-lines text-lg md:text-xl opacity-80 leading-relaxed font-light">
            Je suis développeur indépendant à temps plein. Bien que je me spécialise dans la création d'identités de marque et de sites Web, j'aime la variété et j'aime relever des défis créatifs uniques. Si vous voulez faire une différence ou réimaginer le monde dans lequel nous vivons, j'aimerais en faire partie.
          </p>
        </div>

        {/* BLOCK 3: Petit bloc texte + Petite Image */}
        <div className="col-span-1 md:col-span-4 md:col-start-3 flex flex-col justify-center">
          <h3 className="split-text-lines text-4xl md:text-5xl font-serif italic mb-8">D'où je viens.</h3>
          <p className="split-text-lines text-lg md:text-xl opacity-80 leading-relaxed font-light">
            J'ai grandi dans un village de l'Essonne (91), dans un environnement calme et naturel. J'ai toujours été attiré par les nouvelles technologies et j'ai décidé de suivre cette voie. J'ai appris à programmer en autodidacte et avec la formation OpenClassrooms et j'ai travaillé sur des projets personnels pour améliorer mes compétences.
          </p>
        </div>
        <div className="col-span-1 md:col-span-3 md:col-start-9">
          <div className="about-image-wrapper w-full aspect-square md:aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl relative">
             <img 
               src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000&auto=format&fit=crop" 
               className="object-cover w-full h-full absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700" 
               alt="Espace de travail" 
               loading="lazy"
             />
          </div>
        </div>

        {/* BLOCK 4: Le Design */}
        <div className="col-span-1 md:col-span-6 md:col-start-5 text-center mt-12 md:mt-24">
          <h3 className="split-text-lines text-4xl md:text-5xl font-serif italic mb-8">Pourquoi le design ?</h3>
          <p className="split-text-lines text-lg md:text-xl opacity-80 leading-relaxed font-light">
            Je crois que le design a un impact réel et tangible sur le monde et joue un rôle énorme (quoique parfois subtil) dans la façon dont les gens comprennent les problèmes, les personnes et les produits. J'aime le design parce que je pense qu'il rend le monde plus beau et plus connecté.
          </p>
        </div>

      </div>

      {/* BLOCK 5 - CONTACT PROMPT */}
      <div className="mt-48 md:mt-72 w-full flex flex-col items-center">
        <h3 className="split-text-lines text-4xl md:text-6xl font-serif italic mb-10 text-center">Quand pouvons-nous discuter ?</h3>
        <p className="split-text-lines text-lg md:text-2xl opacity-80 max-w-3xl mx-auto mb-20 font-light text-center">
          Tout de suite, je réponds généralement dans la journée, alors n'hésitez pas à me contacter en cliquant sur le bouton ci-dessous.
        </p>
        
        <h2 className="split-text-lines text-[clamp(2.5rem,8vw,8rem)] font-bebas uppercase leading-[0.9] tracking-tight mb-16 text-center">
          Créons quelque chose ensemble
        </h2>
        
        <a 
          href="#footer" 
          className="inline-flex items-center gap-4 px-10 py-5 bg-foreground text-background font-sans font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 hover:bg-accent hover:text-white transition-all duration-300 shadow-xl"
        >
          Je suis prêt
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </section>
  );
}
