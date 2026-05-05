"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";
import Matter from "matter-js";
import { useI18n } from "@/lib/i18n";

export default function BrandSection() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const realTextRef = useRef<HTMLDivElement>(null);
  const physicsContainerRef = useRef<HTMLDivElement>(null);
  
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const isPhysicsActiveRef = useRef(false); // Ref state to prevent GSAP re-render loops

  const engineRef = useRef<Matter.Engine | null>(null);
  const requestRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  type CloneData = { body: Matter.Body; el: HTMLSpanElement };
  const clonesRef = useRef<CloneData[]>([]);

  const textLines = t.manifestoLines;

  // 1. PINNING SCROLL TRIGGER & TIMELINE
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true, // Lie l'animation au scroll
        onUpdate: (self) => {
          // Déclencheur physique
          if (self.progress > 0.7 && !isPhysicsActiveRef.current) {
            isPhysicsActiveRef.current = true;
            setIsPhysicsActive(true);
          } else if (self.progress < 0.65 && isPhysicsActiveRef.current) {
            isPhysicsActiveRef.current = false;
            setIsPhysicsActive(false);
          }
        }
      }
    });

    // Animation d'allumage des lettres (Progressif pendant le pin)
    tl.to(".real-char", {
      color: "#ffffff",
      stagger: 0.02,
      duration: 1,
      ease: "power2.inOut"
    });

  }, { scope: containerRef });

  // 2. MATTER LOGIC AND CLONE SPAWNING
  useEffect(() => {
    const container = containerRef.current;
    const physicsDOM = physicsContainerRef.current;
    const realDOM = realTextRef.current;

    // Si on a un timeout de nettoyage en cours
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }
    
    // --- SCROLL VERS LE HAUT: RETOUR À LA NORMALE ---
    if (!isPhysicsActive || !container || !physicsDOM || !realDOM) {
      if (clonesRef.current.length > 0) {
        // Animation douce des clones vers leur origine
        clonesRef.current.forEach(({ el }) => {
          gsap.killTweensOf(el);
          gsap.to(el, { 
            x: 0, y: 0, rotation: 0, 
            scale: 1, filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))", 
            duration: 0.6, ease: "power3.out" 
          });
        });
        
        // Transition douce plus rapide pour résilier le scroll scrubbing extrême
        timeoutRef.current = setTimeout(() => {
            if (physicsDOM) physicsDOM.innerHTML = "";
            if (realDOM) gsap.set(realDOM, { opacity: 1 });
            clonesRef.current = [];
        }, 600);
      }

      if (engineRef.current) {
         Matter.Engine.clear(engineRef.current);
         engineRef.current = null;
      }
      return;
    }

    // --- SCROLL VERS LE BAS: ACTIVATION MATERIELLE ---
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    // Gravité adoucie pour une chute beaucoup plus smooth (effet ralenti/gracieux)
    world.gravity.y = 1.2; 

    const containerRect = container.getBoundingClientRect();
    const realSpans = Array.from(realDOM.querySelectorAll(".real-char")) as HTMLElement[];

    // Tuer les animations résiduelles sur le vrai texte au cas où et le cacher
    gsap.killTweensOf(realDOM);
    gsap.set(realDOM, { opacity: 0 });
    physicsDOM.innerHTML = ""; // Vider le DOM physique avant de spawn

    const newClones: CloneData[] = [];

    realSpans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      const y = rect.top - containerRect.top;

      // Clonage visuel parfait mais ultra purifié pour éviter les "carrés noirs" de conflit GPU Chrome
      const clone = document.createElement("span");
      clone.innerText = span.innerText;
      // On retire TOUTES les classes complexes (transition, opacité, et surtout 'real-char' qui est pollué par GSAP)
      // Ajout du hover de la couleur accent et curseur interactif
      clone.className = "inline-block whitespace-pre text-background hover:text-accent transition-colors duration-300 cursor-grab active:cursor-grabbing"; 
      clone.style.position = "absolute";
      clone.style.left = `${x}px`;
      clone.style.top = `${y}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.display = "flex";
      clone.style.alignItems = "center";
      clone.style.justifyContent = "center";
      clone.style.margin = "0";
      clone.style.backgroundColor = "transparent"; // Force la non-occlusion
      clone.style.filter = "drop-shadow(0px 0px 0px rgba(0,0,0,0))"; // Initial transparent shadow
      
      physicsDOM.appendChild(clone);

      // Animate 3D Pop (Drop-shadow and scale)
      gsap.to(clone, {
        filter: "drop-shadow(0px 15px 20px rgba(0,0,0,0.4))",
        scale: 1.05,
        duration: 0.8,
        delay: Math.random() * 0.15,
        ease: "power2.out"
      });

      const centerX = x + rect.width / 2;
      const centerY = y + rect.height / 2;
      
      // On réduit légèrement la hitbox physique (85%) par rapport au visuel !
      // Indispensable car `tracking-tight` superpose les lettres CSS, ce qui ferait exploser MatterJS au spawn !
      const body = Matter.Bodies.rectangle(centerX, centerY, rect.width * 0.85, rect.height * 0.85, {
        restitution: 0.5,
        friction: 0.2,
        frictionAir: 0.035, // Friction de l'air augmentée pour donner l'impression qu'ils flottent un peu
        density: 0.05,
        angle: (Math.random() - 0.5) * 0.05
      });

      // Petite secousse de décrochage (énormément adoucie)
      Matter.Body.setVelocity(body, { 
          x: (Math.random() - 0.5) * 2, 
          y: -1 - Math.random() * 2 
      });

      newClones.push({ body, el: clone });
    });

    clonesRef.current = newClones;
    Matter.Composite.add(world, newClones.map(c => c.body));

    // Création des parois invisibles
    // Le sol est remonté de 60px (48px de padding-bottom + 12px de marge) pour que le texte se pose SUR la ligne
    const wallThick = 500;
    const ground = Matter.Bodies.rectangle(
      containerRect.width / 2, containerRect.height - 60 + wallThick / 2, 
      containerRect.width * 5, wallThick, 
      { isStatic: true }
    );
    const leftWall = Matter.Bodies.rectangle(
      -wallThick / 2 + 2, containerRect.height / 2, 
      wallThick, containerRect.height * 5, 
      { isStatic: true }
    );
    const rightWall = Matter.Bodies.rectangle(
      containerRect.width + wallThick / 2 - 2, containerRect.height / 2, 
      wallThick, containerRect.height * 5, 
      { isStatic: true }
    );
    Matter.Composite.add(world, [ground, leftWall, rightWall]);

    // Responsive Walls on Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      Matter.Body.setPosition(ground, {
        x: rect.width / 2,
        y: rect.height - 60 + wallThick / 2
      });
      Matter.Body.setPosition(leftWall, {
        x: -wallThick / 2 + 2,
        y: rect.height / 2
      });
      Matter.Body.setPosition(rightWall, {
        x: rect.width + wallThick / 2 - 2,
        y: rect.height / 2
      });
    };
    window.addEventListener("resize", handleResize);

    // Outil MouseConstraint pour attraper au clic (Drag & Throw)
    const mouse = Matter.Mouse.create(physicsDOM);
    
    // On retire les écoutes de scroll Matter pour ne pas retenir la page en otage !
    // @ts-ignore
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.Composite.add(world, mouseConstraint);

    // Boucle de mise à jour des clones
    const update = () => {
      if (!engineRef.current || !isPhysicsActive) return;
      Matter.Engine.update(engineRef.current, 1000 / 60);

      clonesRef.current.forEach(({ body, el }) => {
        const initCenterX = parseFloat(el.style.left) + el.offsetWidth / 2;
        const initCenterY = parseFloat(el.style.top) + el.offsetHeight / 2;
        
        const dx = body.position.x - initCenterX;
        const dy = body.position.y - initCenterY;
        
        gsap.set(el, { x: dx, y: dy, rotation: body.angle * (180 / Math.PI) });
      });

      requestRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, [isPhysicsActive]); // Réagit uniquement au changement d'état physique


  return (
    <section
      id="brand"
      ref={containerRef}
      className="relative w-full h-full min-h-[calc(100vh-5vh)] bg-foreground overflow-hidden flex flex-col justify-between px-8 md:px-16 py-12 text-background z-20 cursor-crosshair"
    >
      <div className="flex justify-between items-start w-full mix-blend-difference z-30 select-none">
        <div className="flex flex-col font-anton tracking-tighter leading-[0.85]">
          <span className="text-[clamp(1.5rem,4vw,3.75rem)] mt-2 md:mt-4">2/5</span>
        </div>
        <div className="flex gap-2 md:gap-4 font-light text-[clamp(0.625rem,2.3vw,2.25rem)] mt-3 md:mt-4 uppercase tracking-[0.2em] pt-0.5 md:pt-2 text-background/70">
          <span>{t.manifestoTag1}</span>
        </div>
        <div className="flex gap-2 md:gap-4 font-light text-[clamp(0.625rem,2.3vw,2.25rem)] mt-3 md:mt-4 uppercase tracking-[0.2em] pt-0.5 md:pt-2 text-background/70">
          <span>{t.manifestoTag2}</span>
        </div>
      </div>

      {/* Vrai texte, gère le flux de la page */}
      <div 
        ref={realTextRef}
        className="flex-1 flex flex-col items-center justify-center relative z-20 pointer-events-none select-none pb-4 md:pb-8"
      >
        <div className="flex flex-col items-center gap-0">
          {textLines.map((line, lineIdx) => (
            <h2 
              key={lineIdx}
              className="font-anton text-[clamp(3rem,12vw,15.5vh)] md:text-[clamp(4rem,10.5vw,15.5vh)] leading-none uppercase tracking-tight whitespace-nowrap pointer-events-auto"
            >
              {line.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="real-char inline-block whitespace-pre opacity-90 transition-opacity"
                  style={{ color: "#3f3f46" }}
                >
                  {char}
                </span>
              ))}
            </h2>
          ))}
        </div>
      </div>

      {/* Récipient physique pour les clones, purement visuel. Hérite des tailles de police parentes pour les clones */}
      <div 
        ref={physicsContainerRef} 
        className="absolute inset-0 pointer-events-auto z-25 font-anton text-[clamp(3rem,12vw,15.5vh)] md:text-[clamp(4rem,10.5vw,15.5vh)] leading-none uppercase tracking-tight" 
      />

      <div className="w-full h-px bg-background/80 mix-blend-difference z-30 relative" />
    </section>
  );
}
