"use client";

// 2026-05-26 — Brief 02 (Task A4.1) — Life Aboard is now a
// Main-Charterer decision under the new single-responsibility
// model. Storage moved BACK to the shared cabin_brief_sections
// row (sectionKey "life_aboard") via the standard
// /api/cabin/brief/life_aboard endpoint. Guests see the
// principal-only banner via <PrincipalOnlyGate> and the form is
// rendered inside a disabled fieldset so they can read but not
// type. Server gate already in place (CP1 added "life_aboard" to
// PRINCIPAL_ONLY_SECTIONS).
//
// The OLD per-member endpoint (/api/cabin/me/life-aboard) is
// still mounted but principal-only and unused by this page;
// kept for back-compat with any rogue caller. Existing
// per-member data in cabin_members.personal_details
// .life_aboard_brief becomes vestigial but is not deleted —
// George's per-member roll-up on /cabin/brief/review can still
// surface it for historical cabins.
//
// 2026-05-24 — Angeliki pass (item 3) HISTORICAL: Life Aboard was
// per-member, storage at cabin_members.personal_details
// .life_aboard_brief via /api/cabin/me/life-aboard. Replaced by
// the model above on 2026-05-26.

// 2026-05-26 — Brief 02 (A4.1): the PrincipalOnlyGate wrap lives
// in app/(cabin)/cabin/brief/life-aboard/layout.jsx — the layout is
// a server component (where async server components can run), the
// page below is a client component (RHF + hooks). Mirrors the
// existing pattern used for arrival/itinerary/health/guests.

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import SectionProgress from "../../../../components/cabin/brief/SectionProgress";
import {
  SectionTitle,
  OpenTextarea,
  RadioGroup,
  CheckboxGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function LifeAboardSectionPage() {
  return (
    <article>
      <SectionProgress stepNumber={5} stepTotal={8} stepLabel="Life Aboard" />
      <SectionTitle
        kicker="Section Five · Life Aboard"
        title="Your days"
        italic="at sea."
      />
      {/* 2026-05-26 — Brief 02 (A4.1): Per-member "Private to you"
          banner removed. Life Aboard is now a single Main-Charterer
          decision for the whole group, not a per-person form.
          Guests get the principal-only banner from PrincipalOnlyGate
          below instead. */}
      <IntroParagraph>
        How would you like the crew to be around the group, and a
        quiet list of generic things many groups enjoy at sea —
        tick what appeals to your party, skip what doesn&apos;t.
      </IntroParagraph>

      {/* 2026-05-26 — Brief 02 (A4.1): the surrounding layout.jsx
          wraps this page in <PrincipalOnlyGate sectionTitle="Life
          Aboard"> so guests see the cream "Principal only" banner +
          a disabled fieldset. The server also 403s any guest PUT
          to /api/cabin/brief/life_aboard (CP1) — belt-and-braces. */}
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

            {/* 2026-05-24 — Christos pass: activities list trimmed
                to GENERIC items only — no per-vessel water toys
                (scuba, jet ski, wakeboarding etc.) which create a
                trap when a vessel doesn't carry them. The vessel
                brochure on the cabin home already lists the actual
                toys this yacht carries. */}
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

            {/* 2026-05-24 — Music Taste removed entirely per George
                friend test 4 (Christos pass): with 6-12 voices in
                a shared brief, music taste becomes a swamp ("rock
                / jazz / electronic / Greek / nothing late at night"
                all from different members on the same field — the
                crew can't read intent from that). Schema field
                music_taste stays registered in lib/cabin/schemas.js
                for back-compat. */}
            {/* 2026-05-20 — Wellness on board section (yoga, massage,
                stargazing nights, sunrise meditation, personal trainer)
                removed in pass 2. George: "Καλύτερα να βγει — στην
                τελική αν κάποιος είναι κολλημένος με τη γιόγκα μπορεί
                να το γράψει από μόνος του." Schema field
                (wellness_onboard) stays for back-compat. */}

            <OpenTextarea
              label="A few small touches we should ask the crew about"
              hint="Anything that would make a small difference — write freely. The captain will come back with a quick yes/no on each."
              name="extras_freeform"
              register={register}
              rows={4}
            />

            {/* 2026-05-20 — Removed the "Most of these are included…
                management company" disclaimer. George: "Δεν θέλουμε να
                ξέρουν οι πελάτες μας αν έχουμε εταιρεία management, αν
                το σκάφος είναι δικό μας. Είμαστε brokers — αυτές οι
                πληροφορίες δεν εκτίθενται." */}
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
        /* 2026-05-20 — .la-extras-note styles removed alongside the
           "Most of these are included… management company" disclaimer
           it used to apply to.
           2026-05-26 — Brief 02 (A4.1): .la-private + chip + copy
           styles removed alongside the per-member "Private to you"
           banner. PrincipalOnlyGate ships its own boutique banner. */
      `}</style>
    </article>
  );
}
