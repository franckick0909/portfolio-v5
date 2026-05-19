"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

const PRELOADER_IMAGE_URL = [
  "https://cdn.dribbble.com/userupload/15840198/file/original-96093466b8b45dab2557487ba87894d8.jpg?resize=1600x1200&vertical=center",
  "https://cdn.dribbble.com/userupload/44485950/file/b90cc5448490aa9772ecf0767340f228.png?resize=2400x1800&vertical=center",
  "/preloader/load1.jpg",
  "/preloader/load2.jpg",
  "/preloader/load3.jpg",
  "/preloader/load4.jpg",
  "/preloader/load5.jpg",
  "/preloader/load6.jpg",
  "/preloader/load7.jpg",
  "/preloader/load8.jpg",
  "/preloader/load9.jpg",
  "/preloader/load10.png",
] as const;

const PAD = 64; // Distance du bord

export default function PreloaderImages() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = root.current;
      if (!el) return;

      const images = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll(".preloader-image"),
      );
      if (!images.length) return;

      const firstImage = images[0];
      const noFirstImages = images.slice(1);
      const lastImage = images[images.length - 1];
      const noLastImages = images.slice(0, -1);

      const duration = 1;

      // Initialisation : au centre (x:0, y:0 par rapport à la classe CSS centered)
      gsap.set(images, { x: 0, y: 0, scale: 0, opacity: 1 });

      const isFast = window.innerWidth < 1024;
      const tl = gsap.timeline({ delay: isFast ? 1.5 : 5.5 });

      // 1. Apparition au centre
      tl.to(firstImage, {
        scale: 1,
        duration: duration,
        ease: "power3.out",
      });

      tl.to(
        noFirstImages,
        {
          scale: 1,
          duration: duration,
          ease: "power3.out",
          stagger: 0.12,
        },
        `<${duration / 3}`,
      );

      // 2. Calcul du mouvement vers le coin inférieur droit
      let dx = 0;
      let dy = 0;
      tl.call(() => {
        const rect = firstImage.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
          // Sur mobile, on le centre horizontalement (dx = 0) 
          // et on le place au-dessus des textes du bas (bottomPad d'environ 160px pour tout remonter)
          const bottomPad = 160;
          dx = 0;
          dy = (window.innerHeight - bottomPad - rect.height / 2) - (window.innerHeight / 2);
        } else {
          // Sur desktop, coin inférieur droit
          dx = (window.innerWidth - PAD - rect.width / 2) - (window.innerWidth / 2);
          dy = (window.innerHeight - PAD - rect.height / 2) - (window.innerHeight / 2);
        }
      });

      // 3. Mouvement vers le coin
      const totalMoveDuration = duration + 0.12 * (noLastImages.length - 1);

      tl.to(noLastImages, {
        x: () => dx,
        y: () => dy,
        duration: duration * 1.2,
        ease: "power2.inOut",
        stagger: 0.1,
      });

      // Pulse pendant le mouvement
      tl.to(
        images,
        {
          keyframes: {
            "15%": { scale: 1.1, ease: "power2.in" },
            "45%": { scale: 1.2, ease: "power2.out" },
            "100%": { scale: 1, ease: "power3.inOut" },
          },
          duration: duration * 1.2,
          stagger: 0.1,
        },
        `<`,
      );

      tl.to(
        lastImage,
        {
          x: () => dx,
          y: () => dy,
          duration: duration * 1.2,
          ease: "power2.inOut",
        },
        `<${duration - 0.1}`,
      );

      // 4. IMPLOSION
      let finalRect = { x: 0, y: 0, width: 0, height: 0 };
      tl.call(() => {
        const lastRect = lastImage.getBoundingClientRect();
        finalRect = {
          x: lastRect.left,
          y: lastRect.top,
          width: lastRect.width,
          height: lastRect.height,
        };
      });

      tl.to(
        images,
        {
          scale: 0,
          opacity: 0,
          rotation: () => gsap.utils.random(-60, 60),
          duration: 0.8,
          ease: "expo.in",
          stagger: {
            each: 0.04,
            from: "end",
          },
          onComplete: () => {
             // SIGNAL : L'implosion est FINIE, on peut révéler le Hero
             window.dispatchEvent(new CustomEvent("imagesImploded", {
               detail: finalRect,
             }));
          },
        },
        `>0.3`
      );

      tl.set(el, { pointerEvents: "none", zIndex: 0 });
      
      const resize = () => {
        tl.progress(0).invalidate().restart();
      };
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-10 overflow-visible">
      {PRELOADER_IMAGE_URL.map((src, i) => (
        <Image
          priority
          key={`${src}-${i}`}
          src={src}
          alt="Preloader Image"
          className="preloader-image pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-video w-[55%] md:w-1/3 max-w-md origin-center scale-0 rounded-xl object-cover will-change-transform"
          style={{ zIndex: i + 1 } as React.CSSProperties}
          width={400}
          height={200}
        />
      ))}
    </div>
  );
}
