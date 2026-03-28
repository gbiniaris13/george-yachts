"use client";

import { useEffect, useRef } from "react";

export default function GlobalEffects() {
  const progressRef = useRef(null);
  const rippleContainerRef = useRef(null);

  useEffect(() => {
    // ═══════ 1. SCROLL PROGRESS BAR ═══════
    const progressBar = progressRef.current;
    const onScroll = () => {
      if (!progressBar) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ═══════ 2. TOUCH RIPPLE (Mobile + Desktop) ═══════
    const rippleContainer = rippleContainerRef.current;
    const createRipple = (x, y) => {
      if (!rippleContainer) return;
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: 0; height: 0; border-radius: 50%;
        background: radial-gradient(circle, rgba(218,165,32,0.25) 0%, rgba(218,165,32,0.08) 40%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none; z-index: 99990;
        animation: touchRippleAnim 0.7s ease-out forwards;
      `;
      rippleContainer.appendChild(ripple);
      setTimeout(() => ripple.remove(), 750);
    };

    // Touch events (mobile)
    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) createRipple(touch.clientX, touch.clientY);
    };

    // Click events (desktop — only on interactive elements)
    const onClick = (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (target) createRipple(e.clientX, e.clientY);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("click", onClick);

    // ═══════ 3. INTERSECTION OBSERVER — Universal Scroll Reveal ═══════
    const revealElements = document.querySelectorAll(
      "section > div, .fleet-card, .blog-card, .svc-checklist__item, .svc-features__card, .team-card, .faq-category, .about-services__card, .about-credentials__item, .team-values__card"
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.revealed) {
            entry.target.dataset.revealed = "true";
            entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((el) => {
      if (!el.dataset.revealed && !el.classList.contains("fleet-card--visible") && !el.classList.contains("blog-card--visible")) {
        // Don't override elements that already have their own reveal system
        if (el.style.opacity === "" || el.style.opacity === "1") {
          // Skip — already visible or has its own system
        }
      }
    });

    // ═══════ 4. BUTTON PRESS ANIMATION ═══════
    const buttons = document.querySelectorAll("a, button");
    const onPointerDown = (e) => {
      const el = e.currentTarget;
      el.style.transition = "transform 0.15s ease";
      el.style.transform = "scale(0.97)";
    };
    const onPointerUp = (e) => {
      const el = e.currentTarget;
      el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "scale(1)";
    };

    buttons.forEach((btn) => {
      btn.addEventListener("pointerdown", onPointerDown);
      btn.addEventListener("pointerup", onPointerUp);
      btn.addEventListener("pointerleave", onPointerUp);
    });

    // ═══════ 5. TILT EFFECT ON CARDS (Desktop) ═══════
    const cards = document.querySelectorAll(".fleet-card, .blog-card, .about-services__card, .team-card");
    const onCardMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      card.style.transition = "transform 0.1s ease";
    };
    const onCardMouseLeave = (e) => {
      const card = e.currentTarget;
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", onCardMouseMove);
      card.addEventListener("mouseleave", onCardMouseLeave);
    });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("click", onClick);
      buttons.forEach((btn) => {
        btn.removeEventListener("pointerdown", onPointerDown);
        btn.removeEventListener("pointerup", onPointerUp);
        btn.removeEventListener("pointerleave", onPointerUp);
      });
      cards.forEach((card) => {
        card.removeEventListener("mousemove", onCardMouseMove);
        card.removeEventListener("mouseleave", onCardMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          zIndex: 99999,
          background: "linear-gradient(90deg, #E6C77A, #DAA520, #A67C2E)",
          transition: "width 0.1s linear",
          width: "0%",
          pointerEvents: "none",
        }}
        ref={progressRef}
      />

      {/* Ripple Container */}
      <div ref={rippleContainerRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99990 }} />

      {/* Keyframe for ripple */}
      <style jsx global>{`
        @keyframes touchRippleAnim {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 150px; height: 150px; opacity: 0; }
        }
      `}</style>
    </>
  );
}
