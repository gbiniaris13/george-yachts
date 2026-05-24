"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
} from "../../../../components/cabin/brief/FormFields";

export default function HealthSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Three · Emergency Contact"
        title="One person,"
        italic="ashore."
      />
      {/* 2026-05-24 — Christos pass: section drastically slimmed.
          The old group-level health fields (allergies / medical
          conditions / medications / swimming overview) belong to
          each MEMBER privately on their own /cabin/me page — GDPR
          and clarity both demand it. The principal's brief now
          carries ONLY the emergency-contact ashore. */}
      <IntroParagraph>
        One person, not aboard, the captain can reach in an
        emergency. Allergies, medications, swimming comfort and
        every other personal health detail live on each
        member&apos;s own private page — kept private from the
        rest of the group, shared only with George and the
        captain for safety planning.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="health"
        prevSection={{ key: "guests", title: "Your Group" }}
        nextSection={{ key: "itinerary", title: "Itinerary" }}
      >
        {({ register }) => (
          <>
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
