// Section 01 — Arrival & Departure
"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  RadioGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function ArrivalSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section One · Arrival & Departure"
        title="Getting there,"
        italic="getting home."
      />
      <IntroParagraph>
        The smallest details — what time your flight lands in Greece, where you
        would like to be picked up — make the biggest difference. Tell us as
        much as you know now; we can refine closer to the date. Skip anything
        you don&apos;t know yet — everything saves as you type.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="arrival"
        nextSection={{ key: "guests", title: "Your Group" }}
      >
        {({ register }) => (
          <>
            {/* 2026-05-20 — Eleanna + Da$k friend-tests both flagged that
                the first questions on the arrival section don't make it
                obvious WHAT to fill in. Adding a small explainer above
                the fields so a first-time reader knows the questions are
                about THEIR flight INTO Greece, not the charter dates. */}
            <h2 className="brief-subhead">01 · Your flight into Greece</h2>
            <p className="brief-help">
              Most charterers arrive by commercial flight to Athens (ATH) or a
              regional airport (e.g. Mykonos, Heraklion). Fill in what you know
              about the flight that brings you into the country — even
              partial details help the captain plan transfers.
            </p>
            <div className="brief-grid">
              <TextField
                label="Date your flight arrives"
                hint="The day you land in Greece, not the day you board the yacht."
                name="flight_group_1.date_of_arrival"
                register={register}
                type="date"
              />
              <TextField
                label="Time of arrival (local Greek time)"
                placeholder="e.g. 14:35"
                name="flight_group_1.time_of_arrival"
                register={register}
              />
              <TextField
                label="Airline & flight number"
                hint="If you don't have a ticket yet, leave blank."
                name="flight_group_1.airline_and_flight"
                placeholder="e.g. LH 1283"
                register={register}
              />
              <TextField
                label="Departing from (city)"
                name="flight_group_1.coming_from"
                placeholder="e.g. Munich"
                register={register}
              />
              <TextField
                label="How many guests on this flight"
                hint="If your group flies in together, the full count. If some arrive separately, use the second flight group below."
                name="flight_group_1.number_of_guests"
                type="number"
                inputMode="numeric"
                register={register}
              />
            </div>

            <details className="brief-details">
              <summary>Some guests arriving on a different flight? Add a second group</summary>
              <div className="brief-grid">
                <TextField label="Date your flight arrives" name="flight_group_2.date_of_arrival" register={register} type="date" />
                <TextField label="Time of arrival (local Greek time)" name="flight_group_2.time_of_arrival" register={register} />
                <TextField label="Airline & flight number" name="flight_group_2.airline_and_flight" register={register} />
                <TextField label="Departing from (city)" name="flight_group_2.coming_from" register={register} />
                <TextField label="How many guests on this flight" name="flight_group_2.number_of_guests" type="number" register={register} />
              </div>
            </details>

            <RadioGroup
              name="flight_group_1.flight_type"
              label="Flight type (first group)"
              register={register}
              options={[
                { value: "commercial", label: "Commercial flight" },
                { value: "private",    label: "Private flight (we coordinate FBO pickup)" },
              ]}
            />

            <OpenTextarea
              label="Any private jet, helicopter, or other arrivals?"
              hint="Tell us here — we can coordinate with the captain."
              name="private_arrival_notes"
              register={register}
              rows={2}
            />

            <OpenTextarea
              label="Your group's previous sailing experience"
              hint="The captain calibrates the safety briefing and the daily rhythm around this. First-charter through 'I race J/70s' is all useful."
              name="yachting_experience"
              register={register}
              rows={3}
              placeholder="e.g. First charter for most of the group; one guest has crewed Atlantic crossings."
            />

            <h2 className="brief-subhead">02 · Where you’re staying</h2>
            <div className="brief-grid">
              <TextField
                label="Hotel before embarkation"
                name="before_embarkation.hotel_or_address"
                placeholder="Hotel or address"
                register={register}
              />
              <TextField
                label="Check-out date"
                name="before_embarkation.check_out_date"
                type="date"
                register={register}
              />
              <TextField
                label="Hotel after disembarkation"
                name="after_disembarkation.hotel_or_address"
                register={register}
              />
              <TextField
                label="Check-in date"
                name="after_disembarkation.check_in_date"
                type="date"
                register={register}
              />
            </div>

            <h2 className="brief-subhead">03 · Transfers</h2>
            <RadioGroup
              name="transfers_requested"
              label="Would you like us to arrange transfers?"
              register={register}
              options={[
                { value: "yes", label: "Yes, please arrange" },
                { value: "no", label: "No, we will handle our own" },
                { value: "undecided", label: "We’ll decide closer to the date" },
              ]}
            />

            <details className="brief-details">
              <summary>If yes — transfer details</summary>
              <div className="brief-grid">
                <TextField label="Pickup location to yacht" name="transfer_to_yacht.pickup_location" register={register} />
                <TextField label="Pickup date & time" name="transfer_to_yacht.pickup_datetime" register={register} />
                <TextField label="Number of guests" name="transfer_to_yacht.number_of_guests" type="number" register={register} />
                <TextField label="Drop-off location from yacht" name="transfer_from_yacht.dropoff_location" register={register} />
                <TextField label="Drop-off date & time" name="transfer_from_yacht.dropoff_datetime" register={register} />
                <TextField label="Number of guests" name="transfer_from_yacht.number_of_guests" type="number" register={register} />
              </div>
            </details>

            <p className="brief-note">
              <em>
                George Yachts works with licensed luxury chauffeur partners
                in Athens. We will confirm vehicles and drivers a week before
                embarkation.
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
          margin: 32px 0 16px 0;
          font-weight: 500;
        }
        .brief-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0 24px;
          }
        }
        .brief-details {
          margin: 12px 0 22px 0;
          padding: 0;
        }
        .brief-details > summary {
          cursor: pointer;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          padding: 8px 0;
          list-style: none;
        }
        .brief-details > summary::before {
          content: "+ ";
          color: var(--gy-gold);
        }
        .brief-details[open] > summary::before { content: "− "; }
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 8px 0 0 0;
        }
        .brief-note em { font-style: italic; }
        /* 2026-05-20 — friend-test fix: explainer paragraph that sits
           between the subhead and the first form field on the arrival
           page. Slightly smaller and dimmer than the IntroParagraph at
           the very top so the visual hierarchy stays clean. */
        .brief-help {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.55;
          color: rgba(13, 27, 42, 0.72);
          margin: 0 0 18px 0;
          font-style: italic;
        }
      `}</style>
    </article>
  );
}
