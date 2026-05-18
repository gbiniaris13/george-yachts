// /cabin/before-you-sail — Zig's pre-charter content drip.
// Server component. Weather is fetched at request time (cached
// 1h via Next's fetch revalidate). No external API key needed.

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { lookupPort, fetchDailyForecast, decodeWeatherCode } from "@/lib/cabin/weather";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Before you sail · Your Cabin" };

function fmtDay(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return {
    day: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
  };
}

const GREEK_PHRASES = [
  { gr: "Καλημέρα",  en: "Kaliméra",  meaning: "Good morning (and good day)" },
  { gr: "Καλησπέρα", en: "Kalispéra", meaning: "Good evening" },
  { gr: "Ευχαριστώ", en: "Efharistó", meaning: "Thank you" },
  { gr: "Παρακαλώ",  en: "Parakaló",  meaning: "Please / you're welcome" },
  { gr: "Γεια μας",  en: "Yiá mas",   meaning: "Cheers (to our health)" },
  { gr: "Στην υγειά σας", en: "Stin iyiá sas", meaning: "To your health" },
  { gr: "Ωραίο",     en: "Oréo",      meaning: "Beautiful / lovely" },
  { gr: "Νόστιμο",   en: "Nóstimo",   meaning: "Delicious" },
  { gr: "Σιγά σιγά", en: "Sigá sigá", meaning: "Slowly, slowly (a way of life)" },
  { gr: "Φιλότιμο",  en: "Filotimo",  meaning: "Doing the right thing because of who you are" },
];

const PACKING = {
  Essentials: [
    "Passport (we already have the details, but bring the document)",
    "Travel insurance documentation",
    "Prescription medication in original packaging — accessible, not in checked luggage",
    "Reef-safe sunscreen (SPF 30+, the sun is strong)",
    "Sunglasses with strap; a wide-brimmed hat for noon hours",
  ],
  "Clothing": [
    "Two or three swimsuits — they barely dry between dips",
    "A light cotton or linen wardrobe for sun-warmed days",
    "Wind jacket for evening crossings",
    "One smart-casual outfit if you'd like a refined dinner ashore",
    "Soft-soled or barefoot shoes only on deck (non-marking)",
  ],
  "Pleasures": [
    "Book or e-reader for the long afternoons at anchor",
    "Bluetooth speaker if you want to choose every soundtrack yourself",
    "Camera or phone — there is no shortage of moments",
    "Reusable water bottle (we keep them cold)",
  ],
  "Please leave at home": [
    "Tanning oils and gels — they stain the boat's fabrics",
    "Hard-shell luggage if you can — soft duffels stow better",
    "Anything you would not like sea spray on",
  ],
};

export default async function BeforeYouSailPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");
  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins")
      .select("port_embarkation, charter_period_from, charter_period_to")
      .eq("id", cabinId)
      .maybeSingle()
  );

  // Pull itinerary preference too — if the charterer left routing
  // to the captain, we shouldn't pretend to know the weather of
  // their actual islands. A polite caveat replaces the forecast.
  const itinerary = await dbQuery(
    db.from("cabin_brief_sections")
      .select("data")
      .eq("cabin_id", cabinId)
      .eq("section_key", "itinerary")
      .maybeSingle()
  );
  const captainDecides =
    itinerary?.data?.night_preference === "captain_decides" ||
    !itinerary?.data?.preferred_areas?.length;

  // Try to fetch weather for the embarkation port. Silent fallback.
  let forecast = null;
  let portLabel = cabin?.port_embarkation || null;
  const port = lookupPort(cabin?.port_embarkation);
  if (port) {
    portLabel = port.label;
    try {
      forecast = await fetchDailyForecast({ lat: port.lat, lon: port.lon, days: 7 });
    } catch (err) {
      console.error("[before-you-sail] weather fetch:", err);
    }
  }

  return (
    <article>
      <SectionTitle
        kicker="Before you sail"
        title="A calm"
        italic="preparation."
      />
      <IntroParagraph>
        The week or so before embarkation, three small things help the most:
        a glance at the weather, a few phrases that delight the locals, and a
        quiet packing list. Nothing here is required — just a little less for
        you to think about.
      </IntroParagraph>

      {forecast && (
        <section className="bys-block">
          <h2 className="bys-label">Weather at {portLabel}</h2>
          <p className="bys-sub">
            {captainDecides ? (
              <>
                Seven-day outlook from Open-Meteo for your embarkation port
                only. Because the final route is being shaped together with
                your captain at arrival, the islands you actually visit may
                see different weather day-to-day — your captain follows live
                marine sources and adjusts the itinerary accordingly. Pack
                for warm days, breezy evenings, and the occasional gust.
              </>
            ) : (
              <>
                Seven-day outlook from Open-Meteo for your departure port.
                Your captain plans the daily route on this and his own
                marine sources — different islands often see different
                conditions, so this is best read as a flavour of the week,
                not a strict forecast.
              </>
            )}
          </p>
          <ul className="bys-weather">
            {forecast.map((d) => {
              const meta = decodeWeatherCode(d.code);
              const day = fmtDay(d.date);
              return (
                <li key={d.date}>
                  <div className="bys-weather__day">
                    <strong>{day.day}</strong>
                    <em>{day.date}</em>
                  </div>
                  <div className="bys-weather__glyph" aria-hidden>{meta.glyph}</div>
                  <div className="bys-weather__main">
                    <span className="bys-weather__label">{meta.label}</span>
                    <span className="bys-weather__temp">
                      {Math.round(d.tmax)}° / {Math.round(d.tmin)}°
                    </span>
                  </div>
                  <div className="bys-weather__wind">
                    {d.wind_kmh ? `${Math.round(d.wind_kmh)} km/h` : ""}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="bys-block">
        <h2 className="bys-label">A handful of Greek phrases</h2>
        <p className="bys-sub">
          Try one. The reception you get from a smiling taverna owner repays
          you many times over.
        </p>
        <ul className="bys-phrases">
          {GREEK_PHRASES.map((p) => (
            <li key={p.gr}>
              <strong className="bys-phrases__gr">{p.gr}</strong>
              <em className="bys-phrases__en">{p.en}</em>
              <span className="bys-phrases__meaning">{p.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bys-block">
        <h2 className="bys-label">A quiet packing list</h2>
        {Object.entries(PACKING).map(([group, items]) => (
          <div key={group} className="bys-pack-group">
            <h3>{group}</h3>
            <ul>
              {items.map((it) => (
                <li key={it}><span className="bys-pack-bullet" aria-hidden>·</span>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="bys-block">
        <h2 className="bys-label">A few quiet reminders</h2>
        <ul className="bys-reminders">
          <li>
            <strong>Passport &amp; cards.</strong> Passport, ATM cards, a
            credit card, and a little cash for shore mornings — small kiosks
            on the islands are often cash-only.
          </li>
          <li>
            <strong>Soft, foldable luggage.</strong> Cabins store soft bags
            beautifully; hard suitcases struggle. If you can, leave them at
            your hotel and bring a duffel aboard.
          </li>
          <li>
            <strong>Power.</strong> Yachts in Greece run 220V with European
            plugs. If your devices use a different standard, a small adapter
            saves a hunt on day one.
          </li>
          <li>
            <strong>Sunscreen.</strong> SPF 30 or higher for the first days.
            Please avoid tanning oils and gels — they stain teak.
          </li>
          <li>
            <strong>On board.</strong> Barefoot is best, or soft-soled boat
            shoes with non-marking soles.
          </li>
          <li>
            <strong>Watersports licences.</strong> Greek law requires a
            licence to operate jet skis and certain motorised toys — and a
            PADI certificate for scuba. If anyone in your group has a
            certificate, bring it; we&apos;ll handle the rest.
          </li>
          <li>
            <strong>A small word on tipping.</strong> Entirely at your
            discretion. Most guests find 10–15% of the charter fee, shared
            among the crew at the end, feels right when the week has been a
            joy — but truly, only if it has.
          </li>
        </ul>
      </section>

      <p className="bys-foot">
        <em>
          A more personalised "final logistics" note from George will arrive in
          your Cabin a few days before embarkation.
        </em>
      </p>

      <style>{`
        .bys-block {
          margin-top: 36px;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 22px 22px 26px;
        }
        .bys-label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        .bys-sub {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13.5px;
          color: rgba(13,27,42,0.6);
          margin: 0 0 18px 0;
        }

        .bys-weather {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(13,27,42,0.06);
        }
        .bys-weather li {
          background: #fff;
          display: grid;
          grid-template-columns: 64px 32px 1fr auto;
          gap: 12px;
          padding: 10px 0;
          align-items: center;
        }
        .bys-weather__day strong {
          display: block;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
        }
        .bys-weather__day em {
          display: block;
          font-family: var(--gy-font-ui);
          font-style: normal;
          font-size: 10px;
          color: rgba(13,27,42,0.5);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 1px;
        }
        .bys-weather__glyph {
          color: var(--gy-gold);
          font-size: 20px;
          text-align: center;
        }
        .bys-weather__main {
          display: flex;
          flex-direction: column;
        }
        .bys-weather__label {
          font-family: var(--gy-font-body);
          font-size: 13.5px;
          color: var(--gy-navy);
        }
        .bys-weather__temp {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13,27,42,0.6);
        }
        .bys-weather__wind {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          color: rgba(13,27,42,0.5);
        }

        .bys-phrases {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .bys-phrases { grid-template-columns: 1fr 1fr; }
        }
        .bys-phrases li {
          padding: 12px 0;
          border-bottom: 1px solid rgba(13,27,42,0.05);
          display: grid;
          grid-template-rows: auto auto auto;
          gap: 2px;
        }
        .bys-phrases__gr {
          font-family: var(--gy-font-editorial);
          font-size: 19px;
          color: var(--gy-navy);
        }
        .bys-phrases__en {
          font-family: var(--gy-font-ui);
          font-style: italic;
          font-size: 12px;
          color: var(--gy-gold);
          letter-spacing: 1px;
        }
        .bys-phrases__meaning {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13,27,42,0.6);
          line-height: 1.4;
        }

        .bys-pack-group { margin-top: 16px; }
        .bys-pack-group h3 {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
          font-weight: 500;
          margin: 0 0 8px 0;
        }
        .bys-pack-group ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bys-pack-group li {
          font-family: var(--gy-font-body);
          font-size: 14px;
          line-height: 1.6;
          color: var(--gy-navy);
          padding-left: 16px;
          position: relative;
        }
        .bys-pack-bullet {
          position: absolute;
          left: 0;
          top: 1px;
          color: var(--gy-gold);
          font-size: 16px;
          line-height: 1;
        }

        .bys-reminders {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .bys-reminders li {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13,27,42,0.85);
          padding-left: 22px;
          position: relative;
        }
        .bys-reminders li::before {
          content: "·";
          position: absolute;
          left: 0; top: -4px;
          color: var(--gy-gold);
          font-size: 28px;
          line-height: 1;
        }
        .bys-reminders strong {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          display: inline-block;
          margin-right: 6px;
        }

        .bys-foot {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(13,27,42,0.55);
          margin: 28px 0 0 0;
          font-size: 13.5px;
          text-align: center;
        }
      `}</style>
    </article>
  );
}
