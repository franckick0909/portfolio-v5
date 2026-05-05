"use client";

import { useEffect, useRef } from "react";

/**
 * SMOKE / LIQUID CURSOR
 *
 * Particles spawn at the cursor and drift/expand/fade like smoke or ink
 * dropped in water. Each particle is a soft radial gradient blob.
 * Pure Canvas 2D — zero deps, zero lag.
 * mix-blend-difference inverts colors automatically on dark/light bg.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;        // velocity x
  vy: number;        // velocity y
  radius: number;    // current radius
  maxRadius: number; // grows to this
  alpha: number;     // starts at 1, fades to 0
  life: number;      // 0 → 1
  decay: number;     // how fast life drains
}

const MAX_PARTICLES = 200;

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    document.body.style.cursor = "none";

    const particles: Particle[] = [];
    let mx = -500, my = -500;
    let pvx = 0, pvy = 0; // previous velocity for turbulence
    let raf = 0;

    const spawnParticle = (x: number, y: number, vx: number, vy: number) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();

      const speed = Math.hypot(vx, vy);
      const spread = 1.5 + Math.random() * 1.5;

      particles.push({
        x,
        y,
        // Drift: slightly in the movement direction + random spread
        vx: vx * 0.12 + (Math.random() - 0.5) * spread,
        vy: vy * 0.12 + (Math.random() - 0.5) * spread - 0.3, // subtle upward drift
        radius: 4 + Math.random() * 4,
        maxRadius: 30 + Math.random() * 40 + speed * 0.8,
        alpha: 0.55 + Math.random() * 0.3,
        life: 0,
        decay: 0.010 + Math.random() * 0.008,
      });
    };

    let lastX = -500, lastY = -500;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      // Spawn 2–4 particles per move for density
      const count = 2 + Math.floor(Math.hypot(dx, dy) / 20);
      for (let i = 0; i < Math.min(count, 4); i++) {
        const t = i / Math.max(count, 1);
        spawnParticle(
          lastX + dx * t + (Math.random() - 0.5) * 2,
          lastY + dy * t + (Math.random() - 0.5) * 2,
          dx, dy
        );
      }

      pvx = dx;
      pvy = dy;
      lastX = e.clientX;
      lastY = e.clientY;
      mx = e.clientX;
      my = e.clientY;
    };

    const onMouseDown = (e: MouseEvent) => {
      // Burst on click
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
        const spd = 2 + Math.random() * 5;
        spawnParticle(e.clientX, e.clientY, Math.cos(angle) * spd * 6, Math.sin(angle) * spd * 6);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);

    const render = () => {
      // Semi-transparent clear creates a trailing blur (motion blur effect)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Advance life
        p.life += p.decay;
        if (p.life >= 1) {
          particles.splice(i, 1);
          continue;
        }

        // Eased-out radius growth
        const t = 1 - Math.pow(1 - p.life, 3); // cubic ease out
        const r = p.radius + (p.maxRadius - p.radius) * t;
        // Fade: fast in, slow out
        const alpha = p.alpha * (1 - Math.pow(p.life, 1.5));

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        // Decelerate
        p.vx *= 0.96;
        p.vy *= 0.96;

        if (alpha <= 0.001 || r <= 0) continue;

        // Draw soft radial gradient blob
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0,   `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.6})`);
        grad.addColorStop(1,   `rgba(255,255,255,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Small sharp dot at exact cursor position
      if (mx > -200) {
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", resize);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference"
    />
  );
}