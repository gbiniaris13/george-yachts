// Shared CRM contact upsert for the contact form endpoints.
// Mirrors the write path /api/track uses for popup leads, so form
// submissions finally land in the CRM as contacts, not just as
// notifications. (Gap found 23/8: /api/contact wrote zero contacts.)

const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

function crmHeaders(json = false) {
  const h = {
    apikey: CRM_SUPABASE_KEY,
    Authorization: `Bearer ${CRM_SUPABASE_KEY}`,
  };
  if (json) {
    h["Content-Type"] = "application/json";
    h["Prefer"] = "return=representation";
  }
  return h;
}

async function findContactByEmail(email) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !email) return null;
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&limit=1`,
      { headers: crmHeaders() }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0] || null;
  } catch {
    return null;
  }
}

async function getHotStageId() {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/pipeline_stages?name=eq.Hot&limit=1`,
      { headers: crmHeaders() }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0]?.id || null;
  } catch {
    return null;
  }
}

async function insertRow(table, data) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: crmHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Create or update a CRM contact from a form payload and log the
 * full brief as an activity. Never throws; safe to fire-and-forget.
 *
 * @param {object} p
 * @param {string} p.name
 * @param {string} [p.email]
 * @param {string} [p.phone]
 * @param {string} [p.country]
 * @param {string} p.source  e.g. "website_form" | "website_form_partial"
 * @param {string} p.description  activity description (full brief text)
 * @param {object} [p.metadata]  extra fields stored on the activity
 */
export async function upsertFormContact({ name, email, phone, country, source, description, metadata }) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const nameParts = (name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const existing = await findContactByEmail(email);
    const hotStageId = await getHotStageId();

    let contactId = existing?.id || null;

    if (existing) {
      await fetch(`${CRM_SUPABASE_URL}/rest/v1/contacts?id=eq.${existing.id}`, {
        method: "PATCH",
        headers: crmHeaders(true),
        body: JSON.stringify({
          first_name: existing.first_name || firstName,
          last_name: existing.last_name || lastName,
          phone: phone || existing.phone,
          country: existing.country || country || null,
          pipeline_stage_id: hotStageId || existing.pipeline_stage_id,
          last_activity_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    } else {
      const created = await insertRow("contacts", {
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        country: country || null,
        source,
        pipeline_stage_id: hotStageId,
      });
      contactId = created?.[0]?.id || null;
    }

    if (contactId) {
      await insertRow("activities", {
        contact_id: contactId,
        type: source === "website_form_partial" ? "lead_captured" : "form_submission",
        description,
        metadata: metadata || {},
      });
    }

    return contactId;
  } catch {
    return null;
  }
}
