"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Lazy-load Three.js — NOT in initial bundle
let Canvas, useFrame, useThree, Float, Environment;
const threeReady =
  typeof window !== "undefined"
    ? Promise.all([
        import("@react-three/fiber"),
        import("@react-three/drei"),
      ]).then(([fiber, drei]) => {
        Canvas = fiber.Canvas;
        useFrame = fiber.useFrame;
        useThree = fiber.useThree;
        Float = drei.Float;
        Environment = drei.Environment;
        return true;
      })
    : Promise.resolve(false);

// ─── Gold particle system ───────────────────────────────────────────────────
function Particles({ count = 350 }) {
  const mesh = useRef(null);

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      speeds[i] = 0.004 + Math.random() * 0.012;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += data.speeds[i];
      if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10;
      pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.0008;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C9A84C"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Rotating gold ring ─────────────────────────────────────────────────────
function GoldRing() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.2;
      ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={ref}>
        <torusGeometry args={[2.5, 0.035, 16, 100]} />
        <meshPhysicalMaterial
          color="#C9A84C"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

// ─── Mouse-reactive cinematic camera ────────────────────────────────────────
function CinematicCamera() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.12;
    state.camera.position.x = Math.sin(t) * 6 + mouseX.current * 0.4;
    state.camera.position.y = 1.5 + mouseY.current * 0.25;
    state.camera.position.z = Math.cos(t) * 6;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Three.js scene wrapper ─────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <fog attach="fog" args={["#0D1B2A", 8, 25]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 8, 3]} intensity={0.5} color="#C9A84C" />
      <pointLight position={[-3, 2, -5]} intensity={0.25} color="#4a6fa5" />
      <Particles count={350} />
      <GoldRing />
      <CinematicCamera />
      <Environment preset="night" />
    </>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function CinematicExperience() {
  const sectionRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect mobile + reduced motion
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Intersection Observer — only load 3D when approaching viewport
  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            threeReady.then((ok) => {
              if (ok) {
                setThreeLoaded(true);
                setShouldLoad(true);
              }
            });
            observer.disconnect();
          }
        });
      },
      { rootMargin: "300px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reducedMotion, isMobile]);

  // Scroll-linked text animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const textOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.6, 0.8],
    [0, 1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0.15, 0.35], [50, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0D1B2A]"
      style={{ height: "100vh" }}
      aria-label="The Experience"
    >
      {/* Fallback background — always visible, fades when 3D loads */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-[2000ms]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #1a2d4a 0%, #0D1B2A 60%, #060e18 100%)",
          opacity: shouldLoad ? 0.3 : 1,
        }}
      />

      {/* Three.js canvas — lazy-loaded */}
      {shouldLoad && threeLoaded && Canvas && (
        <div
          className="absolute inset-0 z-0"
          style={{
            opacity: 1,
            animation: "fadeIn 2s ease-out",
          }}
        >
          <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
            <Scene />
          </Canvas>
        </div>
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0D1B2A]/30 via-transparent to-[#0D1B2A]/60 pointer-events-none" />

      {/* Section label */}
      <div className="absolute top-10 left-8 md:top-12 md:left-12 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-[#C9A84C]" />
          <span
            className="text-[#C9A84C] uppercase font-light"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
            }}
          >
            The Experience
          </span>
        </div>
      </div>

      {/* Tagline — scroll-animated */}
      <motion.div
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none"
        style={{ paddingBottom: "22vh", opacity: textOpacity, y: textY }}
      >
        <h2
          className="text-center font-light text-[#F8F5F0] px-8"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)",
            letterSpacing: "0.05em",
            lineHeight: "1.2",
            maxWidth: "900px",
          }}
        >
          Seven days. One yacht.{" "}
          <span className="text-[#C9A84C]">Every island.</span>
        </h2>
      </motion.div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
