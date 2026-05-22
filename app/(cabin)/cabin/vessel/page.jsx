// /cabin/vessel — Standalone vessel page.
//
// 2026-05-22 — The full brochure is now ALSO rendered inline on
// /cabin home via VesselBrochureBlock. This standalone route is
// retained for:
//   · Direct deep-linking (a guest can bookmark or be sent
//     `?utm_=…` campaigns directly to the vessel surface).
//   · Print: opens cleanly without the rest of the home noise.
//   · Future PWA install entry that lands on the vessel.
//
// To keep the two surfaces in lockstep, this page is a thin
// wrapper around VesselBrochureBlock — same data, same render.
//
// NEVER displays vessel_owner_internal or central_agent_internal.

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { resolveVesselPhotoUrls } from "@/lib/cabin/vessel-photo-urls";
import VesselBrochureBlock from "../../../components/cabin/VesselBrochureBlock";

export const metadata = { title: "Your vessel" };

export default async function VesselPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");

  const db = getCabinDb();
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select(
        "vessel_name, vessel_make_model, vessel_length, vessel_capacity, homeport, cruising_area, vessel_brochure, vessel_photos",
      )
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (!cabin) return null;

  const photos = await resolveVesselPhotoUrls(cabin.vessel_photos);

  return (
    <article>
      <VesselBrochureBlock cabin={cabin} photos={photos} asPage />
    </article>
  );
}
