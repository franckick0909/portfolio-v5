"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const projects = [
  { id: 1, title: "Lumina", category: "E-Commerce", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop" },
  { id: 2, title: "Aether", category: "Portfolio", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1600&auto=format&fit=crop" },
  { id: 3, title: "Nexus", category: "Corporate", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1600&auto=format&fit=crop" },
  { id: 4, title: "Vortex", category: "Web3", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1600&auto=format&fit=crop" },
  { id: 5, title: "Odyssey", category: "Editorial", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1600&auto=format&fit=crop" }
];

function ProjectScreen({ project, index, total }: { project: typeof projects[0], index: number, total: number }) {
  const ref = useRef<THREE.Group>(null);
  const imageRef = useRef<any>(null);

  const radius = 6;
  const angle = (index / total) * Math.PI * 1.5 - (Math.PI * 0.75);
  const x = Math.sin(angle) * radius;
  const z = -Math.cos(angle) * radius + 2;

  useFrame(() => {
    // Placeholder for future per-card effects
  });

  return (
    <group ref={ref} position={[x, 0, z]} rotation={[0, -angle, 0]}>
      <Image
        ref={imageRef}
        url={project.img}
        transparent
        opacity={1}
        scale={[3, 4.5]}
        position={[0, 0, 0]}
      />
      <Text
        position={[0, -2.6, 0.1]}
        fontSize={0.2}
        color="#ffffff"
        font="/oswald.woff"
        anchorX="center"
        anchorY="top"
        letterSpacing={0.1}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        position={[0, -2.9, 0.1]}
        fontSize={0.1}
        color="#a1a1aa"
        anchorX="center"
        anchorY="top"
        letterSpacing={0.2}
      >
        {"/ " + project.category.toUpperCase()}
      </Text>
    </group>
  );
}

function GalleryScene() {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const [targetRotation, setTargetRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const previousMouseX = useRef(0);

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    previousMouseX.current = e.clientX;
  };

  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX.current;
    setTargetRotation((prev) => prev - deltaX * 0.005);
    previousMouseX.current = e.clientX;
  };

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = gsap.utils.interpolate(
        group.current.rotation.y,
        targetRotation,
        delta * 5,
      );
      group.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <fog attach="fog" args={["#000000", 5, 15]} />

      <mesh
        position={[0, 0, 5]}
        visible={false}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      </mesh>

      <group ref={group}>
        {projects.map((proj, i) => (
          <ProjectScreen
            key={proj.id}
            project={proj}
            index={i}
            total={projects.length}
          />
        ))}
      </group>
    </>
  );
}

export default function ProjectsCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "default",
      }}
    >
      <React.Suspense fallback={null}>
        <GalleryScene />
      </React.Suspense>
    </Canvas>
  );
}
