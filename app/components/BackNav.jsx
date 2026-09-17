"use client";

// 2026-09-17, George: "δεν θέλω να πατάει home, θέλω πάντα να έχει back
// και όπου υπάρχει το back θα το βάλουμε παντού, να τον πηγαίνει στην
// προηγούμενη σελίδα που ήταν στο σημείο που ήταν".
//
// A quiet Back control, bottom left, on every page but the homepage. It
// steps back through the visitor's own history, and ScrollMemory.jsx puts
// them at the point they left. When there is no history inside the site
// (the visitor arrived straight from Google or a shared link) it takes them
// to the page's natural parent instead, so it never does nothing and never
// leaves the site.
//
// Same visual language as the scroll-to-top control on the right: thin gold
// ring, ivory type, glass behind. It sits above the sticky fleet bar.

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

const STACK_KEY = "gy-nav-stack";

/** Where "Back" goes when the visitor has no history inside the site. */
function parentOf(pathname) {
  if (pathname.startsWith("/yachts/")) return { href: "/charter-yacht-greece", label: "The fleet" };
  if (pathname.startsWith("/blog/")) return { href: "/blog", label: "The Journal" };
  if (pathname.startsWith("/journal/")) return { href: "/blog", label: "The Journal" };
  if (pathname.startsWith("/glossary/")) return { href: "/glossary", label: "Glossary" };
  if (pathname.startsWith("/destinations/")) return { href: "/destinations", label: "Destinations" };
  if (pathname.startsWith("/yacht-charter/")) return { href: "/destinations", label: "Destinations" };
  if (pathname.startsWith("/island/")) return { href: "/destinations", label: "Destinations" };
  if (pathname.startsWith("/market-reports/")) return { href: "/market-reports", label: "Market reports" };
  if (pathname.startsWith("/team/")) return { href: "/team", label: "The team" };
  return { href: "/", label: "Home" };
}

export default function BackNav() {
  const pathname = usePathname();
  const [hasHistory, setHasHistory] = useState(false);

  // The visitor's own trail inside the site for this tab, kept in
  // sessionStorage: a forward navigation adds the page, back or forward
  // (popstate) removes the one just left. "Back" is offered only while the
  // trail has a page before this one, so it never steps out of the site.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPop = () => {
      window.__gyPopped = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let stack = [];
    try {
      stack = JSON.parse(sessionStorage.getItem(STACK_KEY) || "[]");
      if (!Array.isArray(stack)) stack = [];
    } catch {
      stack = [];
    }
    if (window.__gyPopped) {
      // Came here by back or forward: the trail already holds this page
      // one step down, so drop the page just left.
      window.__gyPopped = false;
      if (stack.length > 1 && stack[stack.length - 1] !== pathname) stack.pop();
      if (stack[stack.length - 1] !== pathname) stack.push(pathname);
    } else if (stack[stack.length - 1] !== pathname) {
      stack.push(pathname);
    }
    if (stack.length > 60) stack = stack.slice(-60);
    try {
      sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
    } catch {}
    setHasHistory(stack.length > 1 && window.history.length > 1);
  }, [pathname]);

  const onBack = useCallback(
    (e) => {
      if (!hasHistory) return; // plain link to the parent
      e.preventDefault();
      window.history.back();
    },
    [hasHistory],
  );

  if (!pathname || pathname === "/") return null;
  if (pathname.startsWith("/studio") || pathname.startsWith("/admin") || pathname.startsWith("/cabin")) return null;

  const parent = parentOf(pathname);
  const label = hasHistory ? "Back" : parent.label;

  return (
    <a
      href={parent.href}
      onClick={onBack}
      className="gy-backnav"
      aria-label={hasHistory ? "Back to the previous page" : `Back to ${parent.label}`}
      data-cursor="Back"
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
        <path d="M18 12 H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M11 6 L5 12 L11 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
