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
            <OpenTextarea
              label="Special occasions onboard"
              hint="Birthday, anniversary, honeymoon, graduation, retirement — anything to mark? Tell us the day, the person, and how big a moment you’d like it to be."
              name="celebrations"
              register={register}
              rows={4}
            />
          </>
        )}
      </BriefFormShell>
    </article>
  );
}
