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
        The smallest details — what time your flight lands, where you would
        like to be picked up — make the biggest difference. Tell us as much
        as you know now; we can refine closer to the date.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="arrival"
        nextSection={{ key: "guests", title: "Your Group" }}
      >
        {({ register }) => (
          <>
            <h2 className="brief-subhead">01 · Your arrival</h2>
            <div className="brief-grid">
              <TextField
                label="Date of arrival"
                name="flight_group_1.date_of_arrival"
                register={register}
                type="date"
              />
              <TextField
                label="Time of arrival"
                name="flight_group_1.time_of_arrival"
                placeholder="e.g. 14:35"
                register={register}
              />
              <TextField
                label="Airline & flight number"
                name="flight_group_1.airline_and_flight"
                placeholder="e.g. LH 1283"
                register={register}
              />
              <TextField
                label="Coming from (city)"
                name="flight_group_1.coming_from"
                placeholder="e.g. Munich"
                register={register}
              />
              <TextField
                label="Guests on this flight"
                name="flight_group_1.number_of_guests"
                type="number"
                inputMode="numeric"
                register={register}
              />
            </div>

            <details className="brief-details">
              <summary>Add a second flight group</summary>
              <div className="brief-grid">
                <TextField label="Date of arrival" name="flight_group_2.date_of_arrival" register={register} type="date" />
                <TextField label="Time of arrival" name="flight_group_2.time_of_arrival" register={register} />
                <TextField label="Airline & flight number" name="flight_group_2.airline_and_flight" register={register} />
                <TextField label="Coming from (city)" name="flight_group_2.coming_from" register={register} />
                <TextField label="Guests on this flight" name="flight_group_2.number_of_guests" type="number" register={register} />
              </div>
            </details>

            <OpenTextarea
              label="Any private jet, helicopter, or other arrivals?"
              hint="Tell us here — we can coordinate with the captain."
              name="private_arrival_notes"
              register={register}
              rows={2}
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
      `}</style>
    </article>
  );
}
