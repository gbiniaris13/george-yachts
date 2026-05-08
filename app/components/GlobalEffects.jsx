"use client";

import { useEffect, useRef } from "react";

export default function GlobalEffects() {
  const rippleContainerRef = useRef(null);

  useEffect(() => {
    // 2026-05-08 (Phase 27i.19) — perf audit: the original
    // GlobalEffects scroll-progress bar duplicated the newer
    // ScrollProgress component (mounted next to GlobalEffects in
    // app/layout.jsx). Both DOM nodes rendered, both fired on
    // every scroll event — and the older one had no rAF throttle,
    // which on fast trackpads was triggering layout reads + style
    // writes 1000×/sec. Removed the duplicate; ScrollProgress
    // (Phase 27i.2) already does the job with rAF throttling and
    // the brand gold gradient.

    // ═══════ TOUCH RIPPLE (Mobile + Desktop) ═══════
    const rippleContainer = rippleContainerRef.current;
    const createRipple = (x, y) => {
      if (!rippleContainer) return;
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: 0; height: 0; border-radius: 50%;
        background: radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.08) 40%, transparent 70%);
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

    // ═══════ 3b. Phase 14 (luxury rebuild) — explicit [data-gy-reveal]
    //          opt-in observer. Components mark themselves with the
    //          data attribute and we cross-fade them in when they
    //          enter the viewport. Cross-browser (works on Safari +
    //          Firefox), fallback for animation-timeline-only CSS. ═══════
    // Phase 27 (mobile audit, 2026-05-05) — George reported blank
    // panels mid-page on iPhone ("σκορά​ρω και βλέπω σε πολλά πλαίσια
    // βλέπω μόνο"). Root cause: threshold:0.12 + rootMargin:-10% was
    // too strict — on mobile, mid-page sections with tall dynamic
    // children sometimes never crossed the 12% visibility floor at
    // scroll speed, leaving them stuck at opacity:0. Loosened the
    // trigger AND added a hard 1.6s safety net that force-reveals
    // anything still hidden so a slow chunk or tall section can
    // never make a panel disappear before Forbes traffic.
    const revealAll = () => {
      document
        .querySelectorAll("[data-gy-reveal]:not(.gy-revealed)")
        .forEach((el) => el.classList.add("gy-revealed"));
    };

    const gyRevealEls = document.querySelectorAll("[data-gy-reveal]:not(.gy-revealed)");
    if (gyRevealEls.length > 0) {
      const gyRevealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("gy-revealed");
              gyRevealObs.unobserve(entry.target);
            }
          });
        },
        // Trigger as soon as the element pre-enters the viewport so
        // mobile scroll doesn't outrun the threshold.
        { threshold: 0.01, rootMargin: "0px 0px 200px 0px" }
      );
      gyRevealEls.forEach((el) => gyRevealObs.observe(el));
    }

    // Hard safety net — if anything is still hidden 1.6s after mount
    // (chunk load delay, observer race, anything), force-reveal so the
    // visitor never sees an empty pane.
    const safetyNet = setTimeout(revealAll, 1600);
    // Also re-run reveal sweep on first scroll, in case dynamic
    // components mounted AFTER the initial observer query (the
    // observer query is once-per-mount; new wrappers added by
    // late-hydrating dynamic imports wouldn't be caught otherwise).
    const onFirstScroll = () => { revealAll(); window.removeEventListener("scroll", onFirstScroll); };
    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });

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

    // ═══════ TILT EFFECT ON CARDS (Desktop) ═══════
    // 2026-05-08 perf: rAF-throttle the mousemove. Without throttling
    // a fast trackpad fires hundreds of events per second, each one
    // doing a getBoundingClientRect (forced layout) + style write.
    // Now we coalesce to one update per frame and bail early on
    // touch viewports.
    const cards = document.querySelectorAll(".fleet-card, .blog-card, .about-services__card, .team-card");
    let cardRaf = 0;
    let cardPending = null;
    const onCardMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      cardPending = { card: e.currentTarget, x: e.clientX, y: e.clientY };
      if (cardRaf) return;
      cardRaf = requestAnimationFrame(() => {
        cardRaf = 0;
        const p = cardPending;
        if (!p) return;
        const rect = p.card.getBoundingClientRect();
        const x = (p.x - rect.left) / rect.width - 0.5;
        const y = (p.y - rect.top) / rect.height - 0.5;
        p.card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        p.card.style.transition = "transform 0.1s ease";
      });
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
      window.removeEventListener("scroll", onFirstScroll);
      clearTimeout(safetyNet);
      if (cardRaf) cancelAnimationFrame(cardRaf);
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
      {/* 2026-05-08 — duplicate scroll progress bar removed. The
          newer <ScrollProgress /> handles this with rAF throttling
          and the proper brand gold gradient. */}

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
