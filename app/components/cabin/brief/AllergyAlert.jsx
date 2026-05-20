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

export default function AllergyAlert() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
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
  }, []);

  if (!loaded) return null;

  const allergies = (data?.allergies_dietary || "").trim();
  const meds = (data?.medications_onboard || "").trim();
  const conditions = (data?.medical_conditions || "").trim();
  const anyContent = allergies || meds || conditions;

  return (
    <aside
      className={"cabin-allergy-alert" + (anyContent ? " has-content" : "")}
      role="note"
    >
      <header>
        <span className="cabin-allergy-alert__chip">Allergies & medical</span>
        <Link href="/cabin/brief/health" className="cabin-allergy-alert__edit">
          {anyContent ? "Edit in Health & Safety" : "Add in Health & Safety"}
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
          <p className="cabin-allergy-alert__footer">
            The chef and hostess read this before every meal. If any of
            it is life-threatening, please add it to Health & Safety as
            well — that's where the captain's printed copy lives.
          </p>
        </div>
      ) : (
        <p className="cabin-allergy-alert__empty">
          You haven&apos;t added any allergies or medical notes yet. If
          everyone in the group eats freely with no concerns, that&apos;s
          information too — leave Health & Safety blank and we&apos;ll
          treat it as a clean sheet.
        </p>
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
