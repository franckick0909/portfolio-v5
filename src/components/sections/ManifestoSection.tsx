"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import SplitType from "split-type";
import ScrollVelocityMarquee from "../ScrollVelocityMarquee";

const HeroGlobe = dynamic(() => import("../HeroGlobe"), { ssr: false });

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
import img3 from "../../../public/anim-about/img3.jpg";
import img4 from "../../../public/anim-about/img4.jpg";
import img5 from "../../../public/anim-about/img5.jpg";
import img6 from "../../../public/anim-about/img6.jpg";
import img7 from "../../../public/anim-about/img7.jpg";
import img8 from "../../../public/anim-about/img8.jpg";
import img9 from "../../../public/anim-about/img9.jpg";
import img20 from "../../../public/anim-about/img20.jpg";

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

const biographyTexts = [
  "J'ai grandi dans un village de l'Essonne, dans un environnement calme propice à la curiosité.",
  "Intrigué très tôt par la technologie, j'ai appris à coder en autodidacte avant de me former avec OpenClassrooms.",
  "Aujourd'hui, je crée des expériences web uniques qui allient performance technique et esthétisme pointu.",
];

const finalCoverText = "Prêt à réimaginer le monde numérique ?";

export default function ManifestoSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const images = gsap.utils.toArray(".img") as HTMLElement[];
      const coverImg = document.querySelector(
        ".spotlight-cover-img",
      ) as HTMLElement;
      const bioElements = gsap.utils.toArray(
        ".biography-text",
      ) as HTMLElement[];
      const finalElement = document.querySelector(
        ".spotlight-final-text h2",
      ) as HTMLElement;

      const bioSplits = bioElements.map(
        (el) => new SplitType(el, { types: "words" }),
      );
      const finalSplit = finalElement ? new SplitType(finalElement, { types: "words" }) : null;

      bioSplits.forEach((split) => { if (split.words) gsap.set(split.words, { opacity: 0 }); });
      if (finalSplit?.words) gsap.set(finalSplit.words, { opacity: 0 });
      if (finalElement) gsap.set(finalElement, { opacity: 1 });

      const scatterDirections = [
        { x: 1.3, y: 0.7 },
        { x: -1.5, y: 1.0 },
        { x: 1.1, y: -1.3 },
        { x: -1.7, y: -0.8 },
        { x: 0.8, y: 1.5 },
        { x: -1.0, y: -1.4 },
        { x: 1.6, y: 0.3 },
        { x: -0.7, y: 1.7 },
        { x: 1.2, y: -1.6 },
        { x: -1.4, y: 0.9 },
        { x: 1.8, y: -0.5 },
        { x: -1.1, y: -1.8 },
        { x: 0.9, y: 1.8 },
        { x: -1.9, y: 0.4 },
        { x: 1.0, y: -1.9 },
        { x: -0.8, y: 1.9 },
        { x: 1.7, y: -1.0 },
        { x: -1.3, y: -1.2 },
        { x: 0.7, y: 1 },
        { x: -1.25, y: -0.2 },
      ];

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 1000;
      const scattterMultiplier = isMobile ? 2.5 : 0.5;

      const startPositions = images.map(() => ({
        x: 0,
        y: 0,
        z: -1000,
        scale: 0,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
      }));

      const endPositions = scatterDirections.map((dir) => ({
        x: dir.x * scattterMultiplier * screenWidth,
        y: dir.y * scattterMultiplier * screenHeight,
        z: 2000,
        scale: 1,
        rotationX: (Math.random() - 0.5) * 120, // max 60deg rotation
        rotationY: (Math.random() - 0.5) * 120,
        rotation: (Math.random() - 0.5) * 60,
      }));

      images.forEach((img, index) => {
        gsap.set(img, startPositions[index]);
      });

      if (coverImg) {
        gsap.set(coverImg, {
          transformPerspective: 2000,
          z: -1000,
          scale: 0,
          opacity: 0,
          x: 0,
          y: 0,
        });
      }

      ScrollTrigger.create({
        trigger: ".spotlight",
        start: "top top",
        end: `+=${window.innerHeight * 15}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Animer les images dispersées
          images.forEach((img, index) => {
            const staggerDelay = index * 0.03;
            const scaleMultiplier = isMobile ? 4 : 2;

            let imageProgress = Math.max(0, (progress - staggerDelay) * 4);

            const start = startPositions[index];
            const end = endPositions[index];

            const zValue = gsap.utils.interpolate(start.z, end.z, imageProgress);
            const scaleValue = gsap.utils.interpolate(start.scale, end.scale, imageProgress * scaleMultiplier);
            const xValue = gsap.utils.interpolate(start.x, end.x, imageProgress);
            const yValue = gsap.utils.interpolate(start.y, end.y, imageProgress);
            const rotXValue = gsap.utils.interpolate(start.rotationX, end.rotationX, imageProgress);
            const rotYValue = gsap.utils.interpolate(start.rotationY, end.rotationY, imageProgress);
            const rotZValue = gsap.utils.interpolate(start.rotation, end.rotation, imageProgress);

            gsap.set(img, {
              z: zValue,
              scale: scaleValue,
              x: xValue,
              y: yValue,
              rotationX: rotXValue,
              rotationY: rotYValue,
              rotation: rotZValue,
            });
          });

          // L'image de couverture qui arrive à la fin
          const coverProgress = Math.max(0, (progress - 0.7) * 4);
          const coverZValue = -1000 + 1000 * coverProgress;
          const coverScaleValue = Math.min(1, coverProgress * 2);
          const coverOpacity = gsap.utils.clamp(0, 1, coverProgress * 2);

          if (coverImg) {
            gsap.set(coverImg, {
              z: coverZValue,
              scale: coverScaleValue,
              opacity: coverOpacity,
              x: 0,
              y: 0,
            });
          }

          // Helper pour animer l'apparition et disparition des mots
          const animateWords = (
            split: SplitType,
            prog: number,
            appearStart: number,
            appearEnd: number,
            disappearStart: number,
            disappearEnd: number,
          ) => {
            if (!split.words) return;

            if (prog < appearStart || prog > disappearEnd) {
              gsap.set(split.words, { opacity: 0 });
            } else if (prog >= appearEnd && prog <= disappearStart) {
              gsap.set(split.words, { opacity: 1 });
            } else if (prog >= appearStart && prog < appearEnd) {
              const phaseProgress =
                (prog - appearStart) / (appearEnd - appearStart);
              split.words.forEach((word, index) => {
                const wordFadeProgress = index / split.words!.length;
                const opacity = gsap.utils.clamp(
                  0,
                  1,
                  (phaseProgress - wordFadeProgress) / 0.1,
                );
                gsap.set(word, { opacity });
              });
            } else if (prog > disappearStart && prog <= disappearEnd) {
              const phaseProgress =
                (prog - disappearStart) / (disappearEnd - disappearStart);
              split.words.forEach((word, index) => {
                const wordFadeProgress = index / split.words!.length;
                const opacity = gsap.utils.clamp(
                  0,
                  1,
                  1 - (phaseProgress - wordFadeProgress) / 0.1,
                );
                gsap.set(word, { opacity });
              });
            }
          };

          // Animer les 3 textes de biographie de façon séquentielle
          if (bioSplits.length === 3) {
            animateWords(bioSplits[0], progress, 0.02, 0.08, 0.2, 0.26);
            animateWords(bioSplits[1], progress, 0.26, 0.32, 0.44, 0.5);
            animateWords(bioSplits[2], progress, 0.5, 0.56, 0.68, 0.74);
          }

          // Animer le texte final sur l'image de couverture (il reste affiché à la fin)
          if (finalSplit && finalSplit.words) {
            if (progress < 0.8) {
              gsap.set(finalSplit.words, { opacity: 0 });
            } else {
              const phaseProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.8) / 0.15,
              );
              finalSplit.words.forEach((word, index) => {
                const wordFadeProgress = index / finalSplit.words!.length;
                const opacity = gsap.utils.clamp(
                  0,
                  1,
                  (phaseProgress - wordFadeProgress) / 0.1,
                );
                gsap.set(word, { opacity });
              });
            }
          }
        },
      });

      // --- Animation texte ligne par ligne pour l'intro ---
      const introTexts = gsap.utils.toArray(".intro-text") as HTMLElement[];
      const introSplits: SplitType[] = [];

      introTexts.forEach((el) => {
        const split = new SplitType(el, {
          types: "lines",
          lineClass: "split-line",
        });
        introSplits.push(split);

        split.lines?.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.className = "line-wrapper";
          wrapper.style.overflow = "hidden";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

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
            delay: 0.2,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // --- Animation de la ligne séparatrice ---
      const separatorLines = gsap.utils.toArray(
        ".separator-line",
      ) as HTMLElement[];
      const separatorLabel = document.querySelector(
        ".animated-separator span",
      ) as HTMLElement;

      if (separatorLines.length) {
        gsap.fromTo(
          separatorLines,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: ".animated-separator",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (separatorLabel) {
        gsap.fromTo(
          separatorLabel,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: 0.4,
            scrollTrigger: {
              trigger: ".animated-separator",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // --- Parallax Globe ---
      gsap.to(".globe-container", {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: ".intro",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // --- Outro Animation ---
      const outroQuote = document.querySelector(".outro blockquote h2") as HTMLElement;
      const outroAuthor = document.querySelector(".outro blockquote footer") as HTMLElement;
      
      let outroSplit: SplitType | null = null;
      if (outroQuote) {
        outroSplit = new SplitType(outroQuote, { types: "lines", lineClass: "split-line-outro" });
        
        outroSplit.lines?.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.style.overflow = "hidden";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        gsap.fromTo(outroSplit.lines, 
          { yPercent: 120, opacity: 0, rotation: 2 },
          { 
            yPercent: 0, opacity: 1, rotation: 0, duration: 1.2, stagger: 0.1, ease: "expo.out",
            scrollTrigger: {
              trigger: ".outro",
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (outroAuthor) {
        gsap.fromTo(outroAuthor,
          { opacity: 0, x: -20 },
          { 
            opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power2.out",
            scrollTrigger: {
              trigger: ".outro",
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      return () => {
        bioSplits.forEach((split) => split.revert());
        if (finalSplit) finalSplit.revert();
        introSplits.forEach((split) => split.revert());
        if (outroSplit) outroSplit.revert();
      };
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative w-full overflow-hidden bg-background z-40"
    >
      {/* Intro Section */}
      <section className="intro relative w-full min-h-screen flex flex-col justify-between bg-background text-foreground z-40 px-6 py-24 md:px-16 md:py-32 gap-32 text-balance">
        {/* Ligne du haut : Texte à gauche, Globe à droite */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full relative z-10 gap-8 md:gap-0">
          <h2 className="intro-text text-[clamp(2rem,3vw,5rem)] font-serif tracking-tight leading-[1.1] font-medium text-left max-w-4xl mt-12 md:mt-0 relative z-20 mix-blend-difference">
            Je m'appelle Franck Chapelon, développeur web passionné.
            <br /> Je crée des expériences web uniques et engageantes.
          </h2>

          {/* Conteneur du gros globe - Responsive avec classe pour parallax */}
          <div className="globe-container relative md:absolute top-0 right-0 md:right-10 w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] md:w-[500px] md:h-[500px] md:-translate-y-12 md:translate-x-12 z-0 pointer-events-auto flex items-center justify-center">
            <HeroGlobe />
          </div>
        </div>

        <h2 className="intro-text text-[clamp(1.2rem,2vw,4rem)] font-serif tracking-tight leading-[1.1] font-medium max-w-4xl self-end mb-12 md:mb-0 text-balance md:text-justify">
          Je suis développeur indépendant à temps plein. Bien que je me
          spécialise dans la création d'identités de marque et de sites Web,
          j'aime la variété et j'aime relever des défis créatifs uniques. Si
          vous voulez faire une différence ou réimaginer le monde dans lequel
          nous vivons, j'aimerais en faire partie.
        </h2>
      </section>

      {/* Scroll Velocity Marquee — Transition */}
      <ScrollVelocityMarquee />

      {/* Animated Separator Line */}
      <div className="relative w-full flex flex-col items-center justify-center py-12 md:py-20 bg-background z-30">
        <div className="animated-separator relative w-full flex items-center gap-6 px-6 md:px-16">
          <div className="separator-line h-px bg-foreground/40 flex-1 origin-left scale-x-0" />
          <span className="text-foreground/90 text-[0.7rem] md:text-xs tracking-[0.3em] uppercase font-sans whitespace-nowrap">
            Ma biographie
          </span>
          <div className="separator-line h-px bg-foreground/40 flex-1 origin-right scale-x-0" />
        </div>
      </div>

      {/* Spotlight Section */}
      <section className="spotlight bg-background text-foreground w-full h-screen relative overflow-hidden z-20">
        <div
          className="spotlight-images absolute w-full h-full top-0 left-0"
          style={{ perspective: "2000px" }}
        >
          {/* Scatter Images (20 images cycling through 7 photos) */}
          {[...Array(20)].map((_, i) => {
            return (
              <div
                key={i}
                className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform shadow-2xl rounded-lg overflow-hidden w-[60vw] sm:w-[40vw] md:w-[30vw] max-w-[550px]"
              >
                <Image
                  src={photos[i % photos.length]}
                  alt={`About photo ${(i % photos.length) + 1}`}
                  className="w-full h-auto object-cover"
                  priority={i < 5}
                  sizes="(max-width: 768px) 60vw, (max-width: 1200px) 40vw, 25vw"
                />
              </div>
            );
          })}
        </div>

        {/* Cover Video */}
        <div className="spotlight-cover-img absolute w-full h-full top-0 left-0 will-change-transform z-50">
          <video
            src="/anim-about/vid1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating Biography Texts */}
        <div className="spotlight-biography-container absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none mix-blend-difference text-white z-40 px-6 md:px-16">
          {biographyTexts.map((text, index) => (
            <h3
              key={index}
              className="biography-text absolute text-[clamp(1.5rem,3vw,3.5rem)] font-serif tracking-normal md:tracking-tight leading-[1.1] font-medium text-center max-w-4xl"
            >
              {text}
            </h3>
          ))}
        </div>

        {/* Final Cover Text */}
        <div className="spotlight-final-text absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none z-50 px-6 md:px-16 mix-blend-difference text-white">
          <h2 className="text-[clamp(2.5rem,5vw,6rem)] font-serif tracking-tight leading-[0.9] font-medium text-center">
            {finalCoverText}
          </h2>
        </div>
      </section>

      {/* Outro Section */}
      <section className="outro relative w-screen min-h-screen flex flex-col justify-center items-center bg-background text-foreground z-30 px-6">
        <blockquote className="max-w-6xl text-center">
          <h2 className="text-[clamp(2rem,4vw,6rem)] font-serif tracking-tight leading-[1.1] font-medium text-balance">
            « Il y a trois réactions possibles à tout design : oui, non, et
            WAHOU ! La troisième est celle que je vise. »
          </h2>
          <footer className="mt-8 font-sans text-[clamp(1rem,1.5vw,1.5rem)] tracking-[0.2em] uppercase font-semibold">
            — Milton Glaser
          </footer>
        </blockquote>
      </section>
    </section>
  );
}
