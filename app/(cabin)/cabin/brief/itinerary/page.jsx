"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  OpenTextarea,
  RadioGroup,
  CheckboxGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function ItinerarySectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Four · Itinerary"
        title="The shape"
        italic="of your week."
      />
      <IntroParagraph>
        Your captain will design a route together with you — there is nothing
        fixed. The questions below help us shape something that fits your
        pace and your interests. Weather always has the final word at sea,
        but we plan around your dreams, not just the wind.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="itinerary"
        prevSection={{ key: "health", title: "Health & Safety" }}
        nextSection={{ key: "life_aboard", title: "Life Aboard" }}
      >
        {({ register }) => (
          <>
            <CheckboxGroup
              name="preferred_areas"
              label="Preferred cruising area"
              hint="Tick any region that appeals — or leave them all blank and let the captain compose."
              register={register}
              options={[
                { value: "cyclades", label: "Cyclades — Mykonos, Santorini, Paros, Naxos, Milos" },
                { value: "saronic", label: "Saronic — Athens, Aegina, Hydra, Spetses" },
                { value: "ionian",  label: "Ionian — Corfu, Paxos, Lefkada, Ithaca" },
                { value: "mixed",   label: "Mixed itinerary — let the captain compose" },
                { value: "undecided", label: "I don’t know yet — we’ll discuss together" },
              ]}
            />
            <OpenTextarea
              label="Specific places to visit"
              hint="Islands, bays, restaurants you’ve heard about and want to see. The captain will fold them in where weather allows."
              name="specific_places"
              register={register}
              rows={4}
            />
            <RadioGroup
              name="pace"
              label="Your preferred pace"
              register={register}
              options={[
                { value: "productive",  label: "Productive & exciting", description: "See as much as possible." },
                { value: "slow_restful", label: "Slow & restful", description: "Fewer stops, longer at each." },
                { value: "balanced",    label: "A balance of both" },
              ]}
            />
            <RadioGroup
              name="night_preference"
              label="Marina or anchor?"
              register={register}
              options={[
                { value: "marinas",   label: "Marinas", description: "Town life, restaurants, shore access." },
                { value: "anchorages", label: "Anchorages", description: "Quiet bays, swimming off the back, stars." },
                { value: "mostly_anchor_some_marina", label: "Mostly anchorages, a couple of marina nights" },
                { value: "captain_decides", label: "Let the captain decide based on weather" },
              ]}
            />
            {/* 2026-05-20 — Friend-test pass 4 (Tyler):
                "/cabin/brief/itinerary has TWO sections that ask the
                 same thing — YOUR PREFERRED PACE and OVERALL CHARACTER
                 OF THE WEEK. Pick one."
                Removed the second radio. The overall_experience schema
                field stays in lib/cabin/schemas.js for back-compat with
                already-saved briefs. */}

            {/* 2026-05-20 — Da$k friend-test: "Αυτό το έχεις ξανά
                ρωτήσει — ποιο αν προτιμούν bays ή μαρίνα νομίζω, με
                τα ίδια ακριβώς". The `docking_preference` block here
                duplicated `night_preference` above with only slightly
                different wording. Removed from the UI. The schema
                field stays in lib/cabin/schemas.js so already-saved
                briefs continue to validate. */}

            {/* 2026-05-20 — Eleanna friend-test asked "Τι είναι το PADI;"
                Rephrasing the label so the acronym isn't load-bearing:
                "diving certification required" reads as the same gate
                without forcing every reader to recognise the body name.
                Hint already explains; tightened it too. */}
            <CheckboxGroup
              name="activities_extra"
              label="Additional activities"
              hint="The captain pre-checks licences, age limits, and provisioning. Scuba diving requires a recognised diving certificate (PADI, SSI, BSAC or similar)."
              register={register}
              twoColumn
              options={[
                { value: "cycling",            label: "Cycling ashore" },
                { value: "island_tour",        label: "Island tour (driver + car)" },
                { value: "scuba_diving_padi",  label: "Scuba diving (diving certificate required)" },
                { value: "fishing_specific",   label: "Sport fishing" },
              ]}
            />
            {/* 2026-05-20 — Friend-test pass 4 (Sarah):
                "Itinerary requires a PADI / SSI / BSAC certificate
                 for scuba — but the brief never asks me whether anyone
                 has one. Close the loop." Added a free-text field
                 surfaced conditionally below the scuba checkbox. The
                 captain reads the list verbatim. */}
            <OpenTextarea
              label="Anyone in your group already certified to dive?"
              hint="Only fill if scuba is on the wishlist above. Name + body (PADI Open Water, SSI Advanced, BSAC Sports, etc.) per certified guest. Card numbers + photos can come closer to the date."
              name="diving_certifications"
              register={register}
              rows={3}
              placeholder={"e.g. Sarah — PADI Open Water (2018)\nMark — PADI Advanced (2014)"}
            />

            <h2 className="brief-subhead">Celebrations</h2>
            <CheckboxGroup
              name="special_event_types"
              label="Type of occasion (tick any)"
              register={register}
              twoColumn
              options={[
                { value: "birthday",    label: "Birthday" },
                { value: "anniversary", label: "Anniversary" },
                { value: "honeymoon",   label: "Honeymoon" },
                { value: "proposal",    label: "Proposal" },
                { value: "other",       label: "Other (describe below)" },
              ]}
            />
            {/* 2026-05-20 — Friend-test pass 2: George flagged the
                "What we should pre-stage" checkbox grid (flowers /
                music / board games / magazines / banner / cake) as
                noise — these decisions are made face-to-face between
                George and the charterer, not pre-clicked from a list
                buried in section 4. Removed from the UI. Schema field
                special_event_extras stays in lib/cabin/schemas.js for
                back-compat with already-saved briefs. */}
            <OpenTextarea
              label="Tell us the day, the person, how big a moment"
              hint="Names, dates, anything we should know to make it special — or to keep it a surprise from someone aboard."
              name="celebrations"
              register={register}
              rows={4}
            />
          </>
        )}
      </BriefFormShell>

      <style jsx>{`
        .brief-subhead {
          font-family: var(--gy-font-ui);
          font-size: 12px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 36px 0 12px 0;
          font-weight: 500;
        }
      `}</style>
    </article>
  );
}
