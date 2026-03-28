"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Only on desktop
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if ("ontouchstart" in window) return;

    const dot = dotRef.current;
    const circle = circleRef.current;
    if (!dot || !circle) return;

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const animate = () => {
      circlePos.current.x += (mouse.current.x - circlePos.current.x) * 0.12;
      circlePos.current.y += (mouse.current.y - circlePos.current.y) * 0.12;
      circle.style.left = `${circlePos.current.x}px`;
      circle.style.top = `${circlePos.current.y}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const onMouseEnter = (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (target) {
        setIsHovering(true);
        const label = target.getAttribute("data-cursor") || "";
        setCursorText(label);
      }
    };

    const onMouseLeave = (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (target) {
        setIsHovering(false);
        setCursorText("");
      }
    };

    const onMouseOut = () => setIsHidden(true);
    const onMouseOver = () => setIsHidden(false);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseEnter, true);
    document.addEventListener("mouseout", onMouseLeave, true);
    document.documentElement.addEventListener("mouseleave", onMouseOut);
    document.documentElement.addEventListener("mouseenter", onMouseOver);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseEnter, true);
      document.removeEventListener("mouseout", onMouseLeave, true);
      document.documentElement.removeEventListener("mouseleave", onMouseOut);
      document.documentElement.removeEventListener("mouseenter", onMouseOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Don't render on mobile/touch
  if (typeof window !== "undefined" && (window.innerWidth < 1024 || "ontouchstart" in window)) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="custom-cursor__dot"
        style={{ opacity: isHidden ? 0 : 1 }}
      />
      {/* Circle */}
      <div
        ref={circleRef}
        className={`custom-cursor__circle ${isHovering ? "custom-cursor__circle--hover" : ""}`}
        style={{ opacity: isHidden ? 0 : 1 }}
      >
        {cursorText && <span className="custom-cursor__text">{cursorText}</span>}
      </div>

      <style jsx global>{`
        @media (min-width: 1024px) and (hover: hover) {
          * { cursor: none !important; }
        }

        .custom-cursor__dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background: #DAA520;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
          mix-blend-mode: difference;
        }

        .custom-cursor__circle {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(218, 165, 32, 0.35);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          transform: translate(-50%, -50%);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      background 0.3s ease,
                      opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-cursor__circle--hover {
          width: 80px;
          height: 80px;
          border-color: rgba(218, 165, 32, 0.6);
          background: rgba(218, 165, 32, 0.06);
        }

        .custom-cursor__text {
          font-family: 'Montserrat', sans-serif;
          font-size: 7px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #DAA520;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .custom-cursor__circle--hover .custom-cursor__text {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
