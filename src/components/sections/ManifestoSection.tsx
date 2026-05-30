"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import SplitType from "split-type";
import ScrollVelocityMarquee from "../ScrollVelocityMarquee";

// Import dynamique Spline supprimé (Remplacé par une vidéo)

// Importations d'images
import img1 from "../../../public/anim-about/img1.jpeg";
import img10 from "../../../public/anim-about/img10.jpg";
import img11 from "../../../public/anim-about/img11.jpg";
import img12 from "../../../public/anim-about/img12.jpg";
import img13 from "../../../public/anim-about/img13.jpg";
import img14 from "../../../public/anim-about/img14.jpg";
import img15 from "../../../public/anim-about/img15.jpg";
import img16 from "../../../public/anim-about/img16.jpg";
import img17 from "../../../public/anim-about/img17.jpg";
import img18 from "../../../public/anim-about/img18.jpg";
import img19 from "../../../public/anim-about/img19.jpg";
import img2 from "../../../public/anim-about/img2.jpeg";
import img20 from "../../../public/anim-about/img20.jpg";
import img3 from "../../../public/anim-about/img3.jpg";
import img4 from "../../../public/anim-about/img4.jpg";
import img5 from "../../../public/anim-about/img5.jpg";
import img6 from "../../../public/anim-about/img6.jpg";
import img7 from "../../../public/anim-about/img7.jpg";
import img8 from "../../../public/anim-about/img8.jpg";
import img9 from "../../../public/anim-about/img9.jpg";

const photos = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
];

const colItems = [
  {
    subtitle: "Les Fondations",
    title: "Développement Sur-Mesure",
    desc: "Des fondations techniques solides, un code rigoureusement optimisé et des performances d'affichage de pointe. Je crée des architectures scalables qui garantissent une fluidité absolue sur tous les appareils.",
    img: photos[8],
  },
  {
    subtitle: "L'Esthétisme",
    title: "Direction Artistique",
    desc: "Une attention maniaque aux détails, des grilles fluides, des typographies statutaires et des interfaces mémorables. Le design n'est pas que visuel, c'est l'âme de l'expérience utilisateur.",
    img: photos[4],
  },
  {
    subtitle: "Le Mouvement",
    title: "Interactions Immersives",
    desc: "Donner vie aux plateformes via des micro-animations tactiles, des transitions fluides et un rendu physique palpable. Le mouvement guide l'œil, raconte une histoire et récompense l'interaction.",
    img: photos[5],
  },
  {
    subtitle: "Le Résultat",
    title: "Singularité & Impact",
    desc: "Créer des identités numériques distinctives qui captivent l'attention, suscitent l'émotion et convertissent les visiteurs. Un portfolio ne doit pas juste être beau, il doit marquer les esprits.",
    img: photos[12],
  },
];

export default function ManifestoSection() {
  const container = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // 1. TITRE: La vision derrière le code (Entrée depuis les côtés X)
      gsap.fromTo(
        ".manifesto-title-part1",
        { x: "100vw", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".manifesto-title-container",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.fromTo(
        ".manifesto-title-part2",
        { x: "-100vw", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".manifesto-title-container",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Fade out au scroll (Scrub)
      gsap.to(".manifesto-title", {
        opacity: 0,
        scale: 3,
        yPercent: 30,
        ease: "power2.in",
        scrollTrigger: {
          trigger: ".manifesto-title-container",
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
        },
      });

      // 2. SCRUB TEXT BIO (Révélation mot par mot)
      const scrubText = new SplitType(".scrub-text", { types: "words" } as any);
      if (scrubText.words) {
        gsap.set(scrubText.words, { willChange: "opacity" });
      }
      gsap.fromTo(
        scrubText.words,
        { opacity: 0.05 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".scrub-text",
            start: "top 85%",
            end: "bottom 65%",
            scrub: true,
          },
        },
      );

      // 3. PARALLAX & SCALE DES IMAGES BIO FLOTTANTES (Inspiré du Preloader)
      gsap.set(".bio-img", { willChange: "transform, opacity" });
      gsap.utils.toArray(".bio-img").forEach((img: any, idx: number) => {
        // Apparition avec un scale au milieu de l'image
        gsap.from(img, {
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bio-images-wrapper",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // Parallax continu
        gsap.to(img, {
          yPercent: idx === 0 ? -20 : -45,
          ease: "none",
          force3D: true, // Accélération matérielle
          scrollTrigger: {
            trigger: ".bio-images-wrapper",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // 4. PREPARATION DES TEXTES MASQUÉS (SplitType)
      const splitSubtitles = new SplitType(".anim-subtitle", {
        types: "chars",
      } as any);
      const splitTitles = new SplitType(".anim-title", {
        types: "lines",
      } as any);
      const splitDescs = new SplitType(".anim-desc", { types: "lines" } as any);

      const wrapElements = (elems: HTMLElement[], isInline = false) => {
        elems.forEach((el) => {
          const wrapper = document.createElement("div");
          wrapper.className = "split-wrapper";
          wrapper.style.overflow = "hidden";
          wrapper.style.display = isInline ? "inline-block" : "block";
          wrapper.style.paddingBottom = "0.2em";
          wrapper.style.marginBottom = "-0.2em";
          el.parentNode?.insertBefore(wrapper, el);
          wrapper.appendChild(el);
        });
      };

      if (splitSubtitles.chars) wrapElements(splitSubtitles.chars, true);
      if (splitTitles.lines) wrapElements(splitTitles.lines, false);
      if (splitDescs.lines) wrapElements(splitDescs.lines, false);

      const slideTexts = [0, 1, 2, 3].map((idx) => ({
        chars:
          splitSubtitles.chars?.filter((c) =>
            c.closest(`.slide-${idx}-content`),
          ) || [],
        tLines:
          splitTitles.lines?.filter((l) =>
            l.closest(`.slide-${idx}-content`),
          ) || [],
        dLines:
          splitDescs.lines?.filter((l) => l.closest(`.slide-${idx}-content`)) ||
          [],
      }));

      // Cacher tous les textes initialement
      gsap.set([splitSubtitles.chars, splitTitles.lines, splitDescs.lines], {
        yPercent: 120,
        willChange: "transform",
      });

      // Slide 0 anime indépendamment à l'entrée
      gsap.to(
        [slideTexts[0].chars, slideTexts[0].tLines, slideTexts[0].dLines],
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "power4.out",
          scrollTrigger: {
            trigger: pinWrapperRef.current,
            start: "top 60%",
          },
        },
      );

      // 5. MASTER TIMELINE HANKTHETANK (Pure Clip-Path Wipes + Split Scroll)
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapperRef.current,
            start: "top top",
            end: "+=400%", // 4 Slides
            pin: true,
            scrub: 1,
          },
        });

        // SCÈNE 0
        tl.to(
          ".s0-img-wrapper",
          {
            clipPath: "inset(0% 0% 0% 50%)",
            ease: "power2.inOut",
            duration: 1,
          },
          "split0",
        )
          .to(
            ".s0-text-content",
            { x: "-25vw", ease: "power2.inOut", duration: 1 },
            "split0",
          )
          .to(".s0-overlay", { opacity: 0, duration: 0.8 }, "split0");

        // SCÈNE 1
        tl.fromTo(
          ".s1-part-1",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
          "wipe1",
        )
          .fromTo(
            ".s1-part-2",
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
            "wipe1",
          )
          .fromTo(
            ".s1-img",
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "none" },
            "wipe1",
          )
          .to(
            slideTexts[1].chars,
            { yPercent: 0, stagger: 0.02, duration: 0.4, ease: "power2.out" },
            "wipe1+=0.4",
          )
          .to(
            slideTexts[1].tLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe1+=0.4",
          )
          .to(
            slideTexts[1].dLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe1+=0.5",
          );

        // SCÈNE 2
        tl.fromTo(
          ".s2-part-1",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
          "wipe2",
        )
          .fromTo(
            ".s2-part-2",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
            "wipe2",
          )
          .fromTo(
            ".s2-img",
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "none" },
            "wipe2",
          )
          .to(
            slideTexts[2].chars,
            { yPercent: 0, stagger: 0.02, duration: 0.4, ease: "power2.out" },
            "wipe2+=0.4",
          )
          .to(
            slideTexts[2].tLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe2+=0.4",
          )
          .to(
            slideTexts[2].dLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe2+=0.5",
          );

        // SCÈNE 3
        tl.fromTo(
          ".s3-wrapper",
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
          "wipe3",
        )
          .fromTo(
            ".s3-img",
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "none" },
            "wipe3",
          )
          .to(
            slideTexts[3].chars,
            { yPercent: 0, stagger: 0.02, duration: 0.4, ease: "power2.out" },
            "wipe3+=0.4",
          )
          .to(
            slideTexts[3].tLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe3+=0.4",
          )
          .to(
            slideTexts[3].dLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe3+=0.5",
          );
      });

      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapperRef.current,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: 1,
          },
        });

        tl.to(
          ".s0-img-wrapper",
          {
            clipPath: "inset(0% 0% 50% 0%)",
            ease: "power2.inOut",
            duration: 1,
          },
          "split0",
        )
          .to(
            ".s0-text-content",
            { y: "25vh", ease: "power2.inOut", duration: 1 },
            "split0",
          )
          .to(".s0-overlay", { opacity: 0, duration: 0.8 }, "split0");

        tl.fromTo(
          ".s1-part-1",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
          "wipe1",
        )
          .fromTo(
            ".s1-part-2",
            { clipPath: "inset(0% 0% 0% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
            "wipe1",
          )
          .fromTo(
            ".s1-img",
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "none" },
            "wipe1",
          )
          .to(
            slideTexts[1].chars,
            { yPercent: 0, stagger: 0.02, duration: 0.4, ease: "power2.out" },
            "wipe1+=0.4",
          )
          .to(
            slideTexts[1].tLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe1+=0.4",
          )
          .to(
            slideTexts[1].dLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe1+=0.5",
          );

        tl.fromTo(
          ".s2-part-1",
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
          "wipe2",
        )
          .fromTo(
            ".s2-part-2",
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
            "wipe2",
          )
          .fromTo(
            ".s2-img",
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "none" },
            "wipe2",
          )
          .to(
            slideTexts[2].chars,
            { yPercent: 0, stagger: 0.02, duration: 0.4, ease: "power2.out" },
            "wipe2+=0.4",
          )
          .to(
            slideTexts[2].tLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe2+=0.4",
          )
          .to(
            slideTexts[2].dLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe2+=0.5",
          );

        tl.fromTo(
          ".s3-wrapper",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" },
          "wipe3",
        )
          .fromTo(
            ".s3-img",
            { scale: 1.2 },
            { scale: 1, duration: 1, ease: "none" },
            "wipe3",
          )
          .to(
            slideTexts[3].chars,
            { yPercent: 0, stagger: 0.02, duration: 0.4, ease: "power2.out" },
            "wipe3+=0.4",
          )
          .to(
            slideTexts[3].tLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe3+=0.4",
          )
          .to(
            slideTexts[3].dLines,
            { yPercent: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
            "wipe3+=0.5",
          );
      });

      // 6. ANIMATION DE LA CITATION OUTRO
      const outroQuote = document.querySelector(".outro-quote");
      let outroSplit: SplitType | null = null;
      if (outroQuote) {
        outroSplit = new SplitType(
          outroQuote as HTMLElement,
          { types: "lines, words" } as any,
        );
        if (outroSplit.words) {
          gsap.set(outroSplit.words, { transformPerspective: 1000, willChange: "transform, opacity" });
        }

        gsap.fromTo(
          outroSplit.words,
          { opacity: 0, y: 40, rotateX: -60 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.03,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: ".outro-section",
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        ".outro-author",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".outro-section",
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      );

      return () => {
        scrubText.revert();
        if (splitSubtitles) splitSubtitles.revert();
        if (splitTitles) splitTitles.revert();
        if (splitDescs) splitDescs.revert();
        if (outroSplit) outroSplit.revert();
        mm.revert();

        // Nettoyer les wrappers manuels pour éviter les duplications lors des rechargements à chaud
        document.querySelectorAll(".split-wrapper").forEach((wrapper) => {
          const parent = wrapper.parentNode;
          if (parent) {
            while (wrapper.firstChild) {
              parent.insertBefore(wrapper.firstChild, wrapper);
            }
            parent.removeChild(wrapper);
          }
        });
      };
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative w-full bg-background z-40 overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO TITRE (Simplifié : "La vision derrière le code")                    */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="manifesto-title-container w-full h-screen flex flex-col justify-center items-center bg-background overflow-hidden relative">
        <h2 className="manifesto-title text-[clamp(2.5rem,6vw,8rem)] font-serif font-medium uppercase tracking-tighter text-foreground whitespace-nowrap z-10 text-center leading-[1.1] overflow-hidden flex flex-col items-center">
          <span className="manifesto-title-part1 block">La vision</span>
          <span className="manifesto-title-part2 block">derrière le code</span>
        </h2>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* 2. BIO & GLOBE                                                              */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="scrub-container relative w-full min-h-[90vh] py-24 md:py-32 flex items-center bg-background px-6 md:px-16 lg:px-24">
        <div className="w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          <div className="w-full lg:w-3/5">
            <h2 className="text-foreground/70 font-sans text-xs tracking-[0.3em] uppercase mb-8 md:mb-12">
              01 // L'Origine
            </h2>
            <p className="scrub-text text-[clamp(1.5rem,3.5vw,3.5rem)] font-serif leading-[1.15] text-foreground font-medium text-balance">
              J'ai grandi dans un environnement calme propice à la curiosité.
              Intrigué très tôt par la technologie, j'ai appris à coder en
              autodidacte avant de consolider mon expertise. Aujourd'hui, je
              crée des expériences web uniques qui allient performance absolue
              et esthétisme pointu.
            </p>
          </div>

          <div className="bio-images-wrapper w-full lg:w-2/5 flex justify-center items-center relative h-[400px] md:h-[600px] mt-12 lg:mt-0">
            <div className="bio-img absolute top-[8%] right-[8%] w-36 h-48 md:w-64 md:h-80 overflow-hidden shadow-2xl z-10">
              <Image
                src={photos[0]}
                fill
                sizes="(max-width: 768px) 144px, 256px"
                alt="Bio 1"
                className="object-cover"
              />
            </div>

            <div className="bio-img absolute bottom-[8%] left-[8%] w-40 h-52 md:w-72 md:h-[22rem] overflow-hidden shadow-2xl z-20">
              <Image
                src={photos[1]}
                fill
                sizes="(max-width: 768px) 160px, 288px"
                alt="Bio 2"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* 3. MASTER TIMELINE HANKTHETANK (Pure Clip-Path Wipes)                       */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div
        ref={pinWrapperRef}
        className="hank-pin-wrapper h-screen w-full relative overflow-hidden bg-background text-foreground z-20 select-none"
      >
        {/* SLIDE 0 : Développement (Split Hank The Tank) */}
        <div className="absolute inset-0 w-full h-full z-10 bg-[#0a0a0a]">
          {/* Image Wrapper starts full screen, then gets clipped */}
          <div
            className="s0-img-wrapper absolute inset-0 w-full h-full overflow-hidden"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <Image
              src={colItems[0].img}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              className="s0-img object-cover"
              alt=""
            />
            <div className="s0-overlay absolute inset-0 bg-black/50" />
          </div>
          {/* Text Wrapper covers full screen, then content is animated to the side */}
          <div className="slide-0-content absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 md:p-16 z-20 pointer-events-none">
            <div className="s0-text-content max-w-xl text-center md:text-left flex flex-col items-center md:items-start text-white">
              <span className="anim-subtitle font-sans text-xs tracking-[0.3em] uppercase mb-4 opacity-70 block">
                01 // {colItems[0].subtitle}
              </span>
              <h3 className="anim-title text-4xl md:text-6xl font-serif tracking-tight mb-4">
                {colItems[0].title}
              </h3>
              <p className="anim-desc text-sm md:text-lg opacity-80">
                {colItems[0].desc}
              </p>
            </div>
          </div>
        </div>

        {/* SLIDE 1 : Direction Artistique (Opposite Wipe 1) */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none flex flex-col md:flex-row">
          <div className="slide-1-content s1-part-1 absolute top-0 left-0 w-full h-1/2 md:w-1/2 md:h-full flex items-center justify-center p-8 md:p-16 bg-[#0a0a0a] text-white">
            <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
              <span className="anim-subtitle font-sans text-xs tracking-[0.3em] uppercase mb-4 opacity-50 block">
                02 // {colItems[1].subtitle}
              </span>
              <h3 className="anim-title text-3xl md:text-5xl font-serif tracking-tight mb-4">
                {colItems[1].title}
              </h3>
              <p className="anim-desc text-sm md:text-base opacity-80">
                {colItems[1].desc}
              </p>
            </div>
          </div>
          <div className="s1-part-2 absolute bottom-0 right-0 md:top-0 md:right-0 w-full h-1/2 md:w-1/2 md:h-full overflow-hidden bg-black">
            <Image
              src={colItems[1].img}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="s1-img object-cover opacity-90"
              alt=""
            />
          </div>
        </div>

        {/* SLIDE 2 : Interactions Immersives (Opposite Wipe 2) */}
        <div className="absolute inset-0 w-full h-full z-30 pointer-events-none flex flex-col md:flex-row">
          <div className="slide-2-content s2-part-1 absolute top-0 left-0 w-full h-1/2 md:w-1/2 md:h-full flex items-center justify-center p-8 md:p-16 bg-background text-foreground">
            <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
              <span className="anim-subtitle font-sans text-xs tracking-[0.3em] uppercase mb-4 opacity-50 block">
                03 // {colItems[2].subtitle}
              </span>
              <h3 className="anim-title text-3xl md:text-5xl font-serif tracking-tight mb-4">
                {colItems[2].title}
              </h3>
              <p className="anim-desc text-sm md:text-base opacity-80">
                {colItems[2].desc}
              </p>
            </div>
          </div>
          <div className="s2-part-2 absolute bottom-0 right-0 md:top-0 md:right-0 w-full h-1/2 md:w-1/2 md:h-full overflow-hidden bg-black">
            <Image
              src={colItems[2].img}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="s2-img object-cover opacity-90"
              alt=""
            />
          </div>
        </div>

        {/* SLIDE 3 : Singularité & Impact (Horizontal Wipe) */}
        <div className="slide-3-content s3-wrapper absolute inset-0 w-full h-full z-40 pointer-events-none bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40">
            <Image
              src={colItems[3].img}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              className="s3-img object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </div>
          <div className="relative z-10 max-w-4xl text-center p-8">
            <span className="anim-subtitle font-sans text-xs tracking-[0.3em] uppercase mb-6 block opacity-70">
              04 // {colItems[3].subtitle}
            </span>
            <h3 className="anim-title text-[clamp(2.5rem,5vw,6rem)] font-serif tracking-tight mb-6">
              {colItems[3].title}
            </h3>
            <p className="anim-desc text-base md:text-xl opacity-90 leading-relaxed">
              {colItems[3].desc}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* 4. OUTRO CITATION AVEC SPLINE BACKGROUND                                    */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="outro-section relative w-full h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        {/* Vidéo de fond (Style Awwwards) - Fallback gradient en attendant le vrai fichier local */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
          <video
            src="/anim-about/outro-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Voile sombre uni au lieu d'un blur pour soulager le GPU */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Citation */}
        <blockquote className="relative z-20 max-w-6xl text-center px-6 md:px-12 flex flex-col items-center">
          <span className="text-white/40 font-sans text-xs tracking-[0.4em] uppercase mb-8">
            03 // L'Ambition
          </span>
          <h2 className="outro-quote text-[clamp(2rem,5vw,6rem)] font-serif tracking-tight leading-[1.05] font-medium text-balance">
            « Il y a trois réactions possibles à tout design : oui, non, et
            WAHOU ! La troisième est celle que je vise. »
          </h2>
          <footer className="outro-author mt-12 md:mt-16 font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-white/70">
            — Milton Glaser
          </footer>
        </blockquote>
      </section>

      {/* Transition Marquee */}
      <div className="py-12 md:py-24 bg-background">
        <ScrollVelocityMarquee />
      </div>
    </section>
  );
}
