"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * AnimatedTitle — Rolling Text effect
 *
 * Each character has TWO copies: an original and a clone (positioned above/below).
 * The rolling animation moves both simultaneously by yPercent ±100 with N repeats,
 * creating a seamless infinite-scroll illusion.
 *
 * The magic: instead of playing the repeating timeline directly, we SCRUB its
 * progress with power4.inOut easing. This creates perfectly smooth acceleration
 * at the start and deceleration at the end — no discrete ticks needed.
 *
 * 4 random letters per word, word-by-word sequencing, motion blur at peak velocity.
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
  const words = text.split(" ");

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Entry targets: .anim-char (original text only)
    const chars = container.current?.querySelectorAll(".anim-char");
    if (!chars || chars.length === 0) return;

    const yStart = from === "top" ? -150 : 150;

    // ─────────────────────────────────────────────────────────────────────────
    // ROLLING TEXT ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    const startSlotMachine = () => {
      // Enable per-char clip window
      container.current?.querySelectorAll(".anim-char-clip").forEach((el) => {
        (el as HTMLElement).style.overflow = "hidden";
      });

      // ── Config ──────────────────────────────────────────────────────────
      const REPEAT_COUNT = 6;        // full rotations per letter
      const ROLL_DURATION = 3.0;     // total scrub time in seconds
      const BLUR_MAX = 1.5;          // peak motion blur (px)
      const PAUSE_BETWEEN_WORDS = 1.5;
      const PAUSE_BETWEEN_CYCLES = 6;

      // ── Build word ranges ───────────────────────────────────────────────
      const charArray = Array.from(chars) as HTMLElement[];
      const wordRanges: number[][] = [];
      let idx = 0;
      for (const word of words) {
        const range: number[] = [];
        for (let i = 0; i < word.length; i++) range.push(idx++);
        wordRanges.push(range);
      }

      // ── Animate a group of letters with the rolling technique ───────────
      const animateGroup = (indices: number[], onDone?: () => void) => {
        if (indices.length === 0) {
          onDone?.();
          return;
        }

        const masterTl = gsap.timeline({ paused: true });

        indices.forEach((charIdx, i) => {
          const charEl = charArray[charIdx]; // .anim-char (original)
          const clipEl = charEl.parentElement!; // .anim-char-clip
          const cloneEl = clipEl.querySelector(".roll-clone") as HTMLElement;
          if (!cloneEl) return;

          // Alternate direction per local index
          const goesUp = i % 2 === 0;

          // Position clone above (or below) the original
          gsap.set(cloneEl, {
            opacity: 1,
            yPercent: goesUp ? -100 : 100,
          });

          // Reset original to clean state
          gsap.set(charEl, { yPercent: 0, y: 0 });

          // Create the repeating roll:
          // • Both pieces move together by ±100%
          // • Original exits one side → clone enters from the other
          // • Since they look identical, it appears as a continuous reel
          const roll = gsap.to([charEl, cloneEl], {
            repeat: REPEAT_COUNT,
            ease: "none",
            yPercent: goesUp ? "+=100" : "-=100",
            duration: 1, // arbitrary — scrubbed by progress below
          });

          masterTl.add(roll, 0);
        });

        // ── Scrub progress with ease = smooth accel/decel ─────────────────
        // This is the key technique: instead of playing the repeating timeline,
        // we animate its .progress from 0→1 with power4.inOut.
        // At the start and end, progress moves slowly → letters move slowly.
        // In the middle, progress moves fast → letters spin fast.
        gsap.to(masterTl, {
          progress: 1,
          duration: ROLL_DURATION,
          ease: "power4.inOut",
          onUpdate: function () {
            // Motion blur proportional to velocity (sine approximation)
            const p = this.progress();
            const velocity = Math.sin(p * Math.PI); // 0→1→0 bell curve
            const blur = velocity * BLUR_MAX;

            indices.forEach((charIdx) => {
              const clipEl = charArray[charIdx].parentElement!;
              (clipEl as HTMLElement).style.filter =
                blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
            });
          },
          onComplete: () => {
            // Clean up: hide clones, reset transforms, clear blur
            indices.forEach((charIdx) => {
              const charEl = charArray[charIdx];
              const clipEl = charEl.parentElement!;
              const cloneEl = clipEl.querySelector(
                ".roll-clone",
              ) as HTMLElement;

              gsap.set(charEl, { yPercent: 0, y: 0 });
              if (cloneEl) gsap.set(cloneEl, { opacity: 0, yPercent: -100 });
              (clipEl as HTMLElement).style.filter = "none";
            });
            onDone?.();
          },
        });
      };

      // ── Cycle runner ────────────────────────────────────────────────────
      const runCycle = () => {
        const group0 = pickRandom(wordRanges[0] ?? [], 4);
        const group1 = pickRandom(wordRanges[1] ?? [], 4);

        // Word 1 rolls
        animateGroup(group0, () => {
          // Pause → Word 2 rolls
          gsap.delayedCall(PAUSE_BETWEEN_WORDS, () => {
            animateGroup(group1, () => {
              // Pause → restart cycle with new random letters
              gsap.delayedCall(PAUSE_BETWEEN_CYCLES, runCycle);
            });
          });
        });
      };

      // Breathing room after entry animation
      gsap.delayedCall(1.5, runCycle);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // ENTRY ANIMATIONS
    // ─────────────────────────────────────────────────────────────────────────
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

      window.addEventListener("preloaderComplete", playAnimation);
      return () =>
        window.removeEventListener("preloaderComplete", playAnimation);
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

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Each char has original + absolute-positioned clone for the reel
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={container}
      className={`pb-[0.2em] mb-[-0.2em] pt-[0.15em] mt-[-0.15em] ${className}`}
      style={{ overflow: "hidden" }}
    >
      <Tag
        className={`${sizeClass} flex whitespace-nowrap justify-center uppercase`}
      >
        {words.map((word, wIdx) => (
          <span
            key={wIdx}
            className="flex whitespace-nowrap mr-[0.25em] last:mr-0"
          >
            {word.split("").map((char, cIdx) => (
              <span
                key={`${wIdx}-${cIdx}`}
                className="anim-char-clip"
                style={{
                  display: "inline-block",
                  verticalAlign: "bottom",
                  position: "relative",
                  overflow: "visible", // → hidden by startSlotMachine()
                }}
              >
                {/* Original text — entry animation target */}
                <span className="anim-char inline-block origin-bottom">
                  {char}
                </span>
                {/* Clone — hidden until rolling starts */}
                <span
                  className="roll-clone"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    opacity: 0,
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
