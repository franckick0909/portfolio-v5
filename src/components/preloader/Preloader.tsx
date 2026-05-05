"use client";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import PreloaderImages from "./PreloaderImages";

const PreloaderCanvas = dynamic(() => import("./PreloaderCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Preloader() {
  const container = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [exitStage, setExitStage] = useState(0);
  const [imagesImploded, setImagesImploded] = useState(false);

  // 1. Gestion du compteur
  useEffect(() => {
    gsap.set(".counter-value", { yPercent: 120 });
    gsap.set(".preloader-tags", { opacity: 0 });

    const tl = gsap.timeline({ delay: 1.2 });
    tl.to(".counter-value", { yPercent: 0, duration: 1.2, ease: "expo.out" });
    tl.to(".preloader-tags", { opacity: 1, duration: 1 }, "<0.4");

    const startCount = setTimeout(() => {
      const timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + 1.2;
        });
      }, 70);
    }, 1000);

    return () => clearTimeout(startCount);
  }, []);

  // 2. Écoute l'événement d'implosion des images
  useEffect(() => {
    const handleImploded = () => setImagesImploded(true);
    window.addEventListener("imagesImploded", handleImploded);
    return () => window.removeEventListener("imagesImploded", handleImploded);
  }, []);

  // 3. Séquence de sortie synchronisée
  useEffect(() => {
    if (progress >= 100 && container.current) {
      const tl = gsap.timeline();

      // Étape A : Disparition immédiate de l'interface texte quand on arrive à 100%
      tl.to(".counter-char", {
        yPercent: 150,
        opacity: 0,
        duration: 0.6,
        stagger: { amount: 0.3, from: "end" },
        ease: "power2.in",
      });
      tl.to(".preloader-tags", { opacity: 0, duration: 0.4 }, "<");

      // Étape B : Signal pour le Canvas 3D
      tl.call(() => setExitStage(1));
    }
  }, [progress]);

  // 4. RÉVÉLATION FINALE : Ne se déclenche QUE si imagesImploded est vrai (et qu'on a fini le compteur)
  useEffect(() => {
    if (imagesImploded && progress >= 100 && container.current) {
      gsap.to(".preloader-strip", {
        yPercent: 100,
        duration: 0.8,
        ease: "expo.inOut",
        stagger: { amount: 0.3, from: "edges" },
        onStart: () => {
          // On prévient le Hero et les autres que c'est le moment de se révéler
          window.dispatchEvent(new CustomEvent("preloaderComplete"));
        },
        onComplete: () => {
          if (container.current) container.current.style.display = "none";
        },
      });
    }
  }, [imagesImploded, progress]);

  const strips = Array.from({ length: 7 });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[108] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 flex">
        {strips.map((_, i) => (
          <div key={i} className="preloader-strip flex-1 h-full mix-blend-difference bg-[#050505]" />
        ))}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <PreloaderImages />
      </div>

      <div className="preloader-canvas absolute inset-0 z-20 flex items-center justify-center">
        <PreloaderCanvas progress={progress} exitStage={exitStage} />
      </div>

      <div className="preloader-text relative z-30 w-full h-full p-8 md:p-12 flex flex-col justify-between pointer-events-none">
        <div className="preloader-tags flex justify-between w-full uppercase tracking-widest text-xs font-sans text-zinc-300">
          <span>Loading Experience</span>
          <span>FR / 2026</span>
        </div>

        <div className="flex justify-between items-end w-full">
          <div className="preloader-tags max-w-[200px] text-xs font-sans text-zinc-300 uppercase tracking-widest leading-relaxed">
            / Prepare for a digital journey
          </div>

          <div className="counter-wrapper font-(family-name:--font-oswald) font-bold text-[12vw] md:text-[7vw] leading-none text-zinc-200 tracking-tighter flex overflow-hidden">
            {progress >= 100 ? (
              "100%".split("").map((c, i) => (
                <span key={i} className="counter-char inline-block origin-bottom">{c}</span>
              ))
            ) : (
              <span className="counter-value inline-block">{Math.floor(Math.min(progress, 100))}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
