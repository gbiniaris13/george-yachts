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
            <RadioGroup
              name="overall_experience"
              label="Overall character of the week"
              hint="Helps the captain pace days and the chef weight menus toward your energy."
              register={register}
              options={[
                { value: "productive_exciting", label: "Productive & exciting", description: "Active days, lots of movement, social evenings." },
                { value: "peaceful_relaxing",   label: "Peaceful & relaxing", description: "Quiet bays, restful pace, early nights." },
                { value: "combination",         label: "A combination of both" },
              ]}
            />

            <RadioGroup
              name="docking_preference"
              label="When mooring, you prefer"
              hint="Distinct from night preference above — this is about the captain's working rhythm."
              register={register}
              options={[
                { value: "marinas",   label: "Marinas (predictable, shore access)" },
                { value: "anchoring", label: "Anchoring (quieter, more freedom)" },
                { value: "both",      label: "A combination of both" },
              ]}
            />

            <CheckboxGroup
              name="activities_extra"
              label="Additional activities"
              hint="The captain pre-checks licences, age limits, and provisioning. Scuba requires a PADI certificate."
              register={register}
              twoColumn
              options={[
                { value: "cycling",            label: "Cycling ashore" },
                { value: "island_tour",        label: "Island tour (driver + car)" },
                { value: "scuba_diving_padi",  label: "Scuba diving (PADI required)" },
                { value: "fishing_specific",   label: "Sport fishing" },
              ]}
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
            <CheckboxGroup
              name="special_event_extras"
              label="What we should pre-stage"
              register={register}
              twoColumn
              options={[
                { value: "flowers",      label: "Flowers" },
                { value: "music",        label: "Music / playlist" },
                { value: "board_games",  label: "Board games" },
                { value: "magazines",    label: "Magazines" },
                { value: "banner",       label: "Banner / decoration" },
                { value: "cake",         label: "Custom cake" },
              ]}
            />
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
