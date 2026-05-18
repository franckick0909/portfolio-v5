"use client";
import { Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface CurvedTextProps {
  text: string;
  radius: number;
  height: number;
  fontSize: number;
  color: string;
  rotateSpeed: number;
  font?: string;
  outlineWidth?: number;
  outlineColor?: string;
}

function CurvedText({
  text,
  radius,
  height,
  fontSize,
  color,
  rotateSpeed,
  font,
  outlineWidth,
  outlineColor,
}: CurvedTextProps) {
  const group = useRef<THREE.Group>(null);
  const chars = text.split("");

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * rotateSpeed;
    }
  });

  return (
    <group ref={group} position={[0, height, 0]}>
      {chars.map((char: string, i: number) => {
        const angle = (i / chars.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
            fontSize={fontSize}
            color={color}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0}
            font={font}
            outlineWidth={outlineWidth}
            outlineColor={outlineColor}
          >
            {char}
          </Text>
        );
      })}
    </group>
  );
}

function SpinningDrum({
  progress,
  exitStage,
}: {
  progress: number;
  exitStage: number;
}) {
  const mainGroup = useRef<THREE.Group>(null);
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const exitElapsedRef = useRef(0);
  const { viewport } = useThree();

  // Échelle responsive : si l'écran est plus petit que 4 unités (mobile), on réduit la taille
  const responsiveScale = Math.min(1, viewport.width / 4);

  useFrame((state, delta) => {
    // Mouse follow
    if (mainGroup.current) {
      const targetRotationX = -state.pointer.y * 0.3 + 0.1;
      const targetRotationY = -state.pointer.x * 0.3;
      mainGroup.current.rotation.x = THREE.MathUtils.lerp(
        mainGroup.current.rotation.x,
        targetRotationX,
        0.05,
      );
      mainGroup.current.rotation.y = THREE.MathUtils.lerp(
        mainGroup.current.rotation.y,
        targetRotationY,
        0.05,
      );
    }

    // ---- ENTRÉE : Projection du bas vers le haut avec overshoot ----
    if (exitStage === 0) {
      elapsedRef.current += delta;
      const t = elapsedRef.current;

      if (group1.current) {
        // Anneau 1 : arrive immédiatement, courbe élastique (overshoot puis settle)
        const entranceDuration = 1.8;
        const p1 = Math.min(t / entranceDuration, 1);
        // Courbe "back.out" : dépasse puis revient (overshoot plus doux de ~1.1)
        const eased1 =
          1 + 2.1 * Math.pow(p1 - 1, 3) + 1.1 * Math.pow(p1 - 1, 2);
        const y1 = THREE.MathUtils.lerp(-4, 0, eased1);
        const s1 = THREE.MathUtils.lerp(0, 1, eased1);
        group1.current.position.y = y1;
        group1.current.scale.setScalar(Math.max(0, s1));
      }

      if (group2.current) {
        // Anneau 2 : arrive 0.5s plus tard
        const delay2 = 0.5;
        const t2 = Math.max(0, t - delay2);
        const entranceDuration2 = 1.5;
        const p2 = Math.min(t2 / entranceDuration2, 1);
        const eased2 =
          1 + 2.1 * Math.pow(p2 - 1, 3) + 1.1 * Math.pow(p2 - 1, 2);
        const y2 = THREE.MathUtils.lerp(-4, 0, eased2);
        const s2 = THREE.MathUtils.lerp(0, 1, eased2);
        group2.current.position.y = y2;
        group2.current.scale.setScalar(Math.max(0, s2));
      }
    }

    // ---- SORTIE : Snap rapide vers le bas ----
    if (exitStage > 0) {
      exitElapsedRef.current += delta;
      const te = exitElapsedRef.current;
      const exitDuration = 0.8; // Beaucoup plus rapide que l'entrée
      const pe = Math.min(te / exitDuration, 1);
      // Courbe "power3.in" : accélération progressive
      const easedExit = pe * pe * pe;

      if (group1.current) {
        group1.current.position.y = THREE.MathUtils.lerp(0, -5, easedExit);
        group1.current.scale.setScalar(THREE.MathUtils.lerp(1, 0, easedExit));
      }
      if (group2.current) {
        // Anneau 2 part légèrement avant
        const pe2 = Math.min((te + 0.1) / exitDuration, 1);
        const easedExit2 = pe2 * pe2 * pe2;
        group2.current.position.y = THREE.MathUtils.lerp(0, -5, easedExit2);
        group2.current.scale.setScalar(THREE.MathUtils.lerp(1, 0, easedExit2));
      }
    }
  });

  return (
    <group ref={mainGroup} scale={responsiveScale}>
      <group ref={group1} scale={0} position={[0, -4, 0]}>
        <CurvedText
          text="UN DESIGN QUI CHANGE LE MONDE • "
          radius={1.6}
          height={0.22}
          fontSize={0.40}
          color="#f7f7f7"
          rotateSpeed={0.8}
          font="/fonts/Anton-Regular.ttf"
        />
      </group>

      <group ref={group2} scale={0} position={[0, -4, 0]}>
        <CurvedText
          text="UX/UI • ART DIRECTION • DEV CRÉATIF • "
          radius={1.6}
          height={-0.18}
          fontSize={0.11}
          color="#c9c4c4"
          rotateSpeed={-0.5}
        />
      </group>
    </group>
  );
}

export default function PreloaderCanvas({
  progress,
  exitStage,
}: {
  progress: number;
  exitStage: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#e4e4e7"), 0);
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.5} />
        <SpinningDrum progress={progress} exitStage={exitStage} />
        <fog attach="fog" args={["#e4e4e7", 3, 10]} />
      </Suspense>
    </Canvas>
  );
}
