"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const trailRefs = useRef([]);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const mouse = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024 || "ontouchstart" in window) return;
    setIsDesktop(true);

    const TRAIL_COUNT = 6;
    trailPositions.current = Array(TRAIL_COUNT).fill({ x: -100, y: -100 });

    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const animate = () => {
      // Glow circle — smooth follow
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * 0.1;
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * 0.1;
      glow.style.left = `${glowPos.current.x}px`;
      glow.style.top = `${glowPos.current.y}px`;

      // Trail particles — each follows the one before it
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const target = i === 0 ? mouse.current : trailPositions.current[i - 1];
        const lerp = 0.15 - (i * 0.018);
        trailPositions.current[i] = {
          x: trailPositions.current[i].x + (target.x - trailPositions.current[i].x) * lerp,
          y: trailPositions.current[i].y + (target.y - trailPositions.current[i].y) * lerp,
        };
        const el = trailRefs.current[i];
        if (el) {
          el.style.left = `${trailPositions.current[i].x}px`;
          el.style.top = `${trailPositions.current[i].y}px`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (target) {
        setIsHovering(true);
        setCursorText(target.getAttribute("data-cursor") || "");
      }
    };

    const onLeave = (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (target) { setIsHovering(false); setCursorText(""); }
    };

    const onOut = () => setIsHidden(true);
    const onOver = () => setIsHidden(false);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onEnter, true);
    document.addEventListener("mouseout", onLeave, true);
    document.documentElement.addEventListener("mouseleave", onOut);
    document.documentElement.addEventListener("mouseenter", onOver);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onEnter, true);
      document.removeEventListener("mouseout", onLeave, true);
      document.documentElement.removeEventListener("mouseleave", onOut);
      document.documentElement.removeEventListener("mouseenter", onOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!isDesktop) return null;

  const TRAIL_COUNT = 6;

  return (
    <>
      {/* Trail particles */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: `${3 - i * 0.3}px`,
            height: `${3 - i * 0.3}px`,
            background: "#DAA520",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 99996,
            transform: "translate(-50%, -50%)",
            opacity: isHidden ? 0 : (0.4 - i * 0.06),
            transition: "opacity 0.3s ease",
          }}
        />
      ))}

      {/* Main dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "8px" : "5px",
          height: isHovering ? "8px" : "5px",
          background: "#DAA520",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease",
          opacity: isHidden ? 0 : 1,
          mixBlendMode: "difference",
          boxShadow: isHovering ? "0 0 12px rgba(218,165,32,0.6)" : "0 0 4px rgba(218,165,32,0.3)",
        }}
      />

      {/* Glow circle */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "90px" : "44px",
          height: isHovering ? "90px" : "44px",
          border: `1px solid rgba(218, 165, 32, ${isHovering ? 0.5 : 0.2})`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background 0.3s ease, opacity 0.3s ease, box-shadow 0.4s ease",
          opacity: isHidden ? 0 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isHovering ? "rgba(218, 165, 32, 0.04)" : "transparent",
          boxShadow: isHovering ? "0 0 30px rgba(218,165,32,0.08), inset 0 0 20px rgba(218,165,32,0.03)" : "none",
          backdropFilter: isHovering ? "blur(2px)" : "none",
        }}
      >
        {cursorText && (
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "7px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#DAA520",
              whiteSpace: "nowrap",
              opacity: isHovering ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {cursorText}
          </span>
        )}
      </div>

      <style jsx global>{`
        @media (min-width: 1024px) and (hover: hover) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
