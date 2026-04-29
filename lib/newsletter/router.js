// Audience routing matrix — Brief §6.
//
// Pure function: given a content type, return the streams it can/should
// reach. The brain of the moat. Encoded so the rest of the system never
// has to remember "do I send a discount to broker peers? — NO."
//
// Output shape:
//   {
//     allowed:   ["bridge", "wake"],   // safe to send by default
//     suggested: ["bridge", "wake"],   // recommended default for the draft
//     blocked:   ["compass"],          // explicit "never" for this type
//     notes:     "compass blocked: discounts are competitive intel"
//   }
//
// Hard contract (Brief §6 + §13):
//   - Compass NEVER receives offer / discount / specific-week intel.
//     If the caller passes content_type === "offer" and explicitly tries
//     to override with compass in the audience, the policy STILL blocks
//     it. (The route handler must respect `blocked` and refuse the send.)

export const STREAMS = ["bridge", "wake", "compass", "greece"];

// "always" / "sometimes" / "never" — directly transcribed from Brief §6.
const MATRIX = {
  // New yacht in fleet (announcement)
  announcement: {
    bridge: "always",
    wake: "always",
    compass: "never",
    greece: "sometimes",
  },
  // Special offer / discount / week deal
  offer: {
    bridge: "always",
    wake: "always",
    compass: "never",
    greece: "never",
  },
  // Personal story / charter recap
  story: {
    bridge: "always",
    wake: "sometimes",
    compass: "never",
    greece: "always",
  },
  // Blog post recap (auto-pull)
  blog: {
    bridge: "always",
    wake: "sometimes",
    compass: "never",
    greece: "never",
  },
  // Market intel / booking trends
  intel: {
    bridge: "sometimes",
    wake: "always",
    compass: "always",
    greece: "never",
  },
  // Geopolitical read
  geopolitical: {
    bridge: "sometimes",
    wake: "always",
    compass: "always",
    greece: "never",
  },
  // Educational
  educational: {
    bridge: "always",
    wake: "never",
    compass: "never",
    greece: "never",
  },
  // Industry news (regulation, IYBA, MYBA)
  industry: {
    bridge: "never",
    wake: "sometimes",
    compass: "always",
    greece: "never",
  },
  // Holiday / season greeting
  greeting: {
    bridge: "always",
    wake: "always",
    compass: "always",
    greece: "always",
  },
};

const NEVER_REASONS = {
  offer: {
    compass:
      "compass blocked: offers are competitive intel — broker peers could undercut",
    greece: "greece blocked: From Greece is personal, not commercial",
  },
  announcement: {
    compass:
      "compass blocked: new-yacht announcements include sourcing context",
  },
  story: {
    compass: "compass blocked: stories aren't peer-to-peer signals",
  },
  blog: {
    compass: "compass blocked: blog teasers aren't peer-to-peer signals",
    greece: "greece blocked: stays Greek-language only",
  },
  intel: {
    greece: "greece blocked: From Greece is personal, not market intel",
  },
  geopolitical: {
    greece: "greece blocked: From Greece is personal, not geopolitical",
  },
  educational: {
    wake: "wake blocked: educational content is end-client framing",
    compass: "compass blocked: peers don't need 'how to read a yacht spec'",
    greece: "greece blocked: stays Greek-language only",
  },
  industry: {
    bridge: "bridge blocked: clients don't need IYBA regulation digests",
    greece: "greece blocked: stays Greek-language only",
  },
};

export function routeAudience(contentType) {
  const row = MATRIX[contentType];
  if (!row) {
    return {
      allowed: [],
      suggested: [],
      blocked: [...STREAMS],
      notes: `unknown content_type "${contentType}" — defaulting to no send`,
      ok: false,
    };
  }
  const allowed = [];
  const suggested = [];
  const blocked = [];
  for (const s of STREAMS) {
    const v = row[s];
    if (v === "always") {
      allowed.push(s);
      suggested.push(s);
    } else if (v === "sometimes") {
      allowed.push(s);
    } else {
      blocked.push(s);
    }
  }
  return {
    allowed,
    suggested,
    blocked,
    notes: blocked
      .map((s) => NEVER_REASONS[contentType]?.[s])
      .filter(Boolean)
      .join(" · "),
    ok: true,
  };
}

/**
 * Enforces the routing for an actual draft. Caller passes the
 * requested audience; we drop any blocked streams and return what
 * actually goes out, plus what we refused.
 */
export function enforceRouting(contentType, requestedStreams) {
  const r = routeAudience(contentType);
  const requested = (requestedStreams ?? []).filter((s) =>
    STREAMS.includes(s),
  );
  const finalAudience = requested.filter((s) => !r.blocked.includes(s));
  const refused = requested.filter((s) => r.blocked.includes(s));
  return {
    ok: r.ok,
    final_audience: finalAudience,
    refused,
    refusal_reasons: refused
      .map((s) => NEVER_REASONS[contentType]?.[s])
      .filter(Boolean),
  };
}
