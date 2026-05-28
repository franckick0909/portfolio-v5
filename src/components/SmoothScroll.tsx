"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Supprimer les avertissements de Three.js
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

      // 2. Désactiver complètement View Transitions sur mobile/tablette (<1024px)
      // Cela évite tous les ralentissements et les erreurs d'annulation de transition (InvalidStateError)
      // en forçant next-view-transitions à utiliser la navigation standard fluide de Next.js.
      if (window.innerWidth < 1024) {
        try {
          // @ts-ignore
          if (Document.prototype && Document.prototype.startViewTransition) {
            // @ts-ignore
            delete Document.prototype.startViewTransition;
            console.log("View Transitions désactivées pour mobile/tablette (Navigation standard activée).");
          }
        } catch (e) {
          console.warn("Impossible de désactiver startViewTransition sur mobile:", e);
        }
      }

      // 3. Intercepter l'erreur inoffensive "Transition was aborted" de View Transitions (au cas où)
      // pour éviter l'écran d'erreur rouge Next.js en développement sur desktop.
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        if (
          reason &&
          (reason.name === 'InvalidStateError' ||
            reason.name === 'AbortError' ||
            (reason.message &&
              (reason.message.includes('Transition was aborted') ||
                reason.message.includes('invalid state') ||
                reason.message.includes('startViewTransition'))))
        ) {
          event.preventDefault();
          console.warn("View transition was aborted by the browser (harmless):", reason.message);
        }
      };

      const handleGlobalError = (event: ErrorEvent) => {
        const message = event.message || "";
        const error = event.error;
        if (
          message.includes('Transition was aborted') ||
          message.includes('invalid state') ||
          (error && (error.name === 'InvalidStateError' || error.name === 'AbortError'))
        ) {
          event.preventDefault();
          console.warn("View transition error caught (harmless):", message);
        }
      };

      window.addEventListener("unhandledrejection", handleUnhandledRejection);
      window.addEventListener("error", handleGlobalError);

      return () => {
        window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        window.removeEventListener("error", handleGlobalError);
      };
    }
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
