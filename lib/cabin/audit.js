// lib/cabin/audit.js
// =============================================================
// THE CABIN — audit log writer.
//
// Append-only writes to cabin_audit_log. Used everywhere an
// admin / concierge / system action touches a client's data.
// Mitnick's mandate: "If audit logging fails, the action must
// fail too." So we throw on failure rather than swallowing.
// =============================================================

import { getCabinDb } from "./supabase";

export const AUDIT_ACTIONS = {
  CABIN_CREATED: "cabin_created",
  CABIN_INVITE_SENT: "cabin_invite_sent",
  MAGIC_LINK_REQUESTED: "magic_link_requested",
  MAGIC_LINK_VERIFIED: "magic_link_verified",
  SESSION_DESTROYED: "session_destroyed",

  CONCIERGE_MODE_ON: "concierge_mode_on",
  CONCIERGE_MODE_OFF: "concierge_mode_off",
  CONCIERGE_FIELD_SAVED: "concierge_field_saved",
  CONCIERGE_SENT_FOR_REVIEW: "concierge_sent_for_review",

  BRIEF_SECTION_SAVED: "brief_section_saved",
  BRIEF_SUBMITTED: "brief_submitted",
  BRIEF_LOCKED: "brief_locked",
  // 2026-06-01 — Brief 06 / G1-C: durable record of whether the
  // broker notifications (Telegram + email) actually went out on a
  // submit. Written AFTER the awaited sends with per-channel status
  // in metadata, so a silent delivery failure leaves a queryable
  // trail instead of vanishing.
  BRIEF_NOTIFICATIONS: "brief_notifications",

  PDF_EXPORTED: "pdf_exported",

  MOOD_BOARD_UPLOADED: "mood_board_uploaded",
  MOOD_BOARD_DELETED: "mood_board_deleted",
  VOYAGE_PHOTO_UPLOADED: "voyage_photo_uploaded",
  VOYAGE_PHOTO_DELETED: "voyage_photo_deleted",
  TIME_CAPSULE_SEALED: "time_capsule_sealed",
  TIME_CAPSULE_REVEALED: "time_capsule_revealed",
  MEMORY_ANCHOR_SCHEDULED: "memory_anchor_scheduled",
  MEMORY_ANCHOR_SENT: "memory_anchor_sent",
  VOYAGE_BUNDLE_SENT: "voyage_bundle_sent",
  CHAT_NOTIFICATION_SENT: "chat_notification_sent",

  CONSENT_CHANGED: "consent_changed",
  DATA_DELETED: "data_deleted",

  FILOTIMO_TIER_UPGRADED: "filotimo_tier_upgraded",

  DESIGNATED_ASSISTANT_ADDED: "designated_assistant_added",
  DESIGNATED_ASSISTANT_REMOVED: "designated_assistant_removed",

  // 2026-05-22 — Brief delegation + opt-out actions.
  // The principal can elevate a cabin_member to "brief admin"
  // so they can press Submit to George; a guest can opt out of
  // choosing orders / cellar selections (personal facts remain
  // mandatory). Both actions are RECORDED — the cabin's audit
  // log is the proof trail.
  DELEGATED_BRIEF_ADMIN: "delegated_brief_admin",
  REVOKED_BRIEF_ADMIN: "revoked_brief_admin",
  GUEST_OPTED_OUT_BRIEF: "guest_opted_out_brief",
  GUEST_OPTED_IN_BRIEF: "guest_opted_in_brief",
};

/**
 * @param {object} input
 * @param {string|null} [input.cabinId]
 * @param {string} input.actorEmail   — caller's email or 'system'
 * @param {string} input.actorRole    — 'admin' | 'charterer' | 'guest' | 'designated_assistant' | 'system'
 * @param {string} input.action       — one of AUDIT_ACTIONS
 * @param {string} [input.targetSection]
 * @param {string} [input.targetField]
 * @param {object} [input.metadata]
 */
export async function writeAudit(input) {
  const {
    cabinId = null,
    actorEmail,
    actorRole,
    action,
    targetSection = null,
    targetField = null,
    metadata = {},
  } = input;

  if (!action || !actorEmail || !actorRole) {
    throw new Error("[audit] action, actorEmail, actorRole are required");
  }

  const db = getCabinDb();
  const { error } = await db.from("cabin_audit_log").insert({
    cabin_id: cabinId,
    actor_email: String(actorEmail).toLowerCase(),
    actor_role: actorRole,
    action,
    target_section: targetSection,
    target_field: targetField,
    metadata,
  });

  if (error) {
    // Bubble up — per Mitnick's rule.
    throw new Error(`[audit] insert failed: ${error.message}`);
  }
}
