"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import AllergyAlert from "../../../../components/cabin/brief/AllergyAlert";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  RadioGroup,
  CheckboxGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function ChildrenSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="For your youngest guests"
        title="The little"
        italic="sailors."
      />
      <IntroParagraph>
        Children are honoured guests aboard. The crew prepares differently
        when little ones are sailing — softer towels, swim aids,
        age-appropriate snacks, quieter evenings if needed. Tell us about
        each child.
      </IntroParagraph>

      {/* 2026-05-20 — Allergy banner — children food allergies are
          the highest-stakes case (insulin, peanut, anaphylactic
          shellfish). Da$k friend-test flagged this explicitly. */}
      <AllergyAlert />

      <BriefFormShell sectionKey="children" prevSection={{ key: "little_things", title: "The Little Things" }}>
        {({ register, watch }) => (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ChildBlock key={i} register={register} index={i} watch={watch} />
            ))}
            <h2 className="brief-subhead">Equipment the crew should prepare</h2>
            <CheckboxGroup
              name="equipment"
              register={register}
              twoColumn
              label=""
              options={[
                { value: "baby_cot", label: "Baby cot / travel crib" },
                { value: "high_chair", label: "High chair" },
                { value: "kids_life_jackets", label: "Children’s life jackets" },
                { value: "pool_toys", label: "Pool noodles, inflatables, beach toys" },
                { value: "bedtime_books", label: "Bedtime books" },
                { value: "baby_food", label: "Specific formula / baby food" },
                { value: "other", label: "Other (write below)" },
              ]}
            />
            <OpenTextarea label="Equipment notes" name="equipment_other" register={register} rows={2} />
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
          margin: 28px 0 10px 0;
          font-weight: 500;
        }
      `}</style>
    </article>
  );
}

function ChildBlock({ register, index, watch }) {
  const nameVal = watch(`children.${index}.name`);
  const ageVal = watch(`children.${index}.age`);
  const populated = nameVal || ageVal;

  return (
    <details open={index === 0 || populated} className="child-block">
      <summary>
        <span className="child-block__num">Child {String(index + 1).padStart(2, "0")}</span>
        {populated && nameVal && <span className="child-block__name">{nameVal}</span>}
      </summary>
      <div className="child-block__body">
        <div className="brief-grid">
          <TextField label="Name" name={`children.${index}.name`} register={register} />
          <TextField label="Age" name={`children.${index}.age`} type="number" register={register} />
        </div>
        <OpenTextarea label="Allergies (repeat from Health section)" name={`children.${index}.allergies_repeat`} register={register} rows={2} />
        <OpenTextarea label="Favourite foods" name={`children.${index}.favourite_foods`} register={register} rows={2} />
        <OpenTextarea label="Foods to avoid" name={`children.${index}.foods_avoid`} register={register} rows={2} />
        <OpenTextarea label="Activities they love" name={`children.${index}.activities_loves`} register={register} rows={2} />
        <RadioGroup
          name={`children.${index}.sleeps_with_parent`}
          label="Sleeps with parent in cabin?"
          register={register}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <TextField label="Bedtime preference" name={`children.${index}.bedtime_preference`} register={register} placeholder="e.g. 20:30" />
      </div>

      <style jsx>{`
        .child-block {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          margin-bottom: 12px;
        }
        .child-block > summary {
          padding: 14px 18px;
          cursor: pointer;
          list-style: none;
          display: flex;
          gap: 14px;
          align-items: baseline;
        }
        .child-block > summary::-webkit-details-marker { display: none; }
        .child-block__num {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
        }
        .child-block__name {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 16px;
          color: var(--gy-navy);
        }
        .child-block__body {
          padding: 4px 18px 18px;
          border-top: 1px solid rgba(13,27,42,0.05);
        }
        .brief-grid { display: grid; grid-template-columns: 1fr 100px; gap: 0 18px; }
      `}</style>
    </details>
  );
}
