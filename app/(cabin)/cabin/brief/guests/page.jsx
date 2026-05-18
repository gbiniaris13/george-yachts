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

              <h2 className="brief-subhead">What kind of week is this?</h2>
              <CheckboxGroup
                name="group_type"
                label="Tick any that apply"
                hint="The crew, chef and hostess all calibrate around this."
                register={register}
                twoColumn
                options={[
                  { value: "family_with_children",  label: "Family with children" },
                  { value: "couples_retreat",       label: "Couples retreat" },
                  { value: "friends_celebrating",   label: "Friends celebrating" },
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
                hint="Helps the chef weight menus, the hostess plan the bar, and the captain choose anchorages."
                register={register}
                options={[
                  { value: "calm_restorative",      label: "Calm & restorative", description: "Quiet bays, early nights, slower mornings." },
                  { value: "mixed",                 label: "Mixed", description: "A balance of restful days and social evenings." },
                  { value: "very_social_late_nights", label: "Very social, late nights", description: "Music, drinks, often after midnight." },
                ]}
              />

              <h2 className="brief-subhead">A few quick taps about your group</h2>
              <CheckboxGroup
                name="group_scenarios"
                label="Tick anything that applies"
                hint="A short list to help the crew prepare in advance. None mandatory."
                register={register}
                twoColumn
                options={[
                  { value: "celebrating_anniversary", label: "Celebrating an anniversary" },
                  { value: "celebrating_birthday",     label: "Celebrating a birthday" },
                  { value: "first_time_charter",       label: "First time chartering" },
                  { value: "returning_clients",        label: "Returning clients" },
                  { value: "with_grandparents",        label: "Travelling with grandparents" },
                  { value: "with_young_children",      label: "Travelling with young children" },
                  { value: "business_dinners",         label: "Some closed-door business dinners" },
                  { value: "early_risers",             label: "Some early risers" },
                  { value: "late_nights",              label: "Some late-night types" },
                  { value: "vegan_vegetarian",         label: "One or more vegan/vegetarian" },
                  { value: "fitness_routine",          label: "Daily fitness routine to keep" },
                ]}
              />

              <h2 className="brief-subhead">Pets on board?</h2>
              <RadioGroup
                name="has_pet"
                label="Bringing a four-legged guest?"
                hint="Greek waters allow pets aboard with the right paperwork. The captain pre-plans rest stops and the hostess sets up a quiet corner."
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

              <h2 className="brief-subhead">Anything else?</h2>
              <OpenTextarea
                label="About your group"
                hint="Family relationships, who is travelling with whom, anything you'd like the crew to know."
                name="group_notes"
                placeholder="A few sentences are perfect."
                rows={4}
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
