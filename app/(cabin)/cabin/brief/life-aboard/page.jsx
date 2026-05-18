"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
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
      <IntroParagraph>
        A week aboard is different from any other holiday. Some guests want
        music, water sports, late nights; others want silence, books, dawn
        swims. Tell us your tempo.
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
              label="How present would you like the crew?"
              register={register}
              options={[
                { value: "always_around", label: "Always around", description: "Chatty, attentive, like family." },
                { value: "balanced",      label: "A balance", description: "Present when needed, invisible when not." },
                { value: "discreet",      label: "Discreet", description: "Let us know you’re there, but stay back." },
              ]}
            />

            <CheckboxGroup
              name="activities"
              label="What does your group love?"
              hint="Tick anything that appeals. Your vessel and itinerary determine what’s possible; we’ll let you know."
              register={register}
              twoColumn
              options={[
                { value: "swimming_snorkel", label: "Swimming & snorkeling" },
                { value: "paddleboarding",   label: "Stand-up paddleboarding" },
                { value: "kayaking",         label: "Kayaking" },
                { value: "water_skiing",     label: "Water skiing" },
                { value: "wakeboarding",     label: "Wakeboarding" },
                { value: "tubing",           label: "Tubing" },
                { value: "scuba_rendezvous", label: "Scuba diving (rendezvous)" },
                { value: "jet_ski",          label: "Jet ski" },
                { value: "fishing",          label: "Fishing" },
                { value: "sailing_under_sail", label: "Sailing under sail" },
                { value: "sunbathing",       label: "Sunbathing" },
                { value: "island_hikes",     label: "Island hikes" },
                { value: "shopping_ashore",  label: "Shopping ashore" },
                { value: "cultural_tours",   label: "Cultural tours" },
                { value: "sunset_cocktails", label: "Sunset cocktails" },
                { value: "stargazing",       label: "Stargazing" },
              ]}
            />
            <OpenTextarea
              label="Anything else you love that we didn’t list"
              name="activities_other"
              register={register}
              rows={2}
            />

            <h2 className="brief-subhead">Soundtrack</h2>
            <p className="brief-note">
              <em>
                Your hostess can pre-load playlists, or you can connect your
                own devices via Bluetooth. Tell us styles, artists, moods.
              </em>
            </p>
            <div className="brief-grid">
              <TextField
                label="Morning music"
                name="music.morning"
                placeholder="e.g. Acoustic, jazz, Greek classics"
                register={register}
              />
              <TextField
                label="Lunch & afternoon"
                name="music.lunch_afternoon"
                placeholder="e.g. Bossa nova, Mediterranean lounge"
                register={register}
              />
              <TextField
                label="Sunset & dinner"
                name="music.sunset_dinner"
                placeholder="e.g. Soft soul, Cuban, French chanson"
                register={register}
              />
              <TextField
                label="Late night"
                name="music.late_night"
                placeholder="e.g. House, deep electronica"
                register={register}
              />
            </div>
            <OpenTextarea
              label="Specific artists or playlists to have ready"
              name="music.specific_artists"
              placeholder="e.g. Nick Cave, Άννα Βίσση, a Spotify playlist link"
              register={register}
              rows={2}
            />

            <h2 className="brief-subhead">Wellness on board</h2>
            <CheckboxGroup
              name="wellness_onboard"
              label="Anything that interests you"
              hint="The captain pre-checks availability and pricing with the management company. Most yachts can arrange these with notice."
              register={register}
              twoColumn
              options={[
                { value: "yoga_morning",        label: "Morning yoga session" },
                { value: "massage_onboard",     label: "Massage on board" },
                { value: "stargazing_nights",   label: "Stargazing evenings" },
                { value: "sunrise_meditation",  label: "Sunrise meditation" },
                { value: "personal_trainer",    label: "Personal trainer / fitness" },
              ]}
            />

            <OpenTextarea
              label="A few small touches we should ask the crew about"
              hint="Fresh flowers, board games, books in a particular language, yoga mats, beach equipment for shore stops — whatever would make a small difference. Write freely."
              name="extras_freeform"
              register={register}
              rows={4}
            />
            <p className="la-extras-note">
              <em>
                Most of these are included; a few may carry a small cost from
                the management company. We’ll come back to you with a quiet
                yes/no on anything that isn’t free — no surprises.
              </em>
            </p>
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
        .la-extras-note {
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.6);
          background: rgba(201, 168, 76, 0.05);
          border-left: 1px solid rgba(201, 168, 76, 0.5);
          padding: 10px 14px;
          margin: 6px 0 0 0;
        }
      `}</style>
    </article>
  );
}
