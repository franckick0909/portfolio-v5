"use client";
import {
  Environment,
  MarchingCube,
  MarchingCubes,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ============================================================================
// Types & Constants
// ============================================================================

interface BallConfig {
  speed: number;
  size: number;
  strength: number;
  /** Anchor position (normalized 0..1 in MarchingCubes space) */
  anchor: [number, number, number];
  /** Orbit radius around the anchor */
  orbit: number;
  /** Mouse parallax depth factor (higher = reacts more) */
  parallaxDepth: number;
}

interface MovingBallProps extends BallConfig {
  index: number;
  mouseRef: React.RefObject<THREE.Vector2>;
}

// --- Desktop: Full composition centered on the gap ---
const BALLS_DESKTOP: BallConfig[] = [
  // ─── Main Cluster (anchored in the gap) ───
  { speed: 0.10, size: 1.30, strength: 0.42, anchor: [0.50, 0.52, 0.5], orbit: 0.08, parallaxDepth: 0.4 },
  { speed: 0.16, size: 0.80, strength: 0.36, anchor: [0.48, 0.50, 0.5], orbit: 0.12, parallaxDepth: 0.5 },
  { speed: 0.20, size: 0.55, strength: 0.32, anchor: [0.53, 0.48, 0.5], orbit: 0.10, parallaxDepth: 0.55 },
  // ─── Peripheral Accents ───
  { speed: 0.09, size: 0.90, strength: 0.34, anchor: [0.68, 0.65, 0.5], orbit: 0.18, parallaxDepth: 0.3 },
  { speed: 0.12, size: 0.70, strength: 0.33, anchor: [0.32, 0.38, 0.5], orbit: 0.20, parallaxDepth: 0.5 },
  { speed: 0.22, size: 0.40, strength: 0.28, anchor: [0.55, 0.58, 0.5], orbit: 0.14, parallaxDepth: 0.6 },
  { speed: 0.07, size: 0.65, strength: 0.30, anchor: [0.42, 0.62, 0.5], orbit: 0.16, parallaxDepth: 0.45 },
];

// --- Mobile: Fewer balls, container is positioned in the bottom half ---
const BALLS_MOBILE: BallConfig[] = [
  // Primary — large, centered
  { speed: 0.10, size: 1.40, strength: 0.42, anchor: [0.50, 0.50, 0.5], orbit: 0.10, parallaxDepth: 0.3 },
  // Secondary — orbits around primary
  { speed: 0.15, size: 0.85, strength: 0.36, anchor: [0.45, 0.52, 0.5], orbit: 0.14, parallaxDepth: 0.4 },
  // Small accent
  { speed: 0.20, size: 0.50, strength: 0.30, anchor: [0.55, 0.48, 0.5], orbit: 0.12, parallaxDepth: 0.5 },
];

const MARCHING_CUBES_CONFIG = {
  resolution: 64, // Réduit de 100 à 64 (sauve ~75% de calcul CPU par frame)
  maxPolyCount: 50000,
  enableUvs: false,
  enableColors: false,
} as const;

const MARCHING_CUBES_MOBILE = {
  resolution: 48, // Réduit de 64 à 48
  maxPolyCount: 30000,
  enableUvs: false,
  enableColors: false,
} as const;

// Matériau verre — réfraction pure, pas de couleurs par vertex
const MATERIAL_CONFIG = {
  backside: true,
  samples: 6, // Réduit de 16 à 6 (stoppe la surchauffe de la carte graphique)
  resolution: 256, // Réduit de 512 à 256 (divise par 4 le poids de la texture de réfraction)
  transmission: 1,
  roughness: 0.0,
  thickness: 0.3,
  ior: 1.5,
  chromaticAberration: 0.06,
  anisotropy: 0.1,
  distortion: 0.15,
  distortionScale: 0.4,
  temporalDistortion: 0.08,
  clearcoat: 1,
  attenuationDistance: 0.5,
  attenuationColor: "#ffffff",
  color: "#ffffff",
} as const;

const MATERIAL_MOBILE = {
  ...MATERIAL_CONFIG,
  samples: 4, // Réduit de 8 à 4
  resolution: 128, // Réduit de 256 à 128
} as const;

const LIGHTS_CONFIG = {
  ambient: { intensity: 0.3 },
  point1: { position: [10, 10, 10] as const, intensity: 1.5, color: "#ffffff" },
  point2: {
    position: [-10, -5, -10] as const,
    intensity: 0.6,
    color: "#a0c4ff",
  },
  point3: { position: [0, -10, 5] as const, intensity: 0.4, color: "#ffd6a5" },
} as const;

const CANVAS_CONFIG = {
  position: [0, 0, 3] as const,
  fov: 50,
} as const;

// ============================================================================
// Scene Component (accesses R3F context)
// ============================================================================

function Scene({ mouseRef, isMobile }: { mouseRef: React.RefObject<THREE.Vector2>; isMobile: boolean }) {
  const balls = useMemo(() => isMobile ? BALLS_MOBILE : BALLS_DESKTOP, [isMobile]);
  const marchingConfig = isMobile ? MARCHING_CUBES_MOBILE : MARCHING_CUBES_CONFIG;
  const materialConfig = isMobile ? MATERIAL_MOBILE : MATERIAL_CONFIG;

  // Slow global rotation of the entire cluster for organic feel
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
    groupRef.current.rotation.x = Math.cos(t * 0.07) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={LIGHTS_CONFIG.ambient.intensity} />
      <pointLight
        position={LIGHTS_CONFIG.point1.position}
        intensity={LIGHTS_CONFIG.point1.intensity}
        color={LIGHTS_CONFIG.point1.color}
      />
      <pointLight
        position={LIGHTS_CONFIG.point2.position}
        intensity={LIGHTS_CONFIG.point2.intensity}
        color={LIGHTS_CONFIG.point2.color}
      />
      <pointLight
        position={LIGHTS_CONFIG.point3.position}
        intensity={LIGHTS_CONFIG.point3.intensity}
        color={LIGHTS_CONFIG.point3.color}
      />
      <Environment preset="studio" />

      <group ref={groupRef}>
        <MarchingCubes
          resolution={marchingConfig.resolution}
          maxPolyCount={marchingConfig.maxPolyCount}
          enableUvs={marchingConfig.enableUvs}
          enableColors={marchingConfig.enableColors}
        >
          <MeshTransmissionMaterial {...materialConfig} />
          {balls.map((ball, i) => (
            <MovingBall
              key={`ball-${i}`}
              {...ball}
              index={i}
              mouseRef={mouseRef}
            />
          ))}
        </MarchingCubes>
      </group>
    </>
  );
}

// ============================================================================
// MovingBall — smooth orbit + mouse parallax (no physics, just elegance)
// ============================================================================

const MovingBall = memo(
  ({
    speed,
    size,
    strength,
    index,
    anchor,
    orbit,
    parallaxDepth,
    mouseRef,
  }: MovingBallProps) => {
    const cubeRef = useRef<THREE.Group>(null);
    // Smoothed mouse influence
    const smoothMouse = useRef(new THREE.Vector2(0, 0));

    useFrame(({ clock }) => {
      if (!cubeRef.current) return;
      const t = clock.getElapsedTime() * speed;
      const phase = t + index * 1.8; // stagger unique par bulle

      // --- Orbite organique autour de l'ancre ---
      const freqX = 1 + (index % 3) * 0.3;
      const freqY = 0.8 + (index % 2) * 0.4;
      const freqZ = 0.6 + (index % 4) * 0.15;

      const orbitX = Math.sin(phase * freqX) * orbit;
      const orbitY = Math.cos(phase * freqY) * orbit;
      const orbitZ = Math.sin(phase * freqZ) * orbit * 0.5;

      // --- Parallaxe souris ---
      const mx = mouseRef.current ? mouseRef.current.x : 0;
      const my = mouseRef.current ? mouseRef.current.y : 0;
      smoothMouse.current.x = THREE.MathUtils.lerp(
        smoothMouse.current.x,
        mx,
        0.03,
      );
      smoothMouse.current.y = THREE.MathUtils.lerp(
        smoothMouse.current.y,
        my,
        0.03,
      );

      const parallaxX = smoothMouse.current.x * parallaxDepth * 0.08;
      const parallaxY = smoothMouse.current.y * parallaxDepth * 0.08;

      cubeRef.current.position.x = anchor[0] + orbitX + parallaxX;
      cubeRef.current.position.y = anchor[1] + orbitY + parallaxY;
      cubeRef.current.position.z = anchor[2] + orbitZ;

      // Légère pulsation de taille — respiration organique
      const breathe = 1 + Math.sin(t * 2 + index) * 0.03;
      cubeRef.current.scale.setScalar(size * breathe);
    });

    return <MarchingCube ref={cubeRef} strength={strength} subtract={12} />;
  },
);

MovingBall.displayName = "MovingBall";

// ============================================================================
// Export — positioned to embrace the title
// ============================================================================

export default function HeroFluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" } // Garde l'animation active juste un peu avant/après l'écran
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        isMobile
          ? "absolute left-0 right-0 bottom-0 top-[40%] pointer-events-none select-none overflow-hidden"
          : "absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      }
      style={{ zIndex: 0, opacity: 0.9 }}
    >
      <Canvas
        frameloop={isVisible ? "always" : "demand"}
        camera={{ position: CANVAS_CONFIG.position, fov: CANVAS_CONFIG.fov }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        style={{ background: "transparent" }}
        dpr={isMobile ? 1 : [1, 1.5]}
      >
        <Scene mouseRef={mouseRef} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

