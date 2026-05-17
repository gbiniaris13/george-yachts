"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  OpenTextarea,
  RadioGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function LittleThingsSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Eight · Closing Notes"
        title="The little"
        italic="things."
      />
      <IntroParagraph>
        This is the page that often matters most. Anything we haven’t asked,
        anything you want the crew to know, anything that would turn a
        wonderful week into an unforgettable one — write it here.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="little_things"
        prevSection={{ key: "beverages", title: "In the Cellar" }}
        isLastSection
      >
        {({ register }) => (
          <>
            <OpenTextarea
              label="Anything to surprise someone with?"
              hint="A particular bottle waiting in a cabin, a song playing the first morning, a personalised cake for a birthday already mentioned. The smaller the touch, the more it lands."
              name="surprises_celebrations"
              register={register}
              rows={5}
            />
            <OpenTextarea
              label="Anything we should avoid?"
              hint="Music styles that don’t sit well, conversation topics to keep light, things that have gone wrong on past charters. Honest notes help us serve you better."
              name="things_to_avoid"
              register={register}
              rows={4}
            />
            <RadioGroup
              name="connectivity"
              label="Internet & connectivity"
              hint="Most yachts carry Starlink or similar. Tell us if anyone needs reliable connectivity for work or calls."
              register={register}
              options={[
                { value: "strong_internet", label: "We want strong internet throughout" },
                { value: "fine_not_priority", label: "Internet is fine, but not a priority" },
                { value: "no_photos_of_guests", label: "No photography of guests, please" },
              ]}
            />
            <RadioGroup
              name="photo_archive_permission"
              label="Photographs for our small archive"
              hint="Your week’s photographs always live in your private Voyage Album. With your permission, we’d also love to keep a few in our quiet archive — handled with care, only used at our level (never social-broadcast). You decide; we never assume."
              register={register}
              options={[
                { value: "yes_archive_ok",   label: "Yes — you may keep a few for your archive" },
                { value: "yes_no_faces",     label: "Yes — but only photographs that don’t show our faces" },
                { value: "no_only_for_us",   label: "No — keep them only inside our Cabin" },
              ]}
            />
            <OpenTextarea
              label="Any final notes"
              hint="Whatever feels worth telling us. There is no wrong answer."
              name="anything_else"
              register={register}
              rows={6}
            />
            <p className="lt-extras-note">
              <strong>A small note on extras.</strong> Some requests across
              the brief (special wines, premium spirits, certain provisioning
              touches) may sit outside what’s included in your charter fee.
              If anything you’ve asked for falls into that category, we’ll
              tell you up-front so you can decide — never a surprise on the
              final account.
            </p>
          </>
        )}
      </BriefFormShell>

      <style jsx>{`
        .lt-photo-note,
        .lt-extras-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.65);
          background: rgba(201, 168, 76, 0.06);
          border-left: 1px solid var(--gy-gold);
          padding: 14px 18px;
          margin: 18px 0 8px 0;
        }
        .lt-extras-note strong {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }
      `}</style>
    </article>
  );
}
