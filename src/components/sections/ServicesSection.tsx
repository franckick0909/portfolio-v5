"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

import s1Bg from "../../../public/services/service1_bg.png";
import s1Card from "../../../public/services/service1_card.png";
import s2Bg from "../../../public/services/service2_bg.png";
import s2Card from "../../../public/services/service2_card.png";
import s3Bg from "../../../public/services/service3_bg.png";
import s3Card from "../../../public/services/service3_card.png";
import s4Bg from "../../../public/services/service4_bg.png";
import s4Card from "../../../public/services/service4_card.png";

const servicesData = [
  { 
    title: "Création de site internet",  
    desc: "Nous concevons des sites internet vitrines et e-commerce sur-mesure, pensés pour maximiser votre impact et garantir une expérience utilisateur exceptionnelle.", 
    bg: s1Bg.src,
    cardImg: s1Card.src 
  },
  { 
    title: "Webdesign UX/UI",             
    desc: "Un équilibre parfait entre esthétique et utilité. Nous créons des interfaces intuitives et immersives qui reflètent l'ADN de votre marque.",          
    bg: s2Bg.src,
    cardImg: s2Card.src 
  },
  { 
    title: "Référencement SEO",           
    desc: "Optimisation technique et sémantique pointue pour positionner votre plateforme en tête des résultats de recherche pertinents.",                       
    bg: s3Bg.src,
    cardImg: s3Card.src 
  },
  { 
    title: "Design Visuel & Branding",    
    desc: "Création de logos, d'identités visuelles et de supports graphiques professionnels pour faire briller votre entreprise sur tous les canaux.",         
    bg: s4Bg.src,
    cardImg: s4Card.src 
  },
];

const N = servicesData.length;
const BG_SLICES = 48;
const sliceOverlap = 0.0; // Overlap de 0.3% pour masquer les jointures/fissures de sous-pixels

// Bandes vénitiennes égales et très fines
const sliceData = (() => {
  const h = 100 / BG_SLICES;
  return Array.from({ length: BG_SLICES }, (_, i) => {
    const t = i * h;
    return { top: t, height: h, bottom: 100 - (t + h) };
  });
})();

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ─── Découpage des textes avec SplitType et enveloppement avec overflow-hidden ───
    const splitInstances: SplitType[] = [];

    servicesData.forEach((_, idx) => {
      const titleEl = sectionRef.current?.querySelector(`.service-title-${idx}`);
      const descEl = sectionRef.current?.querySelector(`.service-desc-${idx}`);

      if (titleEl) {
        // Clear any existing wrappers from previous hot reloads
        titleEl.querySelectorAll(".line-wrapper").forEach(wrap => {
          const parent = wrap.parentNode;
          while (wrap.firstChild) {
            parent?.insertBefore(wrap.firstChild, wrap);
          }
          wrap.remove();
        });

        const splitTitle = new SplitType(titleEl as HTMLElement, { types: "lines", lineClass: "split-line" });
        splitTitle.lines?.forEach(line => {
          const wrap = document.createElement("div");
          wrap.className = "line-wrapper overflow-hidden block";
          line.parentNode?.insertBefore(wrap, line);
          wrap.appendChild(line);
        });
        splitInstances.push(splitTitle);
      }

      if (descEl) {
        // Clear any existing wrappers from previous hot reloads
        descEl.querySelectorAll(".line-wrapper").forEach(wrap => {
          const parent = wrap.parentNode;
          while (wrap.firstChild) {
            parent?.insertBefore(wrap.firstChild, wrap);
          }
          wrap.remove();
        });

        const splitDesc = new SplitType(descEl as HTMLElement, { types: "lines", lineClass: "split-line" });
        splitDesc.lines?.forEach(line => {
          const wrap = document.createElement("div");
          wrap.className = "line-wrapper overflow-hidden block";
          line.parentNode?.insertBefore(wrap, line);
          wrap.appendChild(line);
        });
        splitInstances.push(splitDesc);
      }
    });

    // Configuration initiale : cacher les textes des slides non actifs
    for (let idx = 1; idx < N; idx++) {
      gsap.set(
        [`.service-title-${idx} .split-line`, `.service-desc-${idx} .split-line`],
        { yPercent: 100 }
      );
    }

    // ─── Effet Cursor Magnétique/Flottant Premium pour le Bouton "Discover More" ───
    const imageContainer = sectionRef.current?.querySelector(".image-container-wrapper");
    const button = sectionRef.current?.querySelector(".magnetic-button");

    let onMouseMove: (e: MouseEvent) => void;
    let onMouseEnter: () => void;
    let onMouseLeave: () => void;

    if (imageContainer && button) {
      // Masquer initialement le bouton flottant (scale: 0)
      gsap.set(button, { scale: 0, opacity: 0, xPercent: -50, yPercent: -50 });

      const xTo = gsap.quickTo(button, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(button, "y", { duration: 0.45, ease: "power3.out" });

      onMouseEnter = () => {
        gsap.to(button, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.5)" });
      };

      onMouseMove = (e: MouseEvent) => {
        const rect = imageContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        xTo(mouseX);
        yTo(mouseY);
      };

      onMouseLeave = () => {
        gsap.to(button, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
      };

      imageContainer.addEventListener("mouseenter", onMouseEnter as EventListener);
      imageContainer.addEventListener("mousemove", onMouseMove as EventListener);
      imageContainer.addEventListener("mouseleave", onMouseLeave as EventListener);
    }

    // ─── Animations adaptatives selon l'écran avec gsap.matchMedia ───
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };

      // ─── Une transition scrubée par slide (immédiate et réactive) ───
      for (let i = 1; i < N; i++) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: `.service-trigger-${i}`,
            start: "top top",      // Démarre immédiatement dès que le trigger commence à défiler
            end:   "bottom top",   // Finit quand le trigger a défilé de 100vh
            scrub: 0.15,           // Scrub ultra réactif (0.15s) pour éliminer tout temps d'attente
          },
        });

        if (isDesktop) {
          // A ── Activer la couche découpée (slices) au début de la transition
          tl.fromTo(`.bg-layer-${i}`, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0);

          // B ── Effet de Scale sur les images de fond au scroll (s'effacent = scale down, arrivent = scale up à 100%)
          // L'image sortante solide (i - 1) se réduit doucement de 1.0 à 0.95
          tl.fromTo(
            `.bg-solid-${i - 1} img`,
            { scale: 1.0 },
            { scale: 0.95, duration: 0.8, ease: "power2.inOut" },
            0.0
          );

          // Les images entrantes coupées (i) s'agrandissent doucement de 0.95 à 1.0
          tl.fromTo(
            `.bg-layer-${i} .bg-slice img`,
            { scale: 0.95 },
            { scale: 1.0, duration: 0.8, ease: "power2.inOut" },
            0.0
          );

          // 1 ── Ouverture des lames de fond du store vénitien (48 bandes fines)
          for (let j = 0; j < BG_SLICES; j++) {
            const pos = (j / BG_SLICES) * 0.45; // Cascade fluide légèrement compressée dans la timeline
            tl.fromTo(
              `.bg-layer-${i} .bg-slice:nth-child(${j + 1})`,
              { clipPath: `inset(${sliceData[j].top}% 0 ${100 - sliceData[j].top}% 0)` },
              { clipPath: `inset(${sliceData[j].top}% 0 ${sliceData[j].bottom - sliceOverlap}% 0)`, ease: "none" },
              pos
            );
          }

          // C ── À la fin de la transition : afficher le fond solide correspondant (sans traits ni lames)
          // et masquer le calque découpé pour éliminer tout bug de sous-pixels au repos
          tl.set(`.bg-solid-${i}`, { opacity: 1 }, 0.8);
          tl.set(`.bg-layer-${i}`, { opacity: 0 }, 0.8);
        }

        // 2 ── Dévoilement par clip-path + glissement/parallaxe synchronisé des images de la carte
        // Image sortante (i - 1) glisse doucement vers le haut
        tl.fromTo(
          `.card-image-layer-${i - 1} img`,
          { yPercent: 0 },
          { yPercent: -15, duration: 0.8, ease: "power2.inOut" },
          0.0
        );

        // Image entrante (i) se dévoile par clip-path tout en glissant vers le haut
        tl.fromTo(
          `.card-image-layer-${i}`,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power2.inOut" },
          0.0
        );

        tl.fromTo(
          `.card-image-layer-${i} img`,
          { yPercent: 15 },
          { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
          0.0
        );

        // 3 ── Disparition synchronisée vers le haut des textes du slide précédent (i - 1)
        tl.to(
          [`.card-header-${i - 1}`, `.card-desc-${i - 1}`],
          { opacity: 0, duration: 0.25, pointerEvents: "none" },
          0.0
        );
        
        tl.fromTo(
          [`.service-title-${i - 1} .split-line`, `.service-desc-${i - 1} .split-line`],
          { yPercent: 0 },
          { yPercent: -100, duration: 0.65, stagger: 0.05, ease: "power2.inOut" },
          0.0
        );

        // 4 ── Apparition synchronisée depuis le bas des textes du slide actuel (i)
        tl.to(
          [`.card-header-${i}`, `.card-desc-${i}`],
          { opacity: 1, duration: 0.3, pointerEvents: "auto" },
          0.15
        );

        tl.fromTo(
          [`.service-title-${i} .split-line`, `.service-desc-${i} .split-line`],
          { yPercent: 100 },
          { yPercent: 0, duration: 0.75, stagger: 0.08, ease: "power2.out" },
          0.15
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      splitInstances.forEach(inst => inst.revert());
      mm.revert();
      if (imageContainer) {
        if (onMouseEnter) imageContainer.removeEventListener("mouseenter", onMouseEnter as EventListener);
        if (onMouseMove) imageContainer.removeEventListener("mousemove", onMouseMove as EventListener);
        if (onMouseLeave) imageContainer.removeEventListener("mouseleave", onMouseLeave as EventListener);
      }
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="services" className="relative w-full bg-background text-foreground z-40">

      {/* Hauteur totale = N * 100 vh */}
      <div className="relative w-full" style={{ height: `${N * 100}vh` }}>

        {/* STICKY — Ecran fixé */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#151515] md:bg-transparent">

          {/* Fonds (Solid layers + Sliced transition layers) - Masqués sur mobile et tablette */}
          <div className="hidden md:block absolute inset-0" style={{ zIndex: 1 }}>
            {/* 1. Solid Background Layers (Seamless) */}
            {servicesData.map((s, idx) => (
              <div
                key={`solid-${idx}`}
                className={`bg-solid bg-solid-${idx} absolute inset-0 overflow-hidden`}
                style={{
                  zIndex: idx * 2 + 1, // Start zIndex at 1 instead of 0 to avoid being hidden behind parent background
                  opacity: idx === 0 ? 1 : 0,
                }}
              >
                <Image
                  src={s.bg}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover origin-center"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            ))}

            {/* 2. Sliced Transition Layers (Venetian Blinds) */}
            {servicesData.map((s, idx) => {
              if (idx === 0) return null; // Slide 0 doesn't need an incoming transition sliced layer
              return (
                <div
                  key={`sliced-${idx}`}
                  className={`bg-layer bg-layer-${idx} absolute inset-0 overflow-hidden opacity-0`}
                  style={{
                    zIndex: idx * 2, // Sits exactly between solid-(idx-1) and solid-idx
                  }}
                >
                  {sliceData.map((slice, i) => (
                    <div
                      key={i}
                      className="bg-slice absolute inset-0 overflow-hidden"
                      style={{
                        clipPath: `inset(${slice.top}% 0 ${100 - slice.top}% 0)`,
                      }}
                    >
                      <Image
                        src={s.bg}
                        alt=""
                        fill
                        className="object-cover origin-center"
                      />
                      <div className="absolute inset-0 bg-black/60" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Textes latéraux */}
          <div className="hidden md:flex absolute inset-0 px-12 lg:px-16 justify-between items-center z-10 text-white pointer-events-none mix-blend-difference">
            <h2 className="font-bebas text-5xl tracking-widest uppercase">Nos Services</h2>
            <span className="font-sans text-sm tracking-widest opacity-80">( Keep Scrolling )</span>
          </div>

          {/* Carte centrale */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4">
            <div
              className="relative w-full md:w-[55%] max-w-[620px] bg-[#d1ccbf] text-[#1E2320] shadow-2xl  pointer-events-auto overflow-hidden flex flex-col justify-between p-8 md:p-12"
              style={{ height: '88vh' }}
            >
              {/* 1. Conteneur des en-têtes fixes */}
              <div className="relative w-full h-[100px] md:h-[130px] flex-shrink-0">
                {servicesData.map((s, idx) => (
                  <div
                    key={idx}
                    className={`card-header card-header-${idx} absolute inset-x-0 top-0 flex flex-col items-center text-center gap-2 md:gap-4`}
                    style={{
                      zIndex: idx + 1,
                      opacity: idx === 0 ? 1 : 0,
                      pointerEvents: idx === 0 ? "auto" : "none",
                    }}
                  >
                    <span className="font-sans text-sm md:text-base uppercase tracking-widest opacity-50 font-normal">
                      0{idx + 1} — 0{N}
                    </span>
                    <h3 className={`service-title service-title-${idx} font-sans text-3xl md:text-4xl lg:text-[40px] leading-[1.1] tracking-tight font-light text-center`}>
                      {s.title}
                    </h3>
                  </div>
                ))}
              </div>

              {/* 2. Conteneur d'image avec effet clip-path et curseur magnétique/flottant */}
              <div
                className="image-container-wrapper relative w-full aspect-video overflow-hidden my-4 md:my-6 select-none cursor-none"
                style={{ aspectRatio: "16/11", minHeight: 0 }}
              >
                
                {/* Bouton "Discover More" flottant / Curseur magnétique personnalisé */}
                <div
                  className="magnetic-button absolute top-0 left-0 z-30 pointer-events-none flex items-center justify-center"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  <span className="px-6 py-3 rounded-full bg-white/05 border border-white/20 text-[#1E2320] font-sans text-xs uppercase tracking-widest font-semibold shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] flex items-center gap-2 backdrop-blur-md whitespace-nowrap">
                    Discover More <span className="inline-block text-sm">
                      <svg
                          className="w-[2em] h-[2em]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="10 7 17 7 17 14" />
                        </svg>
                    </span>
                  </span>
                </div>

                {/* Images de chaque service */}
                {servicesData.map((s, idx) => (
                  <div
                    key={idx}
                    className={`card-image-layer card-image-layer-${idx} absolute inset-0 overflow-hidden`}
                    style={{
                      zIndex: idx,
                      clipPath: idx === 0 ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
                    }}
                  >
                    <Image
                      src={s.cardImg}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover scale-105"
                    />
                  </div>
                ))}
              </div>

              {/* 3. Conteneur des descriptions fixes */}
              <div className="relative w-full h-[70px] md:h-[90px] flex-shrink-0 flex items-center justify-center">
                {servicesData.map((s, idx) => (
                  <div
                    key={idx}
                    className={`card-desc card-desc-${idx} absolute inset-x-0 bottom-0 flex items-center justify-center text-center`}
                    style={{
                      zIndex: idx + 1,
                      opacity: idx === 0 ? 1 : 0,
                      pointerEvents: idx === 0 ? "auto" : "none",
                    }}
                  >
                    <p className={`service-desc service-desc-${idx} font-sans text-sm md:text-base leading-relaxed opacity-80 max-w-[85%] text-center font-light`}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* fin sticky */}

        {/* ZONES DE TRIGGER INVISIBLES */}
        <div className="absolute top-0 left-0 w-full pointer-events-none flex flex-col" style={{ height: `${N * 100}vh` }}>
          {Array.from({ length: N - 1 }).map((_, idx) => (
            <div
              key={idx}
              className={`service-trigger service-trigger-${idx + 1} w-full`}
              style={{ height: '100vh', flexShrink: 0 }}
            />
          ))}
          {/* Buffer 100 vh silencieux à la fin pour voir pleinement la dernière slide */}
          <div style={{ height: '100vh', flexShrink: 0 }} />
        </div>

      </div>
    </section>
  );
}
