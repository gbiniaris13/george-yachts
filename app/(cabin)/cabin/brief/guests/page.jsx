"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  OpenTextarea,
  CheckboxGroup,
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
        Your captain needs to know exactly who steps aboard — by law for the
        port authorities, and by heart for the crew. The detailed manifest
        (passport numbers, allergies, cabin pairing) lives in a dedicated
        page that opens shortly before embarkation. Below, share any general
        notes about your group.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="guests"
        prevSection={{ key: "arrival", title: "Arrival" }}
        nextSection={{ key: "health", title: "Health & Safety" }}
      >
        {({ register }) => (
          <>
            <CheckboxGroup
              name="group_scenarios"
              label="Tick anything that applies"
              hint="A short list to help the crew prepare in advance. None of these are mandatory — they just give us a head-start."
              register={register}
              twoColumn
              options={[
                { value: "celebrating_anniversary", label: "Celebrating an anniversary" },
                { value: "celebrating_birthday",     label: "Celebrating a birthday" },
                { value: "honeymoon",                label: "Honeymoon" },
                { value: "first_time_charter",       label: "First time chartering" },
                { value: "returning_clients",        label: "Returning clients" },
                { value: "with_grandparents",        label: "Multi-generational (with grandparents)" },
                { value: "with_young_children",      label: "Travelling with young children" },
                { value: "business_dinners",         label: "Some closed-door business dinners" },
                { value: "early_risers",             label: "Some early risers" },
                { value: "late_nights",              label: "Some late-night types" },
                { value: "vegan_vegetarian",         label: "One or more vegan/vegetarian" },
                { value: "fitness_routine",          label: "Daily fitness routine to keep" },
              ]}
            />
            <OpenTextarea
              label="Anything else about your group"
              hint="Family relationships, who is traveling with whom, anything you’d like the crew to know that didn’t fit above."
              name="group_notes"
              placeholder="A few sentences are perfect."
              rows={5}
              register={register}
            />
          </>
        )}
      </BriefFormShell>
    </article>
  );
}
