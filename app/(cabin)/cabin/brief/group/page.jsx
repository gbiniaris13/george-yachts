// 2026-05-20 — Pass 6 alias. The brief section is labelled "Your
// Group" in the overview, but the slug was guests/. Tyler typed
// /cabin/brief/group and got the marketing 404. Redirect now.
import { redirect } from "next/navigation";

export default function BriefGroupAlias() {
  redirect("/cabin/brief/guests");
}
