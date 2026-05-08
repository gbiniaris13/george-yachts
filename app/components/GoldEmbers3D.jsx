"use client";

// Phase 27i.14 (2026-05-08) — R3F gold-ember particle field.
//
// Sits behind the Filotimo section (alongside the SVG
// ConstellationBackdrop) so the philosophy spread now has the
// true R3F particle layer the original brief called for. Distinct
// register from StarField3D: stars drift sideways like a sky
// turning, embers drift UPWARD like dust catching candlelight in
// an old Athenian taverna. Same constellation/temple register, new
// vector.
//
// 600 points, additive-blended, gold tint with subtle warm flicker
// per-particle. Loop wraps positions back to the bottom when they
// pass the top so the ascent is endless. Desktop-only — coarse
// pointers + reduced-motion + narrow viewports return null.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Embers({ count = 600 }) {
  const pointsRef = useRef(null);

  // One Float32Array of (x, y, z) seeded once. Each particle also
  // gets a random rise speed so the field doesn't move as a slab.
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 50;     // x — wide spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;     // y — start anywhere on the height
      pos[i * 3 + 2] = -Math.random() * 25 - 3;        // z — depth
      spd[i] = 0.18 + Math.random() * 0.45;            // rise speed
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  // Per-frame: nudge each particle's y upward, wrap back to bottom
  // once it crosses +15. Mark the position attribute dirty so R3F
  // re-uploads to the GPU.
  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > 15) {
        arr[i * 3 + 1] = -15;
        arr[i * 3 + 0] = (Math.random() - 0.5) * 50;   // re-randomise x on respawn
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color("#DAA520")}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function GoldEmbers3D() {
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
        frameloop="always"
        performance={{ min: 0.4 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Embers />
      </Canvas>
    </div>
  );
}
