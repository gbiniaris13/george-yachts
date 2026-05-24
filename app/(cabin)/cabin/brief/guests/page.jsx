"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function GuestsSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Two · Your Group"
        title="Who is sailing"
        italic="with you?"
      />
      <IntroParagraph>
        Tell us in your own words what would make this charter perfect — then a
        few quick taps about your group. The detailed manifest (passports,
        cabin pairings, allergies per person) opens shortly before embarkation.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="guests"
        prevSection={{ key: "arrival", title: "Arrival" }}
        nextSection={{ key: "health", title: "Health & Safety" }}
      >
        {({ register, watch }) => {
          const hasPet = watch("has_pet");
          return (
            <>
              <h2 className="brief-subhead">What would make this charter perfect for your group?</h2>
              <OpenTextarea
                label="In your own words"
                hint="Two or three sentences are plenty. The captain reads this aloud to the crew on day one."
                name="charter_purpose_narrative"
                placeholder="e.g. We are eight close friends, three of us turning forty this year. We want long swims, quiet anchorages, and a lot of laughing."
                register={register}
                rows={4}
              />

              {/* 2026-05-24 — Christos pass: "What kind of week" +
                  "A few quick taps about your group" were two very
                  similar prompts back-to-back. Merged under one
                  heading; the group-type checkboxes + group-scenarios
                  checkboxes both contribute to the same "about your
                  group" picture. "Friends celebrating" → just
                  "Friends" (no-one's obliged to celebrate). New
                  generic "Just friends, just sailing" option added
                  to scenarios. */}
              <h2 className="brief-subhead">About your group & the week</h2>
              <CheckboxGroup
                name="group_type"
                label="What kind of week is this? Tick any that apply"
                hint="Your crew calibrates around this."
                register={register}
                twoColumn
                options={[
                  { value: "family_with_children",  label: "Family with children" },
                  { value: "couples_retreat",       label: "Couples retreat" },
                  { value: "friends_celebrating",   label: "Friends" },
                  { value: "honeymoon",             label: "Honeymoon" },
                  { value: "multi_generational",    label: "Multi-generational" },
                  { value: "corporate_retreat",     label: "Corporate retreat" },
                  { value: "solo_close_friends",    label: "Solo with a few close friends" },
                  { value: "other",                 label: "Other (tell us below)" },
                ]}
              />

              <RadioGroup
                name="energy_level"
                label="Overall energy of the group"
                hint="Helps the chef weight menus and the captain choose anchorages."
                register={register}
                options={[
                  { value: "calm_restorative",      label: "Calm & restorative", description: "Quiet bays, early nights, slower mornings." },
                  { value: "mixed",                 label: "Mixed", description: "A combination of calm and very social." },
                  { value: "very_social_late_nights", label: "Very social", description: "Music, drinks, lively evenings." },
                ]}
              />

              <CheckboxGroup
                name="group_scenarios"
                label="Anything else worth noting? Tick any that apply"
                hint="A short list to help the crew prepare in advance. None mandatory."
                register={register}
                twoColumn
                options={[
                  { value: "just_friends_sailing",     label: "Just friends, just sailing" },
                  { value: "celebrating_anniversary",  label: "Celebrating an anniversary" },
                  { value: "celebrating_birthday",     label: "Celebrating a birthday" },
                  { value: "first_time_charter",       label: "First time chartering" },
                  { value: "returning_clients",        label: "Returning clients" },
                  { value: "with_grandparents",        label: "Travelling with grandparents" },
                  { value: "with_young_children",      label: "Travelling with young children" },
                  { value: "business_dinners",         label: "Some closed-door business dinners" },
                  { value: "early_risers",             label: "Some early risers" },
                  { value: "late_nights",              label: "Some late-night types" },
                  { value: "fitness_routine",          label: "Daily fitness routine to keep" },
                ]}
              />

              <h2 className="brief-subhead">Pets on board?</h2>
              <RadioGroup
                name="has_pet"
                label="Bringing a four-legged guest?"
                /* 2026-05-21 — Pass 7: removed "hostess sets up a
                   quiet corner". The captain remains the safe
                   universal noun across all vessel sizes. */
                hint="Greek waters allow pets aboard with the right paperwork. The captain pre-plans rest stops and sets aside a quiet corner."
                register={register}
                options={[
                  { value: "true",  label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />
              {hasPet === "true" && (
                <OpenTextarea
                  label="Tell us about your pet"
                  hint="Type, age, name, anything we should know — food brand, sleeping habits, swimming, comfort needs."
                  name="pet_details"
                  register={register}
                  rows={3}
                />
              )}

              {/* 2026-05-20 — Eleanna friend-test: "Δεν κατάλαβα τι ήθελες
                  να γράψω εδώ". The original prompt was abstract — by the
                  time you reach this field you've already filled the
                  charter_purpose_narrative at the top, so "anything else"
                  reads as "what do you want me to add now?" Concrete examples
                  the captain actually USES make it obvious what's worth
                  writing here. */}
              {/* 2026-05-22 — Photo preference. George's read on
                  the BF preference-list audit: "Το να μην φωτο-
                  γραφίζουν τους guest το κρατάμε."
                  Discreet single yes/no — default unset = crew
                  uses normal practice. Explicit "yes please refrain"
                  tells them to put the cameras away entirely. */}
              <h2 className="brief-subhead">A small note on photography</h2>
              <RadioGroup
                name="no_photos_of_guests"
                label="Would you prefer the crew not photograph the guests during the week?"
                hint="Some clients — especially the publicly known — prefer the cabin stays off-camera. The crew is always discreet either way; this just tells them to put the phones down entirely."
                register={register}
                options={[
                  { value: "false", label: "No, photos are welcome" },
                  { value: "true",  label: "Yes, please refrain" },
                ]}
              />

              {/* 2026-05-24 — Christos pass: was duplicating
                  "Pair-ups (who's sharing a cabin)" which Crew List
                  asks earlier per-member. Replaced the hint with a
                  generic "anything else from what you've picked
                  above, or anything we haven't covered" — no more
                  duplicate questions. */}
              <h2 className="brief-subhead">Anything else for the crew?</h2>
              <OpenTextarea
                label="A few sentences the captain reads to the rest of the crew"
                hint="If anything from what you've picked above needs more colour — or if there's something we simply haven't asked about — write it freely here. Skip if it's all in the boxes."
                name="group_notes"
                placeholder="e.g. We'd like the last night to feel quiet — slow anchor, candles, no music. A surprise birthday on Thursday for my brother, please keep it discreet until then."
                rows={5}
                register={register}
              />
            </>
          );
        }}
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
