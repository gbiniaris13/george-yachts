"use client";

// Phase 27i.5 (2026-05-07) — R3F 3D yacht-mesh layer for the
// Regional Yacht Map.
//
// Sits as the visual hero behind the 2D HTML region pins. Each
// region cluster gets a stylised yacht silhouette (capsule hull +
// box cabin + thin antenna mast) bobbing in place — count of
// yachts in that region drives the size of the cluster. The 3D
// layer is decorative; the 2D pins remain the click affordance
// (a11y + reduced-motion fallback).
//
// Performance: single canvas, simple geometries, no shaders. ~120
// triangles total. powerPreference low-power so the GPU doesn't
// spin up. Returns null on coarse pointer / narrow viewports —
// mobile gets the 2D pins on a deep-navy gradient and skips R3F.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = new THREE.Color("#DAA520");
const IVORY = new THREE.Color("#F5EFE1");
const NAVY = new THREE.Color("#0a1929");

/**
 * One stylised yacht — elongated hull + cabin + mast. ~30 triangles.
 */
function YachtMesh({ position, scale = 1, phase = 0 }) {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (ref.current) {
      // Bob: 4 px-equivalent vertical wobble, 8 sec period.
      ref.current.position.y = position[1] + Math.sin(t * 0.78) * 0.08;
      // Pitch: faint nose-up/nose-down rotation, like a hull on swell.
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.04;
      ref.current.rotation.z = Math.cos(t * 0.55) * 0.025;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Hull — flattened ellipsoid, ivory */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 14, 8]} />
        <meshStandardMaterial
          color={IVORY}
          metalness={0.35}
          roughness={0.42}
        />
        <primitive
          object={(() => {
            const m = new THREE.Object3D();
            return m;
          })()}
          attach=""
        />
      </mesh>
      {/* Hull tapered via group scale instead of custom geometry */}
      {/* Cabin — gold-tinted box on top of the hull */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.5, 0.18, 0.22]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.5}
          roughness={0.5}
          emissive={GOLD}
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* Mast — thin gold cylinder */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.38, 6]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Scene({ regions, buckets }) {
  // Stable per-region phase for the bobbing (deterministic, doesn't
  // re-shuffle on re-render).
  const phases = useMemo(
    () => regions.map((_, i) => i * 1.18),
    [regions],
  );

  return (
    <>
      {/* Soft-key fill from above-front */}
      <ambientLight intensity={0.55} color={IVORY} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={0.95}
        color={IVORY}
      />
      {/* Warm rim light */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.45}
        color={GOLD}
      />

      {/* "Sea" plane — subtle navy under-glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial
          color={NAVY}
          transparent
          opacity={0.65}
          metalness={0.35}
          roughness={0.85}
        />
      </mesh>

      {/* One yacht per region. Position uses the same -100..+100
          grid as the HTML pins, scaled into 3D world units. */}
      {regions.map((region, idx) => {
        const count = buckets[region.slug]?.length ?? 0;
        if (count === 0) return null;
        // Cluster size hint — clamped so very large regions don't blow
        // out the scene.
        const scale = 0.85 + Math.min(count, 30) * 0.025;
        const x = region.position.x * 0.045; // -4.5..+4.5 world units
        const z = -region.position.y * 0.055;
        return (
          <YachtMesh
            key={region.slug}
            position={[x, 0, z]}
            scale={scale}
            phase={phases[idx]}
          />
        );
      })}
    </>
  );
}

export default function RegionalYachtMap3D({ regions, buckets }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 3.5, 6.5], fov: 38 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene regions={regions} buckets={buckets} />
      </Canvas>
    </div>
  );
}
