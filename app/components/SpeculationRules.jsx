// Speculation Rules prerender — ASK B 2.4 (2026-07-02).
//
// The click from a guide page into the fleet becomes instant, and
// instant is the cheapest "expensive" feeling on the web. Chrome
// prerenders the listed routes when the visitor shows moderate
// intent (hover/pointerdown on a matching link); unsupported
// browsers and crawlers ignore the script block entirely, so this
// is pure progressive enhancement with zero SEO surface.
//
// Guardrails (per the ASK B reviewer):
// - The list stays at 2 URLs (Chrome caps concurrent prerenders);
//   both are read-only GET surfaces with no side effects.
// - Analytics: PostHogProvider gates init on document.prerendering,
//   so prerendered-but-never-shown pages fire no phantom pageviews.
// - Rules live in a const so the whole surface is auditable here.

const RULES = {
  prerender: [
    {
      urls: ["/charter-yacht-greece", "/crewed-yacht-charter-greece"],
      eagerness: "moderate",
    },
  ],
};

export default function SpeculationRules() {
  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(RULES) }}
    />
  );
}
