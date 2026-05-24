// 2026-05-23 — SHARED BRIEF MODEL. See sibling at-the-table page
// for the architectural note. This page is now a redirect to the
// canonical shared brief at /cabin/brief/beverages.

import { redirect } from "next/navigation";

export default function InTheCellarContributionRedirect() {
  redirect("/cabin/brief/beverages");
}
