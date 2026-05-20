// 2026-05-20 — Pass 6 alias for the common /cabin/mood URL guess.
import { redirect } from "next/navigation";

export default function CabinMoodAlias() {
  redirect("/cabin/mood-board");
}
