// Update 3 §3 — auto-mode kill switches.
//
// Master + per-stream env toggles read by every Phase 4 auto-cron
// before it does anything. Defaults to ENABLED so once Phase 4 ships
// the system runs without manual flag-flipping. To pause:
//
//   AUTO_MODE_ENABLED=false        master kill — pauses ALL auto-mode
//   AUTO_BRIDGE_ENABLED=false      pauses Bridge cron only
//   AUTO_WAKE_ENABLED=false        pauses Wake cron only
//   AUTO_COMPASS_ENABLED=false     pauses Compass cron only
//
// All env-only — Update 3 explicitly requires George log into Vercel
// for any change. The friction is intentional. Telegram /auto status
// is read-only.
//
// When a cron is paused: it still RUNS on schedule but the only side-
// effect is a Telegram alert noting what it would have done. No
// drafts created, no sends queued.

function envBool(name, defaultValue = true) {
  const raw = process.env[name];
  if (raw === undefined || raw === null || raw === "") return defaultValue;
  const v = String(raw).trim().toLowerCase();
  // Treat anything explicitly falsy as off; all else as on.
  if (v === "false" || v === "0" || v === "off" || v === "no") return false;
  return true;
}

/**
 * Returns whether an auto-cron for the given stream may proceed with
 * its real side-effects (drafts + Telegram approval card).
 *
 * @param {"bridge"|"wake"|"compass"} stream
 * @returns {{ enabled: boolean, master: boolean, perStream: boolean, reason: string|null }}
 */
export function autoModeEnabledFor(stream) {
  const master = envBool("AUTO_MODE_ENABLED", true);
  const map = {
    bridge: "AUTO_BRIDGE_ENABLED",
    wake: "AUTO_WAKE_ENABLED",
    compass: "AUTO_COMPASS_ENABLED",
  };
  const perStreamVar = map[stream];
  const perStream = perStreamVar ? envBool(perStreamVar, true) : true;
  const enabled = master && perStream;
  let reason = null;
  if (!master) reason = "AUTO_MODE_ENABLED=false";
  else if (!perStream) reason = `${perStreamVar}=false`;
  return { enabled, master, perStream, reason };
}

/**
 * Snapshot of all four toggles for the /auto status admin response.
 */
export function autoModeStatus() {
  const master = envBool("AUTO_MODE_ENABLED", true);
  return {
    master,
    bridge: envBool("AUTO_BRIDGE_ENABLED", true),
    wake: envBool("AUTO_WAKE_ENABLED", true),
    compass: envBool("AUTO_COMPASS_ENABLED", true),
  };
}

/**
 * Telegram-formatted alert body when a cron fires under a disabled
 * toggle. Caller passes (stream, intended_action_summary) and we
 * produce the Update 3 §3 standard alert text.
 */
export function pausedAlertText({
  stream,
  reason,
  intended_action,
  fire_time_iso = new Date().toISOString(),
}) {
  return [
    `⚠️ <b>AUTO-MODE PAUSED</b>`,
    ``,
    `Stream: <b>${stream}</b>`,
    `Reason: <code>${reason}</code>`,
    `Fire time: ${fire_time_iso}`,
    ``,
    `Would have: ${intended_action}`,
    ``,
    `No actions taken. Toggle in Vercel env to re-enable.`,
  ].join("\n");
}
