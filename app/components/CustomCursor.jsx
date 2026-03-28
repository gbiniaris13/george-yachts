"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const mouse = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Desktop only — no touch
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    if ("ontouchstart" in window) return;

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    const styleEl = document.createElement("style");
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleEl);

    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    // Show elements
    dot.style.display = "block";
    glow.style.display = "flex";

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const animate = () => {
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * 0.1;
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * 0.1;
      glow.style.left = `${glowPos.current.x}px`;
      glow.style.top = `${glowPos.current.y}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      const target = e.target.closest("a, button, [data-cursor], input, select, textarea");
      if (target) {
        setIsHovering(true);
        setCursorText(target.getAttribute("data-cursor") || "");
      }
    };

    const onLeave = (e) => {
      const target = e.target.closest("a, button, [data-cursor], input, select, textarea");
      if (target) { setIsHovering(false); setCursorText(""); }
    };

    const onOut = () => setIsVisible(false);
    const onOver = () => setIsVisible(true);

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
      document.documentElement.style.cursor = "";
      styleEl.remove();
    };
  }, []);

  return (
    <>
      {/* Gold dot */}
      <div
        ref={dotRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "10px" : "6px",
          height: isHovering ? "10px" : "6px",
          background: "#DAA520",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.2s ease, box-shadow 0.3s ease",
          opacity: isVisible ? 1 : 0,
          mixBlendMode: "difference",
          boxShadow: isHovering
            ? "0 0 20px rgba(218,165,32,0.6), 0 0 40px rgba(218,165,32,0.2)"
            : "0 0 6px rgba(218,165,32,0.3)",
        }}
      />

      {/* Glow circle */}
      <div
        ref={glowRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "80px" : "42px",
          height: isHovering ? "80px" : "42px",
          border: `1px solid rgba(218, 165, 32, ${isHovering ? 0.5 : 0.18})`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background 0.3s ease, opacity 0.2s ease, box-shadow 0.4s ease",
          opacity: isVisible ? 1 : 0,
          alignItems: "center",
          justifyContent: "center",
          background: isHovering ? "rgba(218, 165, 32, 0.04)" : "transparent",
          boxShadow: isHovering
            ? "0 0 30px rgba(218,165,32,0.08), inset 0 0 20px rgba(218,165,32,0.03)"
            : "none",
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
    </>
  );
}
