"use client";

// AllergyAlert — surfaces any allergies / medical notes the user
// entered in the Health & Safety section at the TOP of food-related
// pages (dining, beverages, children).
//
// 2026-05-20 — Da$k friend-test: "ΕΙΜΑΣΤΕ EOT food .... εκεί
// ΠΡΕΠΕΙ να λέει κάπου με μεγάλα για αλλεργίες φαγητού.. ρωτάς
// κάπου ποιο πριν για αλεργίες γενικά και για ινσουλίνη κ τέτοια..
// πρέπει να το βάλεις και εδώ". Safety-critical context — the
// chef + hostess + bartender all read the brief; missing an
// allergy here because it was buried in Health & Safety is the
// kind of mistake that turns a charter into a hospital visit.
//
// Behaviour:
//   • Fetches /api/cabin/brief/health on mount.
//   • If health section has allergies_dietary, medications_onboard,
//     or medical_conditions filled, renders a gold-bordered alert
//     at the top of the page with the verbatim text.
//   • If nothing entered, renders a quieter reminder linking to
//     /cabin/brief/health to fill it in.
//   • Always present — never hidden — because absence of allergies
//     is itself information the cook needs.

import { useEffect, useState } from "react";
import Link from "next/link";

// 2026-05-23 — Multi-user Brief (Phase 3): the alert now has two
// data sources.
//   • source="health" (default) — the principal's brief health
//     section. Shows the group's collective allergy / medical
//     info on every food-related page of the principal brief.
//   • source="self"             — the calling member's OWN
//     personal_details from /api/cabin/me. Used on the guest
//     contribution pages (/cabin/me/at-the-table,
//     /cabin/me/in-the-cellar) so a guest like Vasilis who
//     entered "Nuts" in his /me page sees HIS allergy reflected
//     at the top — not the principal's (which would read as
//     blank to him and create a dangerous false sense that the
//     boat doesn't know about his allergy).
export default function AllergyAlert({ source = "health" }) {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (source === "self") {
          const r = await fetch("/api/cabin/me", {
            credentials: "same-origin",
          });
          if (!r.ok) throw new Error("load-failed");
          const j = await r.json();
          if (cancelled) return;
          const pd = j?.member?.personal_details ?? {};
          // Compose the guest-side payload into the same shape the
          // render code below expects. medications + medical
          // conditions don't live on /me yet — leave them blank.
          // dietary_preferences is an array; render alongside the
          // free-text allergies field as a comma-joined sentence.
          const dietary = Array.isArray(pd.dietary_preferences)
            ? pd.dietary_preferences.filter(Boolean).join(", ")
            : "";
          const allergiesText = [
            (pd.allergies_dietary || "").trim(),
            dietary,
          ]
            .filter(Boolean)
            .join(" · ");
          setData({
            allergies_dietary: allergiesText,
            medical_conditions: "",
            medications_onboard: "",
          });
          setLoaded(true);
          return;
        }

        const r = await fetch("/api/cabin/brief/health", {
          credentials: "same-origin",
        });
        if (!r.ok) throw new Error("load-failed");
        const j = await r.json();
        if (!cancelled) {
          setData(j?.data ?? {});
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setData({});
          setLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (!loaded) return null;

  const allergies = (data?.allergies_dietary || "").trim();
  const meds = (data?.medications_onboard || "").trim();
  const conditions = (data?.medical_conditions || "").trim();
  const anyContent = allergies || meds || conditions;

  // Copy + edit-link targets differ between the two sources.
  const isSelf = source === "self";
  const chipLabel = isSelf
    ? "Your allergies & dietary"
    : "Allergies & medical";
  const editHref = isSelf ? "/cabin/me" : "/cabin/brief/health";
  const editLabel = isSelf
    ? anyContent
      ? "Edit in your details"
      : "Add in your details"
    : anyContent
      ? "Edit in Health & Safety"
      : "Add in Health & Safety";
  const emptyCopy = isSelf
    ? "You haven't recorded any allergies or dietary notes in your own details yet. If you eat freely with no concerns, that's information too — leave your details blank and the chef will treat you as a clean sheet."
    : "You haven't added any allergies or medical notes yet. If everyone in the group eats freely with no concerns, that's information too — leave Health & Safety blank and we'll treat it as a clean sheet.";
  const footerCopy = isSelf
    ? "The chef and hostess read this before every meal. If anything here is life-threatening, please add it to your details — the captain's printed crew-list copy lives there."
    : "The chef and hostess read this before every meal. If any of it is life-threatening, please add it to Health & Safety as well — that's where the captain's printed copy lives.";

  return (
    <aside
      className={"cabin-allergy-alert" + (anyContent ? " has-content" : "")}
      role="note"
    >
      <header>
        <span className="cabin-allergy-alert__chip">{chipLabel}</span>
        <Link href={editHref} className="cabin-allergy-alert__edit">
          {editLabel}
        </Link>
      </header>
      {anyContent ? (
        <div className="cabin-allergy-alert__body">
          {allergies && (
            <p>
              <strong>Allergies / dietary:</strong> {allergies}
            </p>
          )}
          {conditions && (
            <p>
              <strong>Medical conditions:</strong> {conditions}
            </p>
          )}
          {meds && (
            <p>
              <strong>Medications on board:</strong> {meds}
            </p>
          )}
          <p className="cabin-allergy-alert__footer">{footerCopy}</p>
        </div>
      ) : (
        <p className="cabin-allergy-alert__empty">{emptyCopy}</p>
      )}

      <style jsx>{`
        .cabin-allergy-alert {
          margin: 0 0 28px 0;
          border-left: 3px solid var(--gy-gold);
          background: rgba(201, 168, 76, 0.05);
          padding: 16px 18px 14px 18px;
        }
        .cabin-allergy-alert.has-content {
          background: rgba(201, 168, 76, 0.1);
        }
        .cabin-allergy-alert header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .cabin-allergy-alert__chip {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
        }
        .cabin-allergy-alert__edit {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.6);
          text-decoration: none;
          border-bottom: 1px solid rgba(13, 27, 42, 0.2);
        }
        .cabin-allergy-alert__edit:hover {
          color: var(--gy-navy);
          border-bottom-color: var(--gy-gold);
        }
        .cabin-allergy-alert__body p {
          font-family: var(--gy-font-body);
          font-size: 14.5px;
          color: var(--gy-navy);
          line-height: 1.55;
          margin: 4px 0;
        }
        .cabin-allergy-alert__body strong {
          font-weight: 600;
        }
        .cabin-allergy-alert__footer {
          margin-top: 10px !important;
          font-style: italic;
          color: rgba(13, 27, 42, 0.6) !important;
          font-size: 13px !important;
        }
        .cabin-allergy-alert__empty {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          font-style: italic;
          color: rgba(13, 27, 42, 0.65);
          line-height: 1.55;
          margin: 0;
        }
      `}</style>
    </aside>
  );
}
