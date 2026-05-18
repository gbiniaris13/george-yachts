"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  RadioGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function HealthSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Three · Health & Safety"
        title="For your"
        italic="safety at sea."
      />
      <IntroParagraph>
        This is the single most important page of the document. The
        information here goes directly to your captain and chef and informs
        every decision they make. Please be thorough — when in doubt, write
        it down.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="health"
        prevSection={{ key: "guests", title: "Your Group" }}
        nextSection={{ key: "itinerary", title: "Itinerary" }}
      >
        {({ register }) => (
          <>
            <OpenTextarea
              label="Allergies, intolerances, dietary needs"
              hint="List every allergy, food intolerance, religious or ethical restriction across your party. Note which guest each applies to."
              name="allergies_dietary"
              register={register}
              required
              rows={5}
            />
            <OpenTextarea
              label="Medical conditions the captain should know"
              hint="Heart conditions, asthma, mobility issues, pregnancy, recent surgery — anything that affects how we plan water activities or emergency response. Strictly between you and your crew."
              name="medical_conditions"
              register={register}
              rows={4}
            />
            <OpenTextarea
              label="Medications onboard"
              hint="EpiPens, insulin, inhalers, prescription medication. We can arrange refrigeration or secure storage."
              name="medications_onboard"
              register={register}
              rows={3}
            />
            <RadioGroup
              name="swimming_experience"
              label="Swimming experience"
              hint="The captain plans water activities accordingly."
              register={register}
              options={[
                { value: "all_strong", label: "All guests are strong swimmers" },
                { value: "some_prefer_not", label: "Some guests prefer not to swim" },
                { value: "children_supervised", label: "Children require supervision" },
                { value: "other", label: "Other (please describe)" },
              ]}
            />
            <OpenTextarea
              label="If other, please describe"
              name="swimming_other"
              register={register}
              rows={2}
            />

            <h2 className="brief-subhead">Emergency contact ashore</h2>
            <p className="brief-note">
              <em>One person, not aboard, the captain can reach in an emergency.</em>
            </p>
            <div className="brief-grid">
              <TextField
                label="Full name"
                name="emergency_contact.full_name"
                placeholder="e.g. Eleni Papadopoulou"
                register={register}
                required
              />
              <TextField
                label="Relationship to charterer"
                name="emergency_contact.relationship"
                placeholder="e.g. Sister, daughter, business partner"
                register={register}
                required
              />
              <TextField
                label="Mobile number"
                name="emergency_contact.mobile"
                placeholder="+30 6970 380 999"
                register={register}
                required
                inputMode="tel"
              />
              <TextField
                label="Email"
                name="emergency_contact.email"
                placeholder="eleni@example.com"
                register={register}
                required
                type="email"
              />
            </div>
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
          margin: 28px 0 8px 0;
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
          margin: 0 0 16px 0;
        }
      `}</style>
    </article>
  );
}
