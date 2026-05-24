"use client";

// 2026-05-24 — Angeliki pass (item 3): Life Aboard is now per-member.
// Storage moved to cabin_members.personal_details.life_aboard_brief
// via /api/cabin/me/life-aboard. Each member sees ONLY their own
// answers — empty form on first open, their own filled-in answers
// on return. The principal (and George) see the full per-member
// aggregate on the review page.
//
// Mechanism: same BriefFormShell as the shared sections, just
// pointed at a different endpoint via endpointBase. backHref +
// hideSubmit keep the navigation honest — no shared "Next" button
// because the answer set is intentionally member-local.

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  OpenTextarea,
  RadioGroup,
  CheckboxGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function LifeAboardSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Five · Life Aboard"
        title="Your days"
        italic="at sea."
      />
      {/* 2026-05-24 — Angeliki pass: privacy banner. Each member
          fills this section privately — no-one else aboard sees
          another member's answers. George + the crew see the
          per-member roll-up before embarkation. */}
      <aside className="la-private" role="note">
        <span className="la-private__chip">Private to you</span>
        <p className="la-private__copy">
          <em>
            This section is per person — no-one else in your group
            sees what you write here. Tell us how YOU&apos;d like the
            crew around you, the activities YOU love. The captain
            and chef see every member&apos;s answers when George
            briefs the boat — that&apos;s how the week feels right
            for everyone, not just whoever organised it.
          </em>
        </p>
      </aside>
      {/* 2026-05-24 — Christos pass: intro rewritten to a single
          calm question about crew presence. The "tell us your
          tempo" preamble was abstract and overlapped with the
          itinerary section. */}
      <IntroParagraph>
        One simple question first — how would you like the crew to
        be around you, and to address you, during the week? After
        that, a quiet list of generic things many groups enjoy at
        sea. Tick anything that appeals; skip whatever doesn&apos;t.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="life-aboard"
        endpointBase="/api/cabin/me"
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
           it used to apply to. */
        /* 2026-05-24 — Angeliki pass: per-member privacy banner. */
        .la-private {
          margin: 0 0 22px 0;
          padding: 14px 18px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 3px;
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }
        .la-private__chip {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
          flex-shrink: 0;
        }
        .la-private__copy {
          margin: 0;
          flex: 1;
          min-width: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}
