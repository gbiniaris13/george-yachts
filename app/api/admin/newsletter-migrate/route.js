// Phase 1.1 — KV schema migration to the four-stream model.
//
// Brief §9 introduces:
//   subscribers:bridge / :wake / :compass / :greece     (Set<email>)
//   profile:<email>                                     (Hash)
//   counter:bridge:issue_num + parallel for other 3
//   env:NEWSLETTER_ENABLED + env:AUTO_MODE_ENABLED      (kill switches)
//
// Migration logic — idempotent, safe to re-run:
//   1. Read every member of the legacy `newsletter:subscribers` set.
//   2. Drop the test.invalid row (and any obvious test fixtures).
//   3. For each surviving email, SADD to `subscribers:bridge` (the
//      historical signup form mapped 1:1 to Bridge in spirit).
//   4. Write a profile hash unless one already exists.
//   5. Initialise counters at 0 if unset.
//   6. Initialise kill-switch flags as 'false' if unset (safe default —
//      no auto sends until George flips them).
//   7. Leave the legacy `newsletter:subscribers` set in place so the
//      old footer-signup endpoint keeps working until cut-over.
//
// Auth: CRON_SECRET (matches every other admin endpoint).

import { NextResponse } from "next/server";
import {
  kvSmembers,
  kvSadd,
  kvSet,
  kvGet,
  kvScard,
} from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LEGACY_SET = "newsletter:subscribers";
const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};

function isObviousTestEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  const domain = e.slice(e.indexOf("@") + 1);
  if (
    domain === "test.invalid" ||
    domain === "example.com" ||
    domain === "example.org" ||
    domain.endsWith(".invalid") ||
    domain.endsWith(".test") ||
    domain.endsWith(".localhost")
  ) {
    return true;
  }
  return false;
}

async function setIfMissing(key, value) {
  const existing = await kvGet(key);
  if (existing === null || existing === undefined) {
    await kvSet(key, value);
    return { wrote: true, previous: null };
  }
  return { wrote: false, previous: existing };
}

async function profileWriteIfMissing(email, source) {
  const key = `profile:${email}`;
  const existing = await kvGet(key);
  if (existing) return { wrote: false };
  const profile = {
    email,
    lists: ["bridge"],
    source,
    subscribed_at: new Date().toISOString(),
    last_engaged_at: null,
    unsubscribed_lists: [],
    language: "en",
    notes: source === "migrated" ? "migrated from legacy newsletter:subscribers set" : "",
    gy_command_contact_id: null,
    consent_record: [
      {
        list: "bridge",
        method: "single_opt_in",
        timestamp: new Date().toISOString(),
        ip_address: null,
        user_agent: "kv-migration-2026-04-29",
      },
    ],
  };
  await kvSet(key, JSON.stringify(profile));
  return { wrote: true };
}

export async function GET(request) {
  const url = new URL(request.url);
  const provided = url.searchParams.get("key");
  // Accept either CRON_SECRET (canonical) or NEWSLETTER_UNSUB_SECRET
  // (for one-off bootstrap moves). Both are equally privileged for
  // this idempotent migrator.
  const okCron = process.env.CRON_SECRET && provided === process.env.CRON_SECRET;
  const okUnsub =
    process.env.NEWSLETTER_UNSUB_SECRET &&
    provided === process.env.NEWSLETTER_UNSUB_SECRET;
  if (!okCron && !okUnsub) {
    return NextResponse.json(
      {
        error:
          "unauthorized — pass ?key=<CRON_SECRET or NEWSLETTER_UNSUB_SECRET>",
      },
      { status: 401 },
    );
  }
  const dryRun = url.searchParams.get("dry") === "1";

  // 1. Read legacy set.
  const legacyMembers = (await kvSmembers(LEGACY_SET)) ?? [];
  const cleaned = [];
  const dropped = [];
  for (const m of legacyMembers) {
    const e = String(m).trim().toLowerCase();
    if (isObviousTestEmail(e)) dropped.push(e);
    else cleaned.push(e);
  }

  if (dryRun) {
    const sizes = {};
    for (const [stream, key] of Object.entries(STREAM_SETS)) {
      sizes[stream] = (await kvScard(key)) ?? 0;
    }
    return NextResponse.json({
      ok: true,
      dry_run: true,
      legacy_count: legacyMembers.length,
      legacy_after_dedrop: cleaned.length,
      dropped_test_emails: dropped,
      current_stream_sizes: sizes,
      preview_will_migrate_to_bridge: cleaned,
    });
  }

  // 2. Migrate cleaned members → subscribers:bridge.
  let migrated = 0;
  for (const email of cleaned) {
    await kvSadd(STREAM_SETS.bridge, email);
    migrated += 1;
  }

  // 3. Write profile hashes.
  let profilesWritten = 0;
  for (const email of cleaned) {
    const r = await profileWriteIfMissing(email, "migrated");
    if (r.wrote) profilesWritten += 1;
  }

  // 4. Initialise counters at 0 if unset.
  const counterResults = {};
  for (const stream of Object.keys(STREAM_SETS)) {
    const r = await setIfMissing(`counter:${stream}:issue_num`, "0");
    counterResults[stream] = r;
  }

  // 5. Initialise kill-switch flags as 'false' (safe default).
  const newsletterEnabled = await setIfMissing("env:NEWSLETTER_ENABLED", "false");
  const autoModeEnabled = await setIfMissing("env:AUTO_MODE_ENABLED", "false");

  // 6. Snapshot final stream sizes.
  const finalSizes = {};
  for (const [stream, key] of Object.entries(STREAM_SETS)) {
    finalSizes[stream] = (await kvScard(key)) ?? 0;
  }

  return NextResponse.json({
    ok: true,
    legacy_count: legacyMembers.length,
    cleaned_count: cleaned.length,
    dropped_test_emails: dropped,
    migrated_to_bridge: migrated,
    profiles_written: profilesWritten,
    counters_initialised: counterResults,
    flags: {
      "env:NEWSLETTER_ENABLED": newsletterEnabled,
      "env:AUTO_MODE_ENABLED": autoModeEnabled,
    },
    final_stream_sizes: finalSizes,
    note:
      "Legacy `newsletter:subscribers` set left intact for backward compatibility. Cut-over after Phase 2.",
  });
}
