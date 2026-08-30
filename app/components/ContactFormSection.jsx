"use client";

import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ConstellationBackdrop from "./ConstellationBackdrop";

const RECAPTCHA_PUBLIC_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/* ─── SVG Icons (inline, no dependencies) ─── */
const Icons = {
  anchor: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  mapPin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  shield: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
};

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ─── Field Component ─── */
function Field({ icon, delay, children }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DAA110] transition-colors duration-500">
        {icon}
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
const DRAFT_KEY = "gy_brief_draft";

// 2026-08-23, George's directive: budget is tappable bands, all-in
// terms (his correction: all-in, not net), derived from the LIVE
// SITE fleet only, 65 published yachts, retired and drafts excluded
// (George's second correction: the Sanity raw pull had €3,300 boats
// the site never shows). Real spread: S/CAT Alegria from €10,900 net
// up to M/Y LA PELLEGRINA 1 at €235,000 net; all-in is roughly 1.5
// to 1.65x base. One tap filters the search; a custom field stays
// for those who prefer their own number.
const BUDGET_OPTIONS = [
  "Up to €25,000",
  "€25,000 - €50,000",
  "€50,000 - €80,000",
  "€80,000 - €150,000",
  "€150,000+",
  "Flexible - Advise Me",
];

// Dual-mode dates (George, 23/8): exact pickers for the guests who
// already hold flights to Greece, tappable periods for everyone
// still dreaming in seasons.
const TIMING_EXACT = "Exact dates";
const TIMING_OPTIONS = [
  "September 2026",
  "October 2026",
  "May 2027",
  "Early June 2027",
  "Late June 2027",
  "July 2027",
  "August 2027",
  "Early September 2027",
  "Late September 2027",
  "October 2027",
  "Flexible - Advise Me",
];

// 2026-08-23, George's #2: the brief arrives knowing what the
// visitor already looked at. The tracker keeps yacht history and
// session timing in the browser; the form reads them and sends
// them along, so George replies like he already knows the guest.
function collectVisitorContext() {
  try {
    const ctx = {};
    const session = JSON.parse(sessionStorage.getItem("gy-tracker-session") || "null");
    if (session) {
      if (session.startTime) {
        ctx.session_minutes = Math.max(0, Math.round((Date.now() - session.startTime) / 60000));
      }
      if (Array.isArray(session.yachtsViewed) && session.yachtsViewed.length) {
        ctx.yachts_this_visit = session.yachtsViewed.slice(0, 8);
      }
      if (session.referrer) ctx.arrived_from = String(session.referrer).slice(0, 200);
    }
    const history = JSON.parse(localStorage.getItem("gy-view-history") || "[]");
    if (Array.isArray(history) && history.length) {
      ctx.yachts_history = history.slice(0, 5).map((h) => h && h.name).filter(Boolean);
    }
    return ctx;
  } catch {
    return {};
  }
}

const ContactFormSection = () => {
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1);
  const [budgetChoice, setBudgetChoice] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [timingChoice, setTimingChoice] = useState("");
  const [suggested, setSuggested] = useState([]);
  const formRef = React.useRef(null);
  const submittedRef = React.useRef(false);
  const lastFieldRef = React.useRef("");
  const geoFilledRef = React.useRef(false);
  const submitAttemptsRef = React.useRef(0);
  const lastSubmitErrorRef = React.useRef("");

  const budgetValue = showCustomBudget
    ? (customBudget ? `Custom: ${customBudget}` : "")
    : budgetChoice;

  // 2026-08-23 completion pass, part 1: nothing typed is ever lost.
  // Every keystroke mirrors into localStorage; a visitor who leaves
  // and comes back finds the brief exactly as they left it.
  const saveDraft = () => {
    try {
      const form = formRef.current;
      if (!form || submittedRef.current) return;
      const obj = Object.fromEntries(new FormData(form));
      delete obj.website;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(obj));
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      const form = formRef.current;
      if (saved && form) {
        for (const [key, value] of Object.entries(saved)) {
          // budget is a React-controlled hidden input; restored via state below
          if (key === "website" || key === "budget" || !value) continue;
          const el = form.elements[key];
          if (el && !el.value) el.value = value;
        }
        if (saved.budget) {
          if (saved.budget.startsWith("Custom: ")) {
            setShowCustomBudget(true);
            setCustomBudget(saved.budget.slice("Custom: ".length));
          } else if (BUDGET_OPTIONS.includes(saved.budget)) {
            setBudgetChoice(saved.budget);
          }
        }
        if (saved.check_in) {
          setTimingChoice(TIMING_EXACT);
        } else if (saved.timing && saved.timing !== TIMING_EXACT) {
          setTimingChoice(saved.timing);
        }
      }
    } catch {}
  }, []);

  // Chip clicks bypass native form events, so mirror them into the
  // draft after each render they change.
  useEffect(() => {
    saveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetChoice, customBudget, showCustomBudget, timingChoice]);

  // 2026-08-23, George's #4: the country fills itself from the
  // existing /api/geo passthrough (the VisitorGreeting endpoint,
  // untouched: it returns the ISO code and the browser turns it
  // into a name). Editable, and never overwrites something the
  // visitor (or their restored draft) already typed.
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const el = formRef.current?.elements?.country;
        if (!el || el.value) return;
        const res = await fetch("/api/geo", { cache: "no-store" });
        if (!res.ok) return;
        const { country } = await res.json();
        if (!country || country === "XX") return;
        let name = "";
        try {
          name = new Intl.DisplayNames(["en"], { type: "region" }).of(country) || "";
        } catch {}
        if (name && el && !el.value) {
          el.value = name;
          // Mark it as ours, not theirs. The abandonment metric counts a
          // visitor as having started only when a field they typed holds
          // something, and this one fills itself on arrival.
          geoFilledRef.current = true;
          saveDraft();
        }
      } catch {}
    }, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2026-08-27, David forensics: while the submit block is on screen,
  // the dock FABs step aside (see globals.css gy-submit-inview) so no
  // pixel of the submit button ever sits under a floating control.
  const submitBlockRef = React.useRef(null);
  useEffect(() => {
    const el = submitBlockRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const obs = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle("gy-submit-inview", entry.isIntersecting);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => {
      obs.disconnect();
      document.body.classList.remove("gy-submit-inview");
    };
  }, []);

  // 2026-08-23 completion pass, part 2: the rescue net. If the tab
  // closes or goes to the background while the form holds a reachable
  // email or phone and was never sent, beacon what exists to
  // /api/contact/partial. Once per session; the server dedupes for
  // 24h per identity on top of that.
  useEffect(() => {
    const rescue = () => {
      try {
        if (submittedRef.current) return;
        const form = formRef.current;
        if (!form) return;
        const data = Object.fromEntries(new FormData(form));
        if (data.website) return;
        // Field-level abandonment measurement (George, 23/8): which
        // field were they on when they left. Once per session, only
        // when something was actually typed, so in a few weeks the
        // killer field is data, not a guess.
        if (!sessionStorage.getItem("gy_abandon_tracked")) {
          // 2026-08-26 correction: the country field fills itself from the
          // edge geo header the moment the page loads, so counting it made
          // every visitor look like an abandoner. GA4 recorded 10 abandons
          // against 1 form_start on 24/8, which measures nothing. A field
          // the visitor did not type is not a started form.
          const filled = Object.entries(data).filter(
            ([k, v]) =>
              v &&
              k !== "website" &&
              k !== "recaptchaToken" &&
              !(k === "country" && geoFilledRef.current)
          ).length;
          if (filled > 0 && typeof window.gtag === "function") {
            window.gtag("event", "form_abandoned", {
              last_field: lastFieldRef.current || "none",
              fields_filled: filled,
              page_path: window.location.pathname,
            });
            sessionStorage.setItem("gy_abandon_tracked", "1");
          }
        }
        if (sessionStorage.getItem("gy_partial_sent")) return;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || "");
        const phoneOk = (data.phone || "").replace(/\D/g, "").length >= 7;
        if (!emailOk && !phoneOk) return;
        delete data.recaptchaToken;
        data.visitor_context = collectVisitorContext();
        // The forensic line that was missing on 27/8: did they try?
        if (submitAttemptsRef.current > 0) {
          data.submit_attempts = submitAttemptsRef.current;
          data.last_submit_error = lastSubmitErrorRef.current || "unknown";
        }
        // text/plain keeps sendBeacon happy in every browser; the
        // endpoint parses the body as JSON regardless of the header.
        const blob = new Blob([JSON.stringify(data)], { type: "text/plain;charset=UTF-8" });
        if (navigator.sendBeacon && navigator.sendBeacon("/api/contact/partial", blob)) {
          sessionStorage.setItem("gy_partial_sent", "1");
        }
      } catch {}
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") rescue();
    };
    window.addEventListener("pagehide", rescue);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", rescue);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // 2026-07-03 SOS FIX — the silent-death bug George hit on mobile.
  // The form is 3 steps; steps hide via display:none. The Continue
  // buttons did NO validation, so a visitor reached step 3 with empty
  // required fields behind them. On submit the browser tries to focus
  // the first invalid field, finds it display:none, and REFUSES the
  // submission completely silently: no request, no message, nothing.
  // (Reproduced locally: zero POST to /api/contact on submit click.)
  // Fix: validate per step on Continue, and on submit jump BACK to
  // the first step containing an invalid field and show the browser's
  // own validation message on it.
  const validateStep = (n) => {
    const root = formRef.current?.querySelector(`[data-step="${n}"]`);
    if (!root) return true;
    const fields = root.querySelectorAll("input, select, textarea");
    for (const el of fields) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  };

  const goToStep = (n, from) => {
    if (n > from && !validateStep(from)) return;
    setStep(n);
  };

  const handleVercelSubmit = async (e) => {
    e.preventDefault();

    // 2026-08-28. Two briefs in two nights reached George through the
    // rescue net with every field filled and no submission behind them,
    // and neither had touched the server. We could not tell whether
    // those visitors had pressed this button and been swallowed, or
    // never pressed it at all, because GA4 and Clarity are both consent
    // gated and neither had accepted. So the attempt is now counted here
    // and travels out on the rescue beacon, which is not consent gated.
    // Next time the answer is in George's inbox, not in a guess.
    submitAttemptsRef.current += 1;
    lastSubmitErrorRef.current = "";
    if (typeof window.gtag === "function") {
      window.gtag("event", "form_submit_attempt", { attempt: submitAttemptsRef.current });
    }

    // Walk the steps; the first invalid field pulls the visitor back
    // to its step with the native validation bubble visible.
    for (const n of [1, 2, 3]) {
      const root = formRef.current?.querySelector(`[data-step="${n}"]`);
      if (!root) continue;
      const bad = [...root.querySelectorAll("input, select, textarea")].find((el) => !el.checkValidity());
      if (bad) {
        setStep(n);
        setStatus("Please complete the highlighted field.");
        lastSubmitErrorRef.current = `invalid:${bad.name || bad.id || "unknown"}`;
        setTimeout(() => bad.reportValidity(), 60);
        return;
      }
    }

    setStatus("Submitting...");

    // reCAPTCHA, on a leash.
    //
    // 2026-08-28: this await had no timeout, and that is the one thing
    // between pressing the button and the request leaving the browser.
    // Google's enterprise.js is loaded on demand, on the visitor's first
    // keystroke, from a domain that privacy browsers, corporate networks
    // and ad blockers all interfere with. If grecaptcha exists but is not
    // ready, or the network stalls, execute() can return a promise that
    // never settles. The button then sits on "Submitting..." forever, the
    // visitor waits, decides the site is broken and leaves, and no request
    // ever reaches us. That is exactly the shape of the two lost briefs.
    //
    // Four seconds, then we go without it. The token is a nice-to-have and
    // a lead is not: the house rule is that forms never lose leads.
    let recaptchaToken = "no_recaptcha";

    try {
      if (RECAPTCHA_PUBLIC_KEY && typeof grecaptcha !== "undefined") {
        const runner =
          grecaptcha.enterprise?.execute
            ? grecaptcha.enterprise.execute(RECAPTCHA_PUBLIC_KEY, { action: "contact_form_submit" })
            : grecaptcha.execute
              ? grecaptcha.execute(RECAPTCHA_PUBLIC_KEY, { action: "contact_form_submit" })
              : null;
        if (runner) {
          const token = await Promise.race([
            runner,
            new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
          ]);
          if (token) recaptchaToken = token;
          else lastSubmitErrorRef.current = "recaptcha_timeout";
        }
      }
    } catch (error) {
      lastSubmitErrorRef.current = "recaptcha_error";
      console.error("reCAPTCHA execution failed, sending without it:", error);
    }

    const formData = new FormData(formRef.current);
    const payload = { ...Object.fromEntries(formData), recaptchaToken, visitor_context: collectVisitorContext() };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        submittedRef.current = true;
        try {
          localStorage.removeItem(DRAFT_KEY);
          sessionStorage.setItem("gy_partial_sent", "1");
        } catch {}
        // George's #3: keep them aboard. Fetch two or three live
        // yachts matching the brief for the thank-you screen.
        try {
          const params = new URLSearchParams();
          if (payload.budget) params.set("budget", payload.budget);
          if (payload.yacht_type) params.set("type", payload.yacht_type);
          fetch(`/api/fleet/suggest?${params.toString()}`)
            .then((r) => (r.ok ? r.json() : { yachts: [] }))
            .then((d) => setSuggested(Array.isArray(d.yachts) ? d.yachts : []))
            .catch(() => {});
        } catch {}
        setStatus("success");
        formRef.current.reset();
        setStep(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        lastSubmitErrorRef.current = `http_${response.status}`;
        // Never a dead end. Whatever the server said, the visitor is
        // given a road that does not depend on this form working.
        setStatus(
          `We could not send that from here. Please write to george@georgeyachts.com or use the WhatsApp link below, and your brief reaches George either way.${errorData.message ? "" : ""}`
        );
      }
    } catch (error) {
      lastSubmitErrorRef.current = "network_error";
      setStatus("We could not reach the server. Please write to george@georgeyachts.com or use the WhatsApp link below, and your brief reaches George either way.");
    }
  };

  const handleTimingChange = (e) => {
    const value = e.target.value;
    setTimingChoice(value);
    // A chosen period and typed dates must never contradict each other
    if (value !== TIMING_EXACT && formRef.current) {
      if (formRef.current.elements.check_in) formRef.current.elements.check_in.value = "";
      if (formRef.current.elements.check_out) formRef.current.elements.check_out.value = "";
    }
  };

  // 2026-08-23, the WhatsApp bridge: most real requests already
  // arrive on the company WhatsApp, so the form offers that road
  // too, carrying whatever the visitor has typed so far.
  const openWhatsAppBridge = () => {
    try {
      const data = Object.fromEntries(new FormData(formRef.current));
      const lines = [
        "Hello George, I would like to charter a yacht in Greece.",
        data.name ? `Name: ${data.name}` : null,
        data.yacht_type ? `Yacht type: ${data.yacht_type}` : null,
        data.guests ? `Guests: ${data.guests}` : null,
        data.budget ? `Budget (all-in): ${data.budget}` : null,
        data.check_in
          ? `Dates: ${data.check_in} to ${data.check_out || "open"}`
          : (data.timing && data.timing !== TIMING_EXACT ? `When: ${data.timing}` : null),
        data.message || null,
      ].filter(Boolean);
      if (typeof window.gtag === "function") {
        window.gtag("event", "whatsapp_button_clicked", { source: "contact_form_bridge" });
      }
      const url = `https://api.whatsapp.com/send/?phone=17867988798&text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {}
  };

  // A.13 contrast pass: placeholder bumped /30 → /60 so the form is
  // readable for 50+ visitors on dark BG. Border bumped /15 → /25 to
  // make the input affordance visible without focus.
  const inputBase =
    "w-full bg-transparent text-white border-b border-white/25 px-0 py-4 text-base focus:outline-none focus:border-[#DAA110] transition-all duration-500 placeholder:text-white/60 placeholder:font-light placeholder:text-sm rounded-none";

  const selectBase =
    "w-full bg-transparent text-white border-b border-white/25 px-0 py-4 text-base focus:outline-none focus:border-[#DAA110] transition-all duration-500 rounded-none appearance-none cursor-pointer";

  // Success state
  if (status === "success") {
    return (
      <section id="contact" className="relative w-full min-h-screen bg-black flex items-center justify-center py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A] to-[#0D1B2A] z-0" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/noise.svg')] mix-blend-overlay z-10" />

        <div className="relative z-30 text-center px-6 max-w-2xl mx-auto">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full border border-[#DAA110]/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DAA110" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3
            className="text-4xl md:text-5xl mb-6"
            style={{
              fontFamily: "var(--gy-font-editorial)",
              backgroundImage: "linear-gradient(90deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              color: "transparent", WebkitTextFillColor: "transparent",
            }}
          >
            Thank You
          </h3>
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/images/george-syros-quay.jpg"
              alt="George P. Biniaris"
              className="w-16 h-16 rounded-full object-cover border border-[#DAA110]/30"
            />
            <div className="text-left">
              <p className="text-white text-sm font-medium">George P. Biniaris</p>
              <p className="text-[#DAA110]/60 text-xs tracking-wider uppercase">Founder and Managing Broker</p>
            </div>
          </div>
          <p className="text-white/60 text-lg font-light leading-relaxed mb-4">
            George will personally review your inquiry. First reply usually within two hours.
          </p>
          <p className="text-white/30 text-sm tracking-wider uppercase">
            George Yachts Brokerage House
          </p>

          {/* George's #3 (23/8): the brief is in, so the screen shows
              live yachts from the shelf they just described. Real
              rates from the fleet, nothing invented. */}
          {suggested.length > 0 && (
            <div className="mt-14 text-left">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#DAA110]/70 text-center mb-6">
                While George prepares your proposal
              </p>
              <div className="space-y-4">
                {suggested.map((y) => (
                  <a
                    key={y.slug}
                    href={`/yachts/${y.slug}`}
                    className="group flex items-baseline justify-between gap-4 border border-white/10 hover:border-[#DAA110]/40 px-5 py-4 transition-colors duration-300"
                  >
                    <span>
                      <span className="block text-white text-sm tracking-wide group-hover:text-[#DAA110] transition-colors duration-300">{y.name}</span>
                      {y.subtitle && (
                        <span className="block text-white/35 text-[10px] tracking-[0.15em] uppercase mt-1">{y.subtitle}</span>
                      )}
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block text-white/70 text-xs" style={{ fontFamily: "var(--gy-font-ui)" }}>{y.rate}</span>
                      <span className="block text-white/30 text-[9px] tracking-[0.15em] uppercase mt-1">Per Yacht &middot; Per Week</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setStatus("")}
            className="mt-12 text-[#DAA110] text-xs tracking-[0.2em] uppercase border-b border-[#DAA110]/30 pb-1 hover:border-[#DAA110] transition-all duration-300"
          >
            Send Another Brief
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative w-full bg-black py-28 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A] to-[#0D1B2A] z-0" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/noise.svg')] mix-blend-overlay z-10" />

      {/* Phase 27i.18 (2026-05-08), constellation backdrop. Reads
          as "navigate to us by the stars", a quiet poetic note for
          the final destination on the homepage scroll. Low intensity
          so it doesn't fight with the gold gradient overlay above. */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ConstellationBackdrop intensity={0.30} />
      </div>

      {/* Decorative gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#DAA110]/20 to-transparent z-20" />

      <div className="relative z-30 w-full max-w-5xl mx-auto px-6 md:px-12">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#DAA110]/70 mb-6 font-light">
            {t('contact.label')}
          </p>
          <h2
            className="font-marcellus tracking-tight pb-2"
            style={{
              // Mobile audit 2026-04-20: 5xl (48 px) at 320 px
              // broke awkwardly. Clamped to a fluid scale that hits
              // the same 7xl peak on desktop.
              fontSize: "clamp(32px, 7vw, 80px)",
              backgroundImage: "linear-gradient(90deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              color: "transparent", WebkitTextFillColor: "transparent",
              lineHeight: "1.2",
            }}
          >
            {t('contact.title')}
          </h2>
          <p className="mt-6 text-white/75 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>

          {/* Direct-contact row, merged from ContactBar (Proposal D).
              Phone + WhatsApp sit under the section headline so
              visitors who want a human right now don't have to fill
              the form. */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14">
            <a
              href="tel:+306970380999"
              className="group flex items-center gap-3 transition-colors duration-300"
              data-cursor="Call"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA110" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <div className="text-left">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-white/30" style={{ fontFamily: "var(--gy-font-ui)" }}>
                  Athens Office
                </span>
                <span className="text-[13px] text-white/50 group-hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--gy-font-ui)", letterSpacing: "0.05em" }}>
                  +30 697 038 0999
                </span>
              </div>
            </a>

            <span className="hidden sm:block w-px h-8" style={{ background: "rgba(218, 161, 16,0.12)" }} />

            <a
              href="https://api.whatsapp.com/send/?phone=17867988798"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 transition-colors duration-300"
              data-cursor="Chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#DAA110">
                <path d="M12.031 0.725C5.741 0.725 0.547 5.926 0.547 12.215C0.547 14.39 1.155 16.42 2.22 18.15L0.63 23.36l5.352-1.55c1.674 0.99 3.593 1.516 5.619 1.516c6.29 0 11.484-5.201 11.484-11.491C23.595 5.926 18.4 0.725 12.031 0.725zM17.476 15.655c-0.198 0.505-1.127 0.99-1.523 1.054c-0.342 0.054-0.695 0.078-1.574-0.373c-1.028-0.543-2.607-1.583-3.804-2.78c-1.197-1.197-2.237-2.776-2.78-3.804c-0.45-0.879-0.426-1.232-0.373-1.574c0.064-0.396 0.549-1.325 1.054-1.523c0.426-0.165 0.879-0.276 1.197-0.276c0.231 0 0.426 0.015 0.639 0.45l0.58 1.417c0.078 0.165 0.124 0.358 0.046 0.569c-0.078 0.21-0.26 0.45-0.45 0.639c-0.183 0.183-0.33 0.358-0.441 0.569c-0.111 0.21-0.26 0.385-0.137 0.609c0.124 0.223 0.639 1.152 1.518 2.031c0.879 0.879 1.808 1.455 2.031 1.518c0.223 0.124 0.398-0.023 0.609-0.137c0.21-0.111 0.385-0.26 0.569-0.441c0.183-0.183 0.426-0.375 0.639-0.45c0.21-0.078 0.403-0.032 0.569 0.046l1.417 0.58c0.435 0.211 0.546 0.665 0.373 1.197z"/>
              </svg>
              <div className="text-left">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-white/30" style={{ fontFamily: "var(--gy-font-ui)" }}>
                  WhatsApp
                </span>
                <span className="text-[13px] text-white/50 group-hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--gy-font-ui)", letterSpacing: "0.05em" }}>
                  +1 786 798 8798
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Step indicator removed 2026-07-08 (George's UI wave #4):
            the form is now ONE screen - every step of a wizard loses
            real enquiries, and the express form proved fewer clicks
            convert better. The `step` state remains only for the
            submit walk-back logic. */}
        {/* ── Form ── */}
        {/* noValidate: validation is handled by handleVercelSubmit /
            goToStep so the browser never silently blocks a submit on
            a field hidden in another step (the 2026-07-03 SOS bug). */}
        <form
          ref={formRef}
          onSubmit={handleVercelSubmit}
          onInput={saveDraft}
          onChange={saveDraft}
          onFocus={(e) => {
            if (e.target.name && e.target.name !== "website") lastFieldRef.current = e.target.name;
          }}
          noValidate
        >

          {/* Honeypot, hidden from real users, bots autofill it */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
          />

          {/* GROUP 1: About You (always visible - single screen) */}
          {/* 2026-08-23 completion pass: 9 required fields became 2.
              123 visitors started this form in 12 weeks, 21 finished.
              Name + email are the only asks; everything below is a
              preference George clarifies on the reply, which is his
              craft anyway. */}
          <div data-step="1" className="block">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#DAA110]/80 mb-3">{t('common.aboutYou')}</p>
            <p className="text-white/50 text-xs font-light tracking-wide mb-8">
              Only a name and an email are needed. Everything else simply helps George shape the right proposal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <Field icon={Icons.user} delay={0}>
                <label htmlFor="name" className="sr-only">{t('contact.name')}</label>
                <input type="text" id="name" name="name" required placeholder={`${t('contact.name')} *`} className={inputBase} />
              </Field>

              <Field icon={Icons.mail} delay={0.05}>
                <label htmlFor="email" className="sr-only">{t('contact.email')}</label>
                <input type="email" id="email" name="email" required placeholder={`${t('contact.email')} *`} className={inputBase} />
              </Field>

              <Field icon={Icons.phone} delay={0.1}>
                <label htmlFor="phone" className="sr-only">{t('contact.phone')}</label>
                <input type="tel" id="phone" name="phone" placeholder={t('contact.phone')} className={inputBase} />
              </Field>

              <Field icon={Icons.globe} delay={0.15}>
                <label htmlFor="country" className="sr-only">Country</label>
                <input type="text" id="country" name="country" placeholder="Country of Residence" className={inputBase} />
              </Field>
            </div>

          </div>

          {/* GROUP 2: Charter Details */}
          <div data-step="2" className="block mt-14">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#DAA110]/80 mb-3">{t('common.yourCharter')}</p>
            <p className="text-white/50 text-xs font-light tracking-wide mb-8">
              All optional. Undecided on dates or budget? Leave them open and George will advise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <Field icon={Icons.anchor} delay={0}>
                <label htmlFor="yacht_type" className="sr-only">Type of Yacht</label>
                <select id="yacht_type" name="yacht_type" className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Type of Yacht</option>
                  <option value="Motor Yacht" className="bg-black">Motor Yacht</option>
                  <option value="Sailing Catamaran" className="bg-black">Sailing Catamaran</option>
                  <option value="Power Catamaran" className="bg-black">Power Catamaran</option>
                  <option value="Not Sure - Advise Me" className="bg-black">Not Sure - Advise Me</option>
                </select>
              </Field>

              <Field icon={Icons.users} delay={0.05}>
                <label htmlFor="guests" className="sr-only">Guests</label>
                <select id="guests" name="guests" className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Number of Guests</option>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(n => (
                    <option key={n} value={n} className="bg-black">{n} Guests</option>
                  ))}
                  <option value="12+" className="bg-black">12+ Guests</option>
                </select>
              </Field>

              <Field icon={Icons.calendar} delay={0.1}>
                <label htmlFor="timing" className="sr-only">When would you sail</label>
                <select id="timing" name="timing" value={timingChoice} onChange={handleTimingChange} className={selectBase}>
                  <option value="" disabled className="text-white/30">When Would You Sail?</option>
                  <option value={TIMING_EXACT} className="bg-black">I have exact dates</option>
                  {TIMING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-black">{opt}</option>
                  ))}
                </select>
              </Field>

              {/* Exact dates live behind the "I have exact dates"
                  choice: the guests who already hold flights get
                  precision, everyone else never faces empty pickers.
                  Kept mounted so drafts restore into them. */}
              <div className={timingChoice === TIMING_EXACT ? "grid grid-cols-2 gap-x-6" : "hidden"}>
                <Field icon={Icons.calendar} delay={0}>
                  <label htmlFor="check_in" className="block text-[9px] tracking-[0.2em] uppercase text-white/40 pt-1">Check-in</label>
                  <input type="date" id="check_in" name="check_in" className={`${inputBase} date-input !py-2`} />
                </Field>
                <Field icon={Icons.calendar} delay={0}>
                  <label htmlFor="check_out" className="block text-[9px] tracking-[0.2em] uppercase text-white/40 pt-1">Check-out</label>
                  <input type="date" id="check_out" name="check_out" className={`${inputBase} date-input !py-2`} />
                </Field>
              </div>

              {/* Budget as tappable all-in bands, cut from the live
                  fleet's real spread. One tap gives George the filter
                  he searches with; a custom amount stays available. */}
              <div className="md:col-span-2">
                <Field icon={Icons.wallet} delay={0.15}>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 pt-1 mb-3">
                    Weekly Budget, All-In <span className="normal-case tracking-normal text-white/30">(yacht, crew, APA, VAT &amp; gratuity)</span>
                  </p>
                  <input type="hidden" name="budget" value={budgetValue} readOnly />
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setShowCustomBudget(false); setBudgetChoice(budgetChoice === opt ? "" : opt); }}
                        className={`px-4 py-2 text-xs tracking-wider border transition-colors duration-300 ${
                          !showCustomBudget && budgetChoice === opt
                            ? "border-[#DAA110] text-[#DAA110]"
                            : "border-white/25 text-white/60 hover:border-white/50 hover:text-white/80"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setShowCustomBudget(!showCustomBudget); setBudgetChoice(""); }}
                      className={`px-4 py-2 text-xs tracking-wider border transition-colors duration-300 ${
                        showCustomBudget
                          ? "border-[#DAA110] text-[#DAA110]"
                          : "border-white/25 text-white/60 hover:border-white/50 hover:text-white/80"
                      }`}
                    >
                      My own figure
                    </button>
                  </div>
                  {showCustomBudget && (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      placeholder="Your weekly budget in EUR"
                      className={`${inputBase} mt-3 max-w-xs`}
                    />
                  )}
                </Field>
              </div>

              <Field icon={Icons.mapPin} delay={0.25}>
                <label htmlFor="embarkation" className="sr-only">Embarkation</label>
                <select id="embarkation" name="embarkation" className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Preferred Embarkation</option>
                  <option value="Athens (Lavrion/Alimos)" className="bg-black">Athens (Lavrion/Alimos)</option>
                  <option value="Mykonos" className="bg-black">Mykonos</option>
                  <option value="Santorini" className="bg-black">Santorini</option>
                  <option value="Corfu" className="bg-black">Corfu</option>
                  <option value="Lefkada" className="bg-black">Lefkada</option>
                  <option value="Rhodes" className="bg-black">Rhodes</option>
                  <option value="Kos" className="bg-black">Kos</option>
                  <option value="Flexible" className="bg-black">Flexible - Advise Me</option>
                </select>
              </Field>

              <Field icon={Icons.mapPin} delay={0.3}>
                <label htmlFor="disembarkation" className="sr-only">Disembarkation</label>
                <select id="disembarkation" name="disembarkation" className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Preferred Disembarkation</option>
                  <option value="Same as Embarkation" className="bg-black">Same as Embarkation</option>
                  <option value="Athens (Lavrion/Alimos)" className="bg-black">Athens (Lavrion/Alimos)</option>
                  <option value="Mykonos" className="bg-black">Mykonos</option>
                  <option value="Santorini" className="bg-black">Santorini</option>
                  <option value="Corfu" className="bg-black">Corfu</option>
                  <option value="Lefkada" className="bg-black">Lefkada</option>
                  <option value="Flexible" className="bg-black">Flexible - Advise Me</option>
                </select>
              </Field>
            </div>

          </div>

          {/* GROUP 3: Your Vision */}
          <div data-step="3" className="block mt-14">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#DAA110]/80 mb-8">{t('common.details')}</p>
            <Field icon={Icons.message} delay={0}>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell us about your dream charter - special occasions, preferred islands, dining preferences, activities..."
                className={`${inputBase} resize-none`}
              />
            </Field>

            {/* Trust & Security Signals */}
            <div className="mt-14 mb-10 py-6 px-8 border border-white/5" style={{ background: "rgba(218, 161, 16,0.02)" }}>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-2 text-white/60 text-[10px] tracking-[0.15em] uppercase">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DAA110" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>{t('contact.secure')}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-[10px] tracking-[0.15em] uppercase">
                  {Icons.shield}
                  <span>Strictly Confidential</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-[10px] tracking-[0.15em] uppercase">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DAA110" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-[10px] tracking-[0.15em] uppercase">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DAA110" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Priority Response</span>
                </div>
              </div>
              <p className="text-center text-[9px] text-white/50 mt-4 tracking-wider">
                Your data is protected with bank-grade encryption. <a href="/privacy-policy" className="text-[#DAA110]/70 hover:text-[#DAA110] underline transition-colors">Learn how we protect your information</a>
              </p>
            </div>

            {/* 2026-07-02 (ASK B 5.5), the discretion signal. Old
                money buys silence; say it plainly at the point of
                trust. */}
            {/* 2026-08-23, George's number, his words: "if I am not
                asleep, I reply within 2 hours". The "usually" carries
                the sleep honestly. */}
            <div className="text-[11px] text-white/60 tracking-widest text-center mb-3 leading-relaxed">
              Your enquiry is read by George alone. First reply usually within two hours.
            </div>
            {/* GDPR + reCAPTCHA notice */}
            <div className="text-[9px] text-white/50 tracking-widest text-center mb-8 leading-relaxed">
              By entering your details or submitting this form you consent to George Yachts Brokerage House LLC processing your personal data to respond to your inquiry.
              See our <a href="/privacy-policy" className="underline text-[#DAA110]/70 hover:text-[#DAA110] transition-colors" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              <br />Protected by reCAPTCHA · Google Privacy Policy and Terms of Service apply.
            </div>

            {/* Status */}
            {status && status !== "success" && (
              <div className="text-[#DAA110] text-sm tracking-widest uppercase text-center mb-6 animate-pulse">
                {status}
              </div>
            )}

            {/* Submit */}
            {/* 2026-08-27, the David forensics: on a 375px phone, when
                this block sits in the bottom band of the screen, the
                WhatsApp FAB covered the submit button's bottom-right
                corner and the AmbientPlayer pill its bottom-left
                (both fixed at z-50/51 on the dock line). Centre taps
                always worked; corner taps landed on the FABs. z-[55]
                paints the submit above both, so every pixel of the
                button is the button. The FABs lose only the sliver
                that overlaps it, and only while it is on screen. */}
            <div ref={submitBlockRef} className="relative z-[55] flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={status === "Submitting..."}
                className="group relative w-full max-w-md py-5 overflow-hidden transition-all duration-500"
                style={{
                  background: 'linear-gradient(90deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-black font-bold text-sm tracking-[0.3em] uppercase">
                  {Icons.send}
                  {t('contact.submit')}
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {/* The WhatsApp bridge: the road most guests already
                  choose. Carries whatever is typed so far into a
                  prefilled message to the company number. */}
              <button
                type="button"
                onClick={openWhatsAppBridge}
                data-cursor="Chat"
                className="group flex items-center gap-2 text-white/40 text-xs tracking-[0.2em] uppercase hover:text-white/70 transition-colors duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#DAA110]/70 group-hover:text-[#DAA110] transition-colors duration-300">
                  <path d="M12.031 0.725C5.741 0.725 0.547 5.926 0.547 12.215C0.547 14.39 1.155 16.42 2.22 18.15L0.63 23.36l5.352-1.55c1.674 0.99 3.593 1.516 5.619 1.516c6.29 0 11.484-5.201 11.484-11.491C23.595 5.926 18.4 0.725 12.031 0.725zM17.476 15.655c-0.198 0.505-1.127 0.99-1.523 1.054c-0.342 0.054-0.695 0.078-1.574-0.373c-1.028-0.543-2.607-1.583-3.804-2.78c-1.197-1.197-2.237-2.776-2.78-3.804c-0.45-0.879-0.426-1.232-0.373-1.574c0.064-0.396 0.549-1.325 1.054-1.523c0.426-0.165 0.879-0.276 1.197-0.276c0.231 0 0.426 0.015 0.639 0.45l0.58 1.417c0.078 0.165 0.124 0.358 0.046 0.569c-0.078 0.21-0.26 0.45-0.45 0.639c-0.183 0.183-0.33 0.358-0.441 0.569c-0.111 0.21-0.26 0.385-0.137 0.609c0.124 0.223 0.639 1.152 1.518 2.031c0.879 0.879 1.808 1.455 2.031 1.518c0.223 0.124 0.398-0.023 0.609-0.137c0.21-0.111 0.385-0.26 0.569-0.441c0.183-0.183 0.426-0.375 0.639-0.45c0.21-0.078 0.403-0.032 0.569 0.046l1.417 0.58c0.435 0.211 0.546 0.665 0.373 1.197z"/>
                </svg>
                Prefer WhatsApp? Send your brief there instead
              </button>
              {/* The wizard-era "Back to Details" button was removed
                  2026-08-23: on the single-screen form it changed
                  invisible state and did nothing a visitor could see. */}
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        input, textarea, button, select { border-radius: 0 !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #0D1B2A inset;
          transition: background-color 5000s ease-in-out 0s;
        }
        select option { background: #0D1B2A !important; color: #F8F5F0 !important; }
        select:invalid { color: rgba(248, 245, 240,0.3); }
        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(1) saturate(3) hue-rotate(15deg);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
};

export default ContactFormSection;
