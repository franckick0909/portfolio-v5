"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * AnimatedTitle — Rolling Text effect
 * ULTRA-STRICT CLIPPING for tight layouts.
 */

interface AnimatedTitleProps {
  text: string;
  sizeClass?: string;
  trigger?: "delay" | "scroll" | "event";
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  from?: "top" | "bottom";
  staggerFrom?: "center" | "start" | "end";
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(n, arr.length));
}

export default function AnimatedTitle({
  text,
  sizeClass = "text-[12vw]",
  trigger = "delay",
  delay = 0,
  className = "",
  as: Tag = "h1",
  from = "top",
  staggerFrom = "center",
}: AnimatedTitleProps) {
  const container = useRef<HTMLDivElement>(null);
  const words = text.trim().split(/\s+/);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const chars = container.current?.querySelectorAll(".anim-char");
    if (!chars || chars.length === 0) return;

    const yStart = from === "top" ? -150 : 150;

    const startSlotMachine = () => {
      const REPEAT_COUNT = 6;
      const ROLL_DURATION = 3.0;
      const BLUR_MAX = 1.0; 
      const PAUSE_BETWEEN_WORDS = 1.5;
      const PAUSE_BETWEEN_CYCLES = 6;

      const charArray = Array.from(chars) as HTMLElement[];
      const wordRanges: number[][] = [];
      let idx = 0;
      for (const word of words) {
        const range: number[] = [];
        for (let i = 0; i < word.length; i++) range.push(idx++);
        wordRanges.push(range);
      }

      const animateGroup = (indices: number[], onDone?: () => void) => {
        if (indices.length === 0) {
          onDone?.();
          return;
        }

        const masterTl = gsap.timeline({ paused: true });

        indices.forEach((charIdx, i) => {
          const charEl = charArray[charIdx];
          const clipEl = charEl.parentElement!;
          const cloneEl = clipEl.querySelector(".roll-clone") as HTMLElement;
          if (!cloneEl) return;

          const goesUp = i % 2 === 0;

          gsap.set(cloneEl, {
            opacity: 1,
            yPercent: goesUp ? -100 : 100,
          });

          gsap.set(charEl, { yPercent: 0, y: 0 });

          const roll = gsap.to([charEl, cloneEl], {
            repeat: REPEAT_COUNT,
            ease: "none",
            yPercent: goesUp ? "+=100" : "-=100",
            duration: 1,
          });

          masterTl.add(roll, 0);
        });

        gsap.to(masterTl, {
          progress: 1,
          duration: ROLL_DURATION,
          ease: "power4.inOut",
          onUpdate: function () {
            const p = this.progress();
            const velocity = Math.sin(p * Math.PI);
            const blur = velocity * BLUR_MAX;

            indices.forEach((charIdx) => {
              const clipEl = charArray[charIdx].parentElement!;
              (clipEl as HTMLElement).style.filter =
                blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "none";
            });
          },
          onComplete: () => {
            indices.forEach((charIdx) => {
              const charEl = charArray[charIdx];
              const clipEl = charEl.parentElement!;
              const cloneEl = clipEl.querySelector(".roll-clone") as HTMLElement;

              gsap.set(charEl, { yPercent: 0, y: 0 });
              if (cloneEl) gsap.set(cloneEl, { opacity: 0, yPercent: -100 });
              (clipEl as HTMLElement).style.filter = "none";
            });
            onDone?.();
          },
        });
      };

      const runCycle = () => {
        const group0 = pickRandom(wordRanges[0] ?? [], 4);
        const group1 = pickRandom(wordRanges[1] ?? [], 4);

        animateGroup(group0, () => {
          gsap.delayedCall(PAUSE_BETWEEN_WORDS, () => {
            animateGroup(group1, () => {
              gsap.delayedCall(PAUSE_BETWEEN_CYCLES, runCycle);
            });
          });
        });
      };

      gsap.delayedCall(1.5, runCycle);
    };

    if (trigger === "scroll") {
      gsap.fromTo(
        chars,
        { yPercent: yStart, opacity: 0, rotateX: -20 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: { amount: 1, from: staggerFrom },
          ease: "power4.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 90%",
            end: "top 20%",
            toggleActions: "play none none none",
          },
          onComplete: startSlotMachine,
        },
      );
    } else if (trigger === "event") {
      gsap.set(chars, { yPercent: yStart, opacity: 0, rotateX: -30 });

      const playAnimation = () => {
        if (typeof window !== "undefined") {
          (window as any).__preloaderComplete = true;
        }
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          delay,
          stagger: { amount: 1.2, from: staggerFrom },
          ease: "power4.out",
          onComplete: startSlotMachine,
        });
      };

      const isPreloaderGone =
        typeof window !== "undefined" &&
        (!!(window as any).__preloaderComplete ||
          !document.querySelector(".preloader-canvas"));

      if (isPreloaderGone) {
        playAnimation();
      } else {
        window.addEventListener("preloaderComplete", playAnimation);
      }
      return () => window.removeEventListener("preloaderComplete", playAnimation);
    } else {
      gsap.fromTo(
        chars,
        { yPercent: yStart, opacity: 0, rotateX: -30 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          delay: delay + 0.025,
          stagger: { amount: 1.2, from: staggerFrom },
          ease: "power4.out",
          onComplete: startSlotMachine,
        },
      );
    }
  }, { scope: container, dependencies: [text, trigger, delay] });

  return (
    <div
      ref={container}
      className={`relative ${className}`}
      style={{ 
        overflow: "hidden",
        isolation: "isolate",
        overflowY: "hidden",
      }}
    >
      <Tag
        className={`${sizeClass} flex whitespace-nowrap justify-center uppercase tracking-[-0.02em] font-mona font-black`}
      >
        {words.map((word, wIdx) => (
          <span
            key={`word-${wIdx}`}
            className="inline-flex overflow-hidden"
            style={{ marginRight: wIdx < words.length - 1 ? "0.25em" : "0px" }}
          >
            {word.split("").map((char, cIdx) => (
              <span
                key={`letter-${wIdx}-${cIdx}`}
                className="anim-char-clip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  lineHeight: 0.9, // Retire l'espace de la baseline sous les lettres
                  clipPath: "inset(0 0 0 0)",
                  WebkitClipPath: "inset(0 0 0 0)",
                }}
              >
                {/* Original character */}
                <span className="anim-char inline-block will-change-transform">
                  {char}
                </span>
                {/* Absolute clone character */}
                <span
                  className="roll-clone pointer-events-none"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    willChange: "transform",
                    overflow: "hidden",
                    lineHeight: 0.9, // Retire l'espace de la baseline sous les lettres
                    clipPath: "inset(0 0 0 0)",
                    WebkitClipPath: "inset(0 0 0 0)",
                  }}
                >
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </Tag>
    </div>
  );
}
