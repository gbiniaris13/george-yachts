// Section 01 — Arrival & Departure
"use client";

// 2026-05-20 — Friend-test pass 2. Heavy rewrite based on George's
// "θέλω πολύ εύκολο, πολύ friendly" direction:
//
//   - Removed "Flight type (commercial / private)" radio
//     ("συνήθως commercial ταξιδεύουν. Αν κάποιος ταξιδέψει με
//      ιδιωτικό τζετ θα μας το πει").
//
//   - Removed the "Any private jet, helicopter, or other arrivals?"
//     textarea ("Δεν καταλαβαίνω τι είναι αυτό το πράγμα — βγάλ' το").
//
//   - Removed the "Your group's previous sailing experience" textarea
//     with the "captain calibrates the safety briefing..." copy
//     ("εδώ το κείμενο πάλι είναι περίεργο, και αυτό πρέπει να βγει").
//
//   - Collapsed "Where you're staying" from a 4-field grid (hotel
//     before + check-out date + hotel after + check-in date) into a
//     single optional textarea, because "οι περισσότεροι δεν θα
//     μένουν πουθενά, θα πάνε από το αεροδρόμιο στο σκάφος".
//
//   - Field layout changed from 2-column grid to a single calm
//     column. George flagged the grid as "ανακατεμένα — η ώρα είναι
//     πάνω δεξιά, η ημερομηνία μετά, δεν βγάζει οργάνωση".
//
//   - Dropped the "01 · / 02 · / 03 ·" numbered subheads — visual
//     noise that wasn't earning its keep.
//
//   - Friendlier copy throughout. Short sentences, plain Greek-style
//     English ("πότε φτάνεις στην Ελλάδα, τι ώρα").
//
// Schema unchanged (flight_type / private_arrival_notes /
// yachting_experience / before_embarkation / after_disembarkation
// all remain in lib/cabin/schemas.js) so already-submitted briefs
// keep validating. Only the UI surface stopped collecting them.

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
        A few simple questions about your flight into Greece. Skip
        anything you don&apos;t know yet — every field saves as you
        type, and you can come back any time.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="arrival"
        nextSection={{ key: "guests", title: "Your Group" }}
      >
        {({ register }) => (
          <>
            <h2 className="brief-subhead">Your flight</h2>

            <div className="brief-stack">
              <TextField
                label="When you land in Greece"
                name="flight_group_1.date_of_arrival"
                register={register}
                type="date"
              />
              <TextField
                label="What time you land (local Greek time)"
                placeholder="e.g. 14:35"
                name="flight_group_1.time_of_arrival"
                register={register}
              />
              <TextField
                label="Flight number"
                placeholder="e.g. LH 1283"
                name="flight_group_1.airline_and_flight"
                register={register}
              />
              <TextField
                label="Departure airport (city you fly from)"
                placeholder="e.g. Munich"
                name="flight_group_1.coming_from"
                register={register}
              />
              <TextField
                label="How many guests on this flight"
                name="flight_group_1.number_of_guests"
                type="number"
                inputMode="numeric"
                register={register}
              />
            </div>

            <details className="brief-details">
              <summary>Some guests arriving on a different flight? Add a second group</summary>
              <div className="brief-stack">
                <TextField label="When they land in Greece" name="flight_group_2.date_of_arrival" register={register} type="date" />
                <TextField label="What time they land" name="flight_group_2.time_of_arrival" register={register} />
                <TextField label="Flight number" name="flight_group_2.airline_and_flight" register={register} />
                <TextField label="Departure airport" name="flight_group_2.coming_from" register={register} />
                <TextField label="How many guests on this flight" name="flight_group_2.number_of_guests" type="number" register={register} />
              </div>
            </details>

            <h2 className="brief-subhead">Before you board (optional)</h2>
            <OpenTextarea
              label="Staying somewhere before the yacht?"
              hint="Most groups go straight from the airport to the yacht. If you're spending a night or two ashore first, share the hotel name + address here so the captain knows where to pick you up. Leave blank if you go directly to the yacht."
              name="before_embarkation.hotel_or_address"
              placeholder="e.g. Grande Bretagne, Syntagma Square, Athens — checking out Saturday morning."
              register={register}
              rows={3}
            />

            <h2 className="brief-subhead">Transfers</h2>
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
              <div className="brief-stack">
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
          margin: 36px 0 16px 0;
          font-weight: 500;
        }
        /* 2026-05-20 — Was .brief-grid (2-column grid on desktop).
           George flagged that as "ανακατεμένα" — fields didn't read
           in a clean top-to-bottom order. Single-column stack reads
           like a conversation. */
        .brief-stack {
          display: flex;
          flex-direction: column;
          gap: 0;
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
