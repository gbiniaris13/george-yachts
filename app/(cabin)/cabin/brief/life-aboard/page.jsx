"use client";

// 2026-05-26 — Brief 02 (Task A4.1) — Life Aboard is now a
// Main-Charterer decision under the new single-responsibility
// model. Storage moved BACK to the shared cabin_brief_sections
// row (sectionKey "life_aboard") via the standard
// /api/cabin/brief/life_aboard endpoint.
//
// 2026-05-26 — Brief 02 (bug-pass v3, Domingo fresh-guest test):
// The original CP3 implementation wrapped this page in
// PrincipalOnlyGate (server component) which uses <fieldset
// disabled> to read-only the form. Domingo's test confirmed
// the form below STILL had 13 live interactive elements — the
// disabled-fieldset semantics weren't propagating through the
// RHF-driven form tree on the live build. Replaced the
// PrincipalOnlyGate wrap with the SAME tri-state isPrincipal
// pattern that dining/beverages already use: for guests we
// return GuestBriefReadOnly EARLY so the editable form never
// mounts in the DOM at all (0 inputs, exactly like dining).
// Server-side gate at /api/cabin/brief/life_aboard PUT (403
// for non-principals, added CP1) is the actual protection;
// this is the polite, correct UI.

import { useEffect, useState } from "react";
import Link from "next/link";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import SectionProgress from "../../../../components/cabin/brief/SectionProgress";
import {
  SectionTitle,
  OpenTextarea,
  RadioGroup,
  CheckboxGroup,
} from "../../../../components/cabin/brief/FormFields";
import GuestBriefReadOnly from "../../../../components/cabin/brief/GuestBriefReadOnly";

export default function LifeAboardSectionPage() {
  // Tri-state: null = loading, true = principal, false = guest.
  // Mirrors the resolved-role pattern in dining/beverages so the
  // first paint never flashes the wrong tree at the viewer.
  const [isPrincipal, setIsPrincipal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cabin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (!j?.ok) {
          setIsPrincipal(false);
          return;
        }
        const m = j?.member;
        const canEdit =
          m?.role === "principal_charterer" || m?.is_brief_admin === true;
        setIsPrincipal(Boolean(canEdit));
      })
      .catch(() => {
        if (!cancelled) setIsPrincipal(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isPrincipal === null) {
    return (
      <article>
        <SectionTitle
          kicker="Section Five · Life Aboard"
          title="Your days"
          italic="at sea."
        />
        <div
          aria-busy="true"
          aria-label="Loading"
          style={{
            marginTop: 22,
            height: 120,
            borderRadius: 3,
            background:
              "linear-gradient(90deg, rgba(13,27,42,0.05) 25%, rgba(13,27,42,0.1) 37%, rgba(13,27,42,0.05) 63%)",
            backgroundSize: "400% 100%",
            animation: "gbr-shimmer 1.4s infinite",
          }}
        />
        <style jsx>{`
          @keyframes gbr-shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </article>
    );
  }

  // GUEST READ-ONLY BRANCH — return early so the editable form
  // never mounts.
  if (isPrincipal === false) {
    return (
      <article>
        <SectionTitle
          kicker="Section Five · Life Aboard"
          title="Your days"
          italic="at sea."
        />
        <GuestBriefReadOnly sectionKey="life_aboard" kind="life_aboard" />
        <nav className="guest-back-nav">
          <Link href="/cabin" className="guest-back-link">
            ← Back to your Cabin
          </Link>
        </nav>
        <style jsx>{`
          .guest-back-nav {
            margin: 28px 0 0 0;
            padding-top: 22px;
            border-top: 1px solid rgba(13, 27, 42, 0.08);
            display: flex;
            justify-content: flex-start;
          }
          .guest-back-link {
            font-family: var(--gy-font-ui);
            font-size: 11px;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: rgba(13, 27, 42, 0.65);
            text-decoration: none;
            padding: 14px 0;
            min-height: 48px;
            display: inline-flex;
            align-items: center;
          }
          .guest-back-link:hover { color: var(--gy-navy); }
        `}</style>
      </article>
    );
  }

  // isPrincipal === true → render the editable form below.
  return (
    <article>
      <SectionProgress stepNumber={5} stepTotal={8} stepLabel="Life Aboard" />
      <SectionTitle
        kicker="Section Five · Life Aboard"
        title="Your days"
        italic="at sea."
      />
      <IntroParagraph>
        How would you like the crew to be around the group, and a
        quiet list of generic things many groups enjoy at sea —
        tick what appeals to your party, skip what doesn&apos;t.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="life_aboard"
        prevSection={{ key: "itinerary", title: "Itinerary" }}
        nextSection={{ key: "dining", title: "At the Table" }}
      >
        {({ register }) => (
          <>
            <RadioGroup
              name="crew_interaction"
              label="How would you like the crew to be around you and to address you?"
              hint="Sets the tone for the whole week — invisible service, warm professional, or chatty-friendly."
              register={register}
              options={[
                { value: "always_around", label: "Warm and chatty", description: "Crew on first-name terms, attentive throughout the day, like family at the table." },
                { value: "balanced",      label: "Warm but discreet", description: "Crew present when needed, invisible when not. Polite address (Sir / Ma'am at first, then by name when invited)." },
                { value: "discreet",      label: "Quiet & formal", description: "Service-first, minimal small-talk, Sir / Ma'am throughout the week." },
              ]}
            />

            <CheckboxGroup
              name="activities"
              label="What does your group love?"
              hint="Generic moments only — the water toys your vessel actually carries are shown on your cabin home. The crew will fold in whatever matches what you've ticked here."
              register={register}
              twoColumn
              options={[
                { value: "swimming_snorkel", label: "Swimming & snorkeling" },
                { value: "sunbathing",       label: "Sunbathing" },
                { value: "sunset_cocktails", label: "Sunset cocktails" },
                { value: "stargazing",       label: "Stargazing" },
                { value: "shopping_ashore",  label: "Shopping ashore" },
                { value: "island_hikes",     label: "Island walks" },
                { value: "cultural_tours",   label: "Cultural moments ashore" },
                { value: "sailing_under_sail", label: "Time under sail" },
              ]}
            />
            <OpenTextarea
              label="Anything else your group loves — write freely"
              hint="Specific water toys, scuba experiences, fishing — anything we haven't listed. The crew will tell you what your vessel can and can't carry."
              name="activities_other"
              register={register}
              rows={2}
            />

            <OpenTextarea
              label="A few small touches we should ask the crew about"
              hint="Anything that would make a small difference — write freely. The captain will come back with a quick yes/no on each."
              name="extras_freeform"
              register={register}
              rows={4}
            />
          </>
        )}
      </BriefFormShell>

      <style jsx>{`
        .brief-subhead {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 28px 0 4px 0;
          font-weight: 500;
        }
        .brief-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid { grid-template-columns: 1fr 1fr; gap: 0 24px; }
        }
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 0 0 14px 0;
        }
      `}</style>
    </article>
  );
}
