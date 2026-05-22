"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("Multiple instances of Three.js") ||
            args[0].includes("THREE.Clock: This module has been deprecated") ||
            args[0].includes("THREE.Timer"))
        ) {
          return;
        }
        originalWarn(...args);
      };
    }
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
