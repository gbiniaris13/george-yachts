"use client";

// Phase 27i.17 (2026-05-08) — custom WebGL water shader.
//
// Closes the last big item from the original cinematic brief
// (Session D #11). Renders a procedural water surface using a
// fragment shader with multi-octave fractional Brownian motion
// (fBm) noise — two flow layers drift in opposite directions,
// mix into shimmering highlights, then crossfade to deep navy
// at the bottom and champagne gold along the horizon.
//
// Placement: a thin "horizon" band that sits between the hero
// video and the FleetCTAs split-screen. Reads as the camera
// briefly looking down at the sea before tilting up to the
// fleet — a luxury technique used by Belmond/Aman to mark the
// transition from "brand statement" to "what we offer".
//
// Performance:
//   • R3F canvas at clamped DPR [1, 1.5]
//   • frameloop "always" only while in viewport (Canvas pauses
//     automatically off-screen)
//   • 1x1 plane geometry — fragment shader does ALL the work
//   • Desktop only — coarse pointer / reduced-motion / < 1024 px
//     viewports return null
//   • powerPreference "low-power" — laptops on battery don't spin
//     up the discrete GPU for this

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shader source. Kept inline so the bundler doesn't need a glsl loader.
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  // Classic 2D hash + value noise. Cheap, smooth enough for fBm.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Aspect-correct UV — without this the noise stretches on wide
    // viewports and reads as horizontal stripes.
    vec2 uv = vec2(vUv.x * uAspect, vUv.y);

    // Two flow layers drifting in opposite directions at different
    // speeds. Mixing them creates the shimmering highlight pattern
    // that real water has when sunlight hits it from low angle.
    float t = uTime * 0.06;
    float n1 = fbm(uv * vec2(2.6, 5.0) + vec2(t, t * 0.4));
    float n2 = fbm(uv * vec2(3.4, 7.0) - vec2(t * 0.7, t * 0.3));
    float ripple = mix(n1, n2, 0.5);

    // Sharpen the highlights — power curve concentrates the bright
    // bands so they read as caustic light, not haze.
    float caustic = pow(ripple, 3.5);

    // Vertical falloff: deep navy at the bottom, champagne gold
    // glint near the upper edge (the horizon).
    float yFall = smoothstep(0.0, 1.0, vUv.y);
    vec3 deep   = vec3(0.012, 0.043, 0.094);     // Aegean midnight
    vec3 mid    = vec3(0.060, 0.118, 0.175);     // navy break
    vec3 horiz  = vec3(0.396, 0.298, 0.110);     // champagne shadow
    vec3 base   = mix(deep, mid, smoothstep(0.0, 0.55, vUv.y));
    base        = mix(base, horiz, smoothstep(0.65, 1.0, vUv.y));

    // Caustic light — gold tint at higher y, ivory tint near bottom
    // ripples to read like moonlit water.
    vec3 goldHi = vec3(0.854, 0.647, 0.125);     // #DAA520
    vec3 ivoryHi = vec3(0.961, 0.937, 0.882);    // #F5EFE1
    vec3 highlight = mix(ivoryHi, goldHi, yFall);

    vec3 col = base + highlight * caustic * 0.45;

    // Tiny grain so the shader doesn't read as plastic on big screens.
    float grain = (hash(vUv * 1500.0 + uTime * 3.0) - 0.5) * 0.018;
    col += grain;

    // Soft top + bottom feathers so the shader hands off cleanly
    // into the surrounding black sections.
    float topFade    = smoothstep(0.0, 0.12, vUv.y);
    float bottomFade = 1.0 - smoothstep(0.88, 1.0, vUv.y);
    float alpha = topFade * bottomFade;

    gl_FragColor = vec4(col, alpha);
  }
`;

function WaterPlane() {
  const matRef = useRef(null);
  const aspectRef = useRef(1);

  // Uniforms object, memoised so the same reference flows into the
  // shader material across every render — avoids re-uploading the
  // texture+time block when React rerenders for unrelated reasons.
  const uniforms = useMemo(
    () => ({
      uTime:   { value: 0 },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
    // Track aspect so the noise field doesn't stretch laterally.
    const a = state.size.width / state.size.height;
    if (Math.abs(a - aspectRef.current) > 0.01) {
      aspectRef.current = a;
      matRef.current.uniforms.uAspect.value = a;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function WaterShaderHorizon({ height = 220 }) {
  const [enabled, setEnabled] = useState(false);
  // Phase 27i.19 (2026-05-08) — IntersectionObserver gating. See
  // StarField3D / GoldEmbers3D — same pattern. Especially important
  // here because the fragment shader runs every visible pixel
  // through fBm noise + power curves; pausing it the moment the
  // band scrolls out of view drops sustained GPU usage.
  const [frameloop, setFrameloop] = useState("never");
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        setFrameloop(entries[0]?.isIntersecting ? "always" : "never");
      },
      { rootMargin: "100px" }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [enabled]);

  if (!enabled) {
    // Mobile / reduced-motion fallback: a CSS gradient that hints at
    // the same aesthetic without spinning up WebGL. Same height so
    // layout is identical regardless of capability.
    return (
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height,
          background:
            "linear-gradient(to bottom, #000 0%, #0a1929 35%, #1a2845 65%, #0a1929 100%)",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        width: "100%",
        height,
        background: "#000",
        position: "relative",
      }}
    >
      <Canvas
        frameloop={frameloop}
        performance={{ min: 0.4 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
          preserveDrawingBuffer: false,
        }}
        // Orthographic camera with the plane filling NDC — no
        // perspective distortion, the shader gets clean UVs.
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0, far: 2 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <WaterPlane />
      </Canvas>
    </div>
  );
}
