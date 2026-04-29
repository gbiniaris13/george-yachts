// Update 3 §2 — Wake / Compass intel queue.
//
// George writes intel signals when he has time (sometimes 5 in a
// weekend). When the relevant auto-cron fires, it picks the OLDEST
// pending entry for that stream, generates the standard /intel draft
// via the Composer engine, and Telegrams the approval card.
//
// KV schema:
//
//   queue:<stream>:index            sorted set / list of entry IDs in
//                                   chronological order. We use a
//                                   plain Set + a list because Vercel
//                                   KV's REST shim only exposes basic
//                                   commands. Insertion is append-only.
//
//   queue:<stream>:<entry_id>       JSON blob:
//     {
//       id: <entry_id>,
//       stream: "wake" | "compass",
//       text: string,
//       timestamp_added: ISO,
//       status: "pending" | "used" | "discarded",
//       timestamp_used: ISO | null,
//       issue_id: string | null,
//       notes: string | null
//     }
//
// Entry IDs: <unix-ms>-<rand4hex> — globally unique, sortable
// chronologically, short enough to fit in URL params.

import {
  kvGet,
  kvSet,
  kvDel,
  kvSadd,
  kvSrem,
  kvSmembers,
} from "@/lib/kv";
import crypto from "node:crypto";

const VALID_STREAMS = new Set(["wake", "compass"]);

function indexKey(stream) {
  return `queue:${stream}:index`;
}
function entryKey(stream, id) {
  return `queue:${stream}:${id}`;
}
function newEntryId() {
  return `${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;
}

async function readEntry(stream, id) {
  try {
    const raw = await kvGet(entryKey(stream, id));
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function writeEntry(entry) {
  await kvSet(entryKey(entry.stream, entry.id), JSON.stringify(entry));
}

/**
 * Add a pending intel entry. Returns the persisted record.
 */
export async function addQueueEntry({ stream, text, notes = null }) {
  if (!VALID_STREAMS.has(stream)) {
    throw new Error(`invalid stream: ${stream}`);
  }
  const t = String(text ?? "").trim();
  if (t.length < 10) throw new Error("intel text too short (min 10 chars)");
  const id = newEntryId();
  const entry = {
    id,
    stream,
    text: t,
    timestamp_added: new Date().toISOString(),
    status: "pending",
    timestamp_used: null,
    issue_id: null,
    notes: notes ? String(notes).trim() : null,
  };
  await writeEntry(entry);
  await kvSadd(indexKey(stream), id).catch(() => {});
  return entry;
}

/**
 * List entries for a stream. Status filter optional.
 *   listQueueEntries({ stream }) → all (pending + used + discarded)
 *   listQueueEntries({ stream, status: "pending" }) → pending only
 */
export async function listQueueEntries({ stream, status = null }) {
  if (!VALID_STREAMS.has(stream)) {
    throw new Error(`invalid stream: ${stream}`);
  }
  const ids = (await kvSmembers(indexKey(stream))) ?? [];
  const entries = [];
  for (const id of ids) {
    const e = await readEntry(stream, id);
    if (!e) {
      // Orphan index entry — clean up.
      await kvSrem(indexKey(stream), id).catch(() => {});
      continue;
    }
    if (status && e.status !== status) continue;
    entries.push(e);
  }
  // Newest first for UI; cron consumer separately uses oldest-first.
  entries.sort((a, b) => b.timestamp_added.localeCompare(a.timestamp_added));
  return entries;
}

/**
 * Pop the oldest pending entry — used by Wake / Compass auto-crons.
 * Marks the entry as `used` with the issue_id once the caller has a
 * draft. Returns the entry or null if queue empty.
 *
 * Note: this is a TWO-step operation. The cron calls peekOldestPending
 * to see what's available, then on successful draft creation calls
 * markEntryUsed(id, issue_id) to flip the status. If draft creation
 * fails, the entry stays pending and the next cron picks it up again.
 */
export async function peekOldestPending(stream) {
  const all = await listQueueEntries({ stream, status: "pending" });
  if (all.length === 0) return null;
  // listQueueEntries returns newest-first; reverse for oldest-first.
  return all[all.length - 1];
}

export async function markEntryUsed({ stream, id, issue_id = null }) {
  const e = await readEntry(stream, id);
  if (!e) return null;
  e.status = "used";
  e.timestamp_used = new Date().toISOString();
  e.issue_id = issue_id ?? null;
  await writeEntry(e);
  return e;
}

export async function discardEntry({ stream, id }) {
  const e = await readEntry(stream, id);
  if (!e) return null;
  e.status = "discarded";
  await writeEntry(e);
  return e;
}

export async function editEntry({ stream, id, text, notes }) {
  const e = await readEntry(stream, id);
  if (!e) return null;
  if (e.status !== "pending") {
    throw new Error("only pending entries can be edited");
  }
  if (text !== undefined) {
    const t = String(text).trim();
    if (t.length < 10) throw new Error("intel text too short (min 10 chars)");
    e.text = t;
  }
  if (notes !== undefined) {
    e.notes = notes ? String(notes).trim() : null;
  }
  await writeEntry(e);
  return e;
}

/**
 * Permanent delete (hard) — for true mistakes. Discard is the soft path.
 */
export async function deleteEntry({ stream, id }) {
  await kvDel(entryKey(stream, id)).catch(() => {});
  await kvSrem(indexKey(stream), id).catch(() => {});
}

export async function pendingCount(stream) {
  const list = await listQueueEntries({ stream, status: "pending" });
  return list.length;
}
