"use client";

import { useRef, useCallback } from "react";

export default function MagneticButton({
  children,
  className = "",
  href,
  target,
  rel,
  onClick,
  dataCursor,
  strength = 0.3,
  style: extraStyle,
}) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 1024) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Compose the magnetic translate with whatever transform the
    // caller already declared on `extraStyle`. Without this the
    // outer style (e.g. an entrance translateY) is lost the moment
    // the cursor enters.
    const callerTransform = extraStyle?.transform ? `${extraStyle.transform} ` : "";
    el.style.transform = `${callerTransform}translate(${x * strength}px, ${y * strength}px)`;
  }, [strength, extraStyle]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = extraStyle?.transform ?? "translate(0, 0)";
  }, [extraStyle]);

  const Tag = href ? "a" : "button";
  const extraProps = href ? { href, target, rel } : { onClick };

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={dataCursor || ""}
      style={{
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
        ...extraStyle,
      }}
      {...extraProps}
    >
      {children}
    </Tag>
  );
}
