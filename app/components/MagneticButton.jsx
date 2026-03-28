"use client";

import { useRef, useCallback } from "react";

export default function MagneticButton({ children, className = "", href, target, rel, onClick, dataCursor, strength = 0.3 }) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 1024) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }, []);

  const Tag = href ? "a" : "button";
  const extraProps = href ? { href, target, rel } : { onClick };

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={dataCursor || ""}
      style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", willChange: "transform" }}
      {...extraProps}
    >
      {children}
    </Tag>
  );
}
