"use client";

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

            {/* 2026-05-22 — Music taste — a single, careful question.
                Pass 2 removed the per-time-of-day soundtrack fields
                (morning / lunch / sunset / late night) because the
                hostess can't guarantee specific track delivery and
                we don't want "you said Sinatra at sunset, got Lo-Fi"
                complaints. This freeform replacement asks for the
                room's general taste — the crew uses it as a sense
                of direction for background music, not a playlist. */}
            <h2 className="brief-subhead">Music taste</h2>
            <OpenTextarea
              label="What does this group enjoy in the background?"
              hint="The captain and hostess use this to set a tasteful tone — bossa nova at lunch, soft rock at sundown, that sort of thing. We can't promise specific tracks, just a general direction that suits the room."
              name="music_taste"
              register={register}
              rows={3}
              placeholder="e.g. mostly jazz and bossa nova during the day, anything but house at dinner. We'll bring our own playlists for late nights."
            />
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
      `}</style>
    </article>
  );
}
