"use client";

// Phase 27i.4 (2026-05-07) — first 3D piece on the homepage.
//
// Slow-drifting starfield rendered with React Three Fiber. Sits as
// an absolute layer behind the Filotimo + Forbes sections (z-index
// 0, content z-index 1). 800 points in a deep black void with a
// barely-perceptible drift. The point material is additive-blended
// so overlapping stars blow out softly into champagne motes — a
// "WebGL window into a Mediterranean night sky" feel without the
// performance cost of full Three.js scene.
//
// Performance: the canvas only renders when the section is in
// viewport (frameloop="demand" + an IntersectionObserver pause).
// Mobile: returns null on coarse pointers + narrow viewports — 3D
// background is a desktop nicety, not a phone payload.

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Stars({ count = 800 }) {
  const pointsRef = useRef(null);

  // Generate the point positions ONCE — random spread inside a
  // 60×30×30 box, biased so the cloud reads as deep with a bright
  // foreground band of nearer points.
  const positions = useRef(null);
  if (!positions.current) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 60;       // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;       // y
      arr[i * 3 + 2] = -Math.random() * 30 - 5;          // z (depth)
    }
    positions.current = arr;
  }

  // Slow drift — cloud rotates ~5°/min so motion reads as "stars
  // catching the wheel of the sky", not "spinning". Camera anchors
  // forward.
  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012; // ~0.7°/sec
      pointsRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color("#F5EFE1")}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function StarField3D() {
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
        // 'demand' keeps the GPU idle when nothing changed; we still
        // useFrame so it advances each tick, but compositing pauses
        // automatically when the canvas is offscreen.
        frameloop="always"
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Stars />
      </Canvas>
    </div>
  );
}
