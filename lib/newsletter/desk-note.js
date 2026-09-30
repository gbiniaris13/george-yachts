// The note George approves for the next letter (2026-09-29).
//
// The letter opens with a few sentences from the desk: what the 2027
// requests are asking for, which month is filling, what the water looked
// like. A model does not write them at send time. They are drafted with
// George, he approves the exact text, and it is stored here under
// desk_note:<stream>. The orchestrator reads it on the scheduled morning
// and clears it after a real send. No note, no paragraph: the letter is
// the yacht and the article and nothing is invented to fill the gap.
//
// A note older than 21 days is ignored, so a stale paragraph never opens
// a letter it was not written for.

import { kvGet, kvSet, kvDel } from "@/lib/kv";

const MAX_AGE_DAYS = 21;

function key(stream) {
  return `desk_note:${String(stream).trim().toLowerCase()}`;
}

export async function readDeskNote(stream) {
  try {
    const raw = await kvGet(key(stream));
    if (!raw) return null;
    const note = typeof raw === "string" ? JSON.parse(raw) : raw;
    const text = String(note?.text ?? "").trim();
    if (!text) return null;
    const at = Date.parse(note?.approved_at ?? "");
    if (Number.isNaN(at) || Date.now() - at > MAX_AGE_DAYS * 86400000) return null;
    return { text, approved_at: note.approved_at };
  } catch {
    return null;
  }
}

export async function writeDeskNote(stream, text) {
  const note = {
    text: String(text ?? "").trim(),
    approved_at: new Date().toISOString(),
  };
  await kvSet(key(stream), JSON.stringify(note));
  return note;
}

export async function clearDeskNote(stream) {
  await kvDel(key(stream)).catch(() => {});
}
