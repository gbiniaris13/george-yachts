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

// 2026-05-23 — Multi-user Brief (Phase 3): the alert has three
// data sources now.
//   • source="health" (default) — the principal's brief health
//     section ONLY. Kept for back-compat but no longer used on
//     any cabin surface (replaced by "aggregate").
//   • source="self"             — the calling member's OWN
//     personal_details from /api/cabin/me. Used on the guest
//     contribution pages (/cabin/me/at-the-table etc.) so each
//     guest sees their own allergy reflected at the top.
//   • source="aggregate"        — pulls /api/cabin/brief/group-
//     allergies which combines the principal's Health section AND
//     every member's personal_details. Renders one block per
//     member with their name so the chef knows "Nuts (Bill),
//     pineapple (Olga)". This is what George needs on the
//     principal's brief pages so the group's full allergy picture
//     surfaces in one place.
export default function AllergyAlert({ source = "health" }) {
  const [data, setData] = useState(null);
  const [aggregate, setAggregate] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (source === "aggregate") {
          const r = await fetch("/api/cabin/brief/group-allergies", {
            credentials: "same-origin",
          });
          if (!r.ok) throw new Error("load-failed");
          const j = await r.json();
          if (cancelled) return;
          setAggregate(j);
          setLoaded(true);
          return;
        }

        if (source === "self") {
          const r = await fetch("/api/cabin/me", {
            credentials: "same-origin",
          });
          if (!r.ok) throw new Error("load-failed");
          const j = await r.json();
          if (cancelled) return;
          const pd = j?.member?.personal_details ?? {};
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

  // -------------------- AGGREGATE PATH --------------------
  // Render path is different enough from health/self that we
  // branch early. Header + footer copy adapted for the group
  // perspective.
  if (source === "aggregate") {
    const sectionAllergies = (aggregate?.section?.allergies || "").trim();
    const sectionConditions = (aggregate?.section?.medical_conditions || "").trim();
    const sectionMeds = (aggregate?.section?.medications_onboard || "").trim();
    const memberLines = Array.isArray(aggregate?.members)
      ? aggregate.members
      : [];
    const counts = aggregate?.counts || { total: 0, withData: 0, clean: 0 };
    const anyContent =
      sectionAllergies ||
      sectionConditions ||
      sectionMeds ||
      memberLines.length > 0;

    return (
      <aside
        className={
          "cabin-allergy-alert" + (anyContent ? " has-content" : "")
        }
        role="note"
      >
        <header>
          <span className="cabin-allergy-alert__chip">
            Group allergies & medical
          </span>
          <Link
            href="/cabin/brief/health"
            className="cabin-allergy-alert__edit"
          >
            Edit Health & Safety
          </Link>
        </header>

        {anyContent ? (
          <div className="cabin-allergy-alert__body">
            {(sectionAllergies || sectionConditions || sectionMeds) && (
              <div className="cabin-allergy-alert__section">
                <span className="cabin-allergy-alert__section-eyebrow">
                  From the group&apos;s Health &amp; Safety section
                </span>
                {sectionAllergies && (
                  <p>
                    <span className="cabin-allergy-alert__label">
                      Allergies / dietary
                    </span>{" "}
                    - {sectionAllergies}
                  </p>
                )}
                {sectionConditions && (
                  <p>
                    <span className="cabin-allergy-alert__label">
                      Medical conditions
                    </span>{" "}
                    - {sectionConditions}
                  </p>
                )}
                {sectionMeds && (
                  <p>
                    <span className="cabin-allergy-alert__label">
                      Medications on board
                    </span>{" "}
                    - {sectionMeds}
                  </p>
                )}
              </div>
            )}

            {memberLines.length > 0 && (
              <div className="cabin-allergy-alert__section">
                <span className="cabin-allergy-alert__section-eyebrow">
                  From individual guests
                </span>
                {memberLines.map((m) => {
                  const dietary = (m.dietary || []).join(", ");
                  const both = [m.allergies, dietary].filter(Boolean).join(" · ");
                  return (
                    <p key={m.memberId}>
                      <em className="cabin-allergy-alert__name">{m.name}</em>{" "}
                      - {both}
                    </p>
                  );
                })}
              </div>
            )}

            <p className="cabin-allergy-alert__footer">
              The chef and hostess read this before every meal.{" "}
              {counts.clean > 0 && (
                <>
                  ({counts.clean} of {counts.total}{" "}
                  {counts.total === 1 ? "member has" : "members have"} no
                  allergy or dietary preference on file - invite anyone
                  missing to share their details from the cabin home.)
                </>
              )}
            </p>
          </div>
        ) : (
          <p className="cabin-allergy-alert__empty">
            No-one in your group has shared allergies, dietary or
            medical info yet. As guests fill in their details (or as
            you fill the Health &amp; Safety section), their facts
            will surface here so the chef and hostess have the full
            picture in one place.
          </p>
        )}

        {/* 2026-05-25 — Phase 4: was `<style jsx>{styles}</style>`.
            styled-jsx can't extract CSS when the children expression
            is a variable reference to a module-level const (verified
            in browser: zero matching rules in any stylesheet → all
            .cabin-allergy-alert* selectors un-styled, content
            collapsed to browser defaults, "Your allergies & dietary"
            ran straight into "Edit in your details" with no space).
            Plain `<style dangerouslySetInnerHTML />` always works:
            React renders a real DOM <style> tag the browser parses
            normally, no styled-jsx transform needed. */}
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </aside>
    );
  }

  // -------------------- HEALTH / SELF PATH --------------------
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
    ? "You haven't recorded any allergies or dietary notes in your own details yet. If you eat freely with no concerns, that's information too - leave your details blank and the chef will treat you as a clean sheet."
    : "You haven't added any allergies or medical notes yet. If everyone in the group eats freely with no concerns, that's information too - leave Health & Safety blank and we'll treat it as a clean sheet.";
  const footerCopy = isSelf
    ? "The chef and hostess read this before every meal. If anything here is life-threatening, please add it to your details - the captain's printed crew-list copy lives there."
    : "The chef and hostess read this before every meal. If any of it is life-threatening, please add it to Health & Safety as well - that's where the captain's printed copy lives.";

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

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </aside>
  );
}

// 2026-05-24 — Was `<style jsx>{styles}</style>` (scoped). When
// styled-jsx receives a template literal stored in a module
// const (not inline at the JSX site), the class-scoping pass
// can't rewrite the rules to match the auto-generated jsx-XXX
// class names. The card lost its background, border and
// padding — George saw it as plain unstyled text. Switching
// to `<style jsx global>` makes the rules unscoped — they
// match the literal class names I use (.cabin-allergy-alert*)
// without any auto-rewriting. Safe: AllergyAlert is the only
// component using these class names anywhere in the codebase.
const styles = `
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
    font-size: 10.5px;
    letter-spacing: 2.6px;
    text-transform: uppercase;
    color: var(--gy-gold);
    font-weight: 500;
  }
  .cabin-allergy-alert__edit {
    font-family: var(--gy-font-ui);
    font-size: 10.5px;
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
  /* Aggregate sub-blocks: principal-section facts + per-member
     facts each get their own quiet eyebrow + paragraph stack. */
  .cabin-allergy-alert__section {
    margin: 4px 0 10px 0;
  }
  .cabin-allergy-alert__section + .cabin-allergy-alert__section {
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px dashed rgba(201, 168, 76, 0.32);
  }
  .cabin-allergy-alert__section-eyebrow {
    display: block;
    font-family: var(--gy-font-editorial, Georgia, serif);
    font-style: italic;
    font-size: 12.5px;
    letter-spacing: 0.2px;
    text-transform: none;
    color: rgba(13, 27, 42, 0.55);
    font-weight: 400;
    margin-bottom: 8px;
  }
  .cabin-allergy-alert__body p,
  .cabin-allergy-alert__section p {
    font-family: var(--gy-font-editorial, Georgia, serif);
    font-size: 14.5px;
    color: var(--gy-navy);
    line-height: 1.65;
    margin: 5px 0;
    font-weight: 400;
  }
  /* 2026-05-24 - Replaced heavy <strong> labels with quieter
     small-caps spans + em-dash separators. Per George: heavy
     bold reads as out of style. The label name now carries
     weight via tracking + small caps, not stroke weight. */
  .cabin-allergy-alert__label {
    font-family: var(--gy-font-ui);
    font-size: 11px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: rgba(13, 27, 42, 0.75);
    font-weight: 500;
  }
  .cabin-allergy-alert__name {
    font-family: var(--gy-font-editorial, Georgia, serif);
    font-style: italic;
    font-size: 15.5px;
    color: var(--gy-navy);
    font-weight: 400;
    letter-spacing: 0.1px;
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
`;
