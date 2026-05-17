// /cabin/vessel — Read-only. White-labeled vessel info.
// NEVER displays vessel_owner_internal or central_agent_internal.

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Your vessel · Your Cabin" };

export default async function VesselPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");
  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, vessel_make_model, vessel_length, vessel_capacity, homeport, cruising_area")
      .eq("id", cabinId)
      .maybeSingle()
  );

  if (!cabin) return null;

  const rows = [
    ["Name", cabin.vessel_name],
    ["Make & model", cabin.vessel_make_model],
    ["Length", cabin.vessel_length],
    ["Capacity", cabin.vessel_capacity ? `${cabin.vessel_capacity} guests` : null],
    ["Home port", cabin.homeport],
    ["Cruising area", cabin.cruising_area],
  ].filter(([, v]) => v);

  return (
    <article>
      <SectionTitle
        kicker="The vessel"
        title="Your"
        italic="yacht."
      />
      <IntroParagraph>
        A few quiet facts about the vessel that will be your home for the
        week. Photographs and a layout will land here a little before
        embarkation, and we will arrange a video walk-through if you would
        enjoy one.
      </IntroParagraph>

      <dl className="vessel-card">
        {rows.map(([k, v]) => (
          <div className="vessel-row" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <style>{`
        .vessel-card {
          margin: 28px 0 0 0;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vessel-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 16px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(13,27,42,0.05);
          font-family: var(--gy-font-body);
          font-size: 14.5px;
        }
        .vessel-row:last-child { border-bottom: 0; }
        .vessel-row dt {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
        }
        .vessel-row dd {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 16px;
          color: var(--gy-navy);
        }
        @media (max-width: 480px) {
          .vessel-row { grid-template-columns: 110px 1fr; gap: 12px; }
        }
      `}</style>
    </article>
  );
}
