"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplashCursor from "./SplashCursor";

/**
 * FluidCursor — Complete Cappen-style cursor implementation
 * 
 * Includes:
 * 1. The WebGL fluid ink simulation (SplashCursor) acting as the background trail
 * 2. The "VOIR" label that scales in when hovering specific elements
 */
export default function FluidCursor() {
  const labelRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isHoverLabel = useRef(false);

  useEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    // GSAP quickSetters for buttery smooth performance
    const setLX = gsap.quickSetter(label, "x", "px") as (v: number) => void;
    const setLY = gsap.quickSetter(label, "y", "px") as (v: number) => void;

    // LERP lag factor (Cappen has a very responsive but slightly smoothed dot)
    const LERP = 0.18;

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;

      setLX(pos.current.x);
      setLY(pos.current.y);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // Track mouse
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ─── Hover states ────────────────────────────────────────────

    const onEnterView = (e: Event) => {
      isHoverLabel.current = true;
      const el = e.currentTarget as HTMLElement;
      const text = el.dataset.cursorLabel || "VOIR";
      const labelText = label.querySelector(".cursor-label-text");
      if (labelText) labelText.textContent = text;

      gsap.fromTo(
        label,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.4)" }
      );
    };

    const onLeaveView = () => {
      isHoverLabel.current = false;
      gsap.to(label, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    };

    // Attach to all interactive elements
    const views = document.querySelectorAll("[data-cursor='view'], figure, .works-card");

    views.forEach((el) => {
      el.addEventListener("mouseenter", onEnterView);
      el.addEventListener("mouseleave", onLeaveView);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      views.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterView);
        el.removeEventListener("mouseleave", onLeaveView);
      });
    };
  }, []);

  return (
    <>
      {/* ── 1. WebGL Fluid Ink Simulation ── */}
      {/* We use SplashCursor as the underlying trail layer. 
          Settings matched for a thick ink splatter that fades like Cappen */}
      <SplashCursor 
        COLOR="#ffffff" 
        TRANSPARENT={true}
        SPLAT_RADIUS={0.15}     // Smaller trail size for a more refined cursor
        SPLAT_FORCE={6000}     // More intense splatter
        DENSITY_DISSIPATION={4.5} // Threshold makes it shrink, this controls shrink speed
        VELOCITY_DISSIPATION={3} 
      />

      {/* ── 2. Hover label (View / Voir) ── */}
      <div
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          // Anchor: bottom-left of the label aligns with cursor position
          marginLeft: 15,
          marginTop: -55,
          transformOrigin: "bottom left",
          scale: "0",
          opacity: 0,
          willChange: "transform, opacity",
          display: "flex",
          alignItems: "stretch",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {/* Text part */}
        <div
          className="cursor-label-text"
          style={{
            padding: "10px 14px",
            backgroundColor: "#fcfcfc",
            color: "#0a0a0a",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          VOIR
        </div>
        {/* Icon part */}
        <div
          style={{
            width: 40,
            backgroundColor: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2H12M12 2V12M12 2L2 12"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
}