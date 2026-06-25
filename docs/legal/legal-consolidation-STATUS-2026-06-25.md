# Legal Pages — Consolidation Status (2026-06-25)

## What was DONE (safe, technical, live on next deploy)
The duplicate-legal-page problem (Ahrefs duplicate-content + legal-clarity risk)
is fixed at the routing level, per the legal research's §7 recommendation:

- **301 redirects** added in `next.config.mjs`:
  - `/privacy` → `/privacy-policy`
  - `/terms` → `/terms-of-service`
  - `/your-privacy-security` → `/privacy-policy`
- **Sitemap** (`app/sitemap.js`): dropped `/your-privacy-security`. Canonical
  legal pages in the sitemap are now `/privacy-policy`, `/terms-of-service`,
  `/cookie-policy`, `/privacy/delete`. (`/privacy` and `/terms` were never in
  the sitemap.)
- **Internal links**: the one stray `/your-privacy-security` link
  (`ContactFormSection.jsx`) now points to `/privacy-policy`. Footer already
  pointed to the canonical URLs.

Canonical legal pages keep their CURRENT (already-live) text for now. This
change is pure routing/dedup — zero new legal copy published, zero legal risk.

## What is BLOCKED — the new consolidated legal COPY is NOT published
The legal research produced excellent draft Privacy Policy / Terms of Service /
Cookie Policy text. It is **NOT** published, for three honest reasons:

1. **FABRICATED EIN.** The research draft contains a US EIN ("30-1480422") that
   was AI-generated, NOT supplied by George. It must NEVER be published. The
   REAL EIN must come from George before any entity-identification block goes live.
   The "STE R" suite in the registered-agent address is likewise unverified.
2. **Attorney sign-off required (the research's own #1 instruction).** Real legal
   exposure flagged: Greek charter-brokerage licensing, GEMI branch registration,
   charter VAT (13% per L.5073/2023), Greek permanent-establishment / tax nexus
   for a Wyoming LLC operating from Athens, and final CCPA/CPRA confirmation.
   These need a Greek-qualified attorney + a US attorney.
3. **Placeholders to resolve:** effective/last-updated dates; the `privacy@` and
   `legal@` georgeyachts.com inboxes (currently only `george@` exists).

## Key decisions from the research (for the attorney)
- Website Terms → **Greek law** (Athens establishment, GDPR Art. 3(1)); Rome I
  Art. 6(2) preserves each EU/UK consumer's home-country mandatory protections.
  The MYBA charter contract stays **English-law / LMAA London** (signed offline).
- Controller = "George Yachts Brokerage House LLC, a Wyoming LLC operating from
  Kifisia, Athens." Supervisory authority = **Hellenic DPA**. **No GDPR Art. 27
  EU representative** needed (Art. 3(1) establishment).
- Cookies: opt-in, consent-before-load, equal-prominence Reject (HDPA Rec. 1/2020).
  Microsoft Clarity (session recording) = highest-sensitivity tracker.

## Next steps (in order)
1. George provides the **real EIN** + confirms the exact registered-agent address.
2. Greek + US attorney review the draft Privacy/Terms/Cookie text (held in the
   project research output — keep that message; not re-transcribed here to avoid
   introducing errors into legal text).
3. Create `privacy@` / `legal@` inboxes (or decide to route to `george@`).
4. Once approved: dev swaps the attorney-approved copy into the canonical pages
   `/privacy-policy`, `/terms-of-service`, `/cookie-policy` (self-canonical tags
   already present), adds the cookie-consent CMP (consent-before-load), and signs
   Art. 28 DPAs with each processor.

## Separately flagged (own task)
Supabase RLS is disabled on 7 pre-existing tables — see the spawned task
"Review RLS on 7 exposed Supabase tables".
