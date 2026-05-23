"use client";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import PreloaderImages from "./PreloaderImages";

const PreloaderCanvas = dynamic(() => import("./PreloaderCanvas"), {
  ssr: false,
  loading: () => null,
});

const BG_SLICES = 32;

export default function Preloader() {
  const container = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [exitStage, setExitStage] = useState(0);
  const [imagesImploded, setImagesImploded] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useGSAP(() => {
    const numBlinds = BG_SLICES;
    let pts = [];
    const H = 100 / numBlinds;
    const overlap = 0.2;
    for (let i = 0; i < numBlinds; i++) {
      const y1 = i * H;
      const y2 = y1 + H + overlap;
      pts.push(`0% ${y1}%`, `100% ${y1}%`, `100% ${y2}%`, `0% ${y2}%`);
    }
    gsap.set("#preloader-bg-overlay", { clipPath: `polygon(${pts.join(", ")})` });
  }, { scope: container });

  // 1. Gestion du compteur
  useEffect(() => {
    gsap.set(".counter-value", { yPercent: 120 });
    gsap.set(".preloader-tags", { opacity: 0 });

    const isFast = window.innerWidth < 1024;

    const tl = gsap.timeline({ delay: isFast ? 0.5 : 1.2 });
    tl.to(".counter-value", { yPercent: 0, duration: 1.2, ease: "expo.out" });
    tl.to(".preloader-tags", { opacity: 1, duration: 1 }, "<0.4");

    const startCount = setTimeout(() => {
      const timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + (isFast ? 3 : 1.2);
        });
      }, isFast ? 30 : 70);
    }, isFast ? 500 : 1000);

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
      const numBlinds = BG_SLICES;
      const blindObjs = Array.from({ length: numBlinds }, () => ({ val: 0 }));
      const overlap = 0.2;

      const updateClipPath = () => {
        let pts = [];
        const H = 100 / numBlinds;
        for (let i = 0; i < numBlinds; i++) {
          const y1 = i * H;
          // shrink the slice to y1 (top)
          const y2 = y1 + ((100 - blindObjs[i].val) / 100) * (H + overlap);
          pts.push(`0% ${y1}%`, `100% ${y1}%`, `100% ${y2}%`, `0% ${y2}%`);
        }
        const el = document.getElementById("preloader-bg-overlay");
        if (el) el.style.clipPath = `polygon(${pts.join(", ")})`;
      };

      gsap.to(blindObjs, {
        val: 100,
        duration: 0.8,
        ease: "expo.inOut",
        stagger: 0.02,
        onUpdate: updateClipPath,
        onStart: () => {
          // On prévient le Hero et les autres que c'est le moment de se révéler
          window.dispatchEvent(new CustomEvent("preloaderComplete"));
        },
        onComplete: () => {
          if (container.current) container.current.style.display = "none";
          setIsDestroyed(true);
        },
      });
    }
  }, [imagesImploded, progress]);

  if (isDestroyed) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden"
    >
      <div
        id="preloader-bg-overlay"
        className="absolute inset-0 z-0 w-full h-full mix-blend-difference bg-[#050505]"
      />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <PreloaderImages />
      </div>

      <div className="preloader-canvas absolute inset-0 z-20 flex items-center justify-center">
        {isDesktop && <PreloaderCanvas progress={progress} exitStage={exitStage} />}
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
