// Weighted hot-lead score.
//
// Replaces the legacy OR-of-three rule (3 unique yachts, OR same yacht
// 3 times, OR 5+ min on site) with a continuous score so we can rank
// visitors by genuine intent rather than fire/no-fire.
//
// Score is unbounded but most live visitors land in 0-30. The "very
// hot" threshold at the end is 10 — anything ≥ 10 fires the hot-lead
// popup + Telegram alert.
//
// Inputs are derived server-side from the `sessions` row plus the
// per-event payload. Pure function (no I/O) so it can be reused in
// the dashboard for retrospective scoring.

const PREMIUM_VIEW_WEIGHT = 3;
const STANDARD_VIEW_WEIGHT = 2;
const RETURN_VISIT_BONUS = 2;
const PREMIUM_DEVICE_BONUS = 2;
const MID_DEVICE_BONUS = 1;
const COMPARE_USE_BONUS = 5;
const COST_CALC_USE_BONUS = 3;
const YACHT_FINDER_USE_BONUS = 3;
const PRICING_CALENDAR_USE_BONUS = 2;
const CTA_CLICK_WEIGHT = 4;
const SCROLL_DEEP_BONUS = 1; // ≥ 90% on any page
const COPY_EVENT_WEIGHT = 1;
const PRINT_EVENT_WEIGHT = 3;
const MIN_PER_MINUTE_ACTIVE = 0.5; // time on site, capped

export const HOT_LEAD_THRESHOLD = 10;

export function computeHotScore({
  uniqueYachts = 0,
  premiumYachtViews = 0,
  timeOnSiteSec = 0,
  activeSeconds = null, // if we have it, prefer over raw time
  isReturnVisitor = false,
  deviceTier = 'unknown', // premium / mid / budget / unknown
  comparePageVisited = false,
  costCalcUsed = false,
  yachtFinderUsed = false,
  pricingCalendarUsed = false,
  ctaClicks = 0,
  scrollDeep = false, // any page reached ≥ 90%
  copyEvents = 0,
  printEvents = 0,
}) {
  // Standard views are unique yachts that aren't premium. The split
  // assumes premium > standard ⊇ unique, so:
  const standardYachtViews = Math.max(0, uniqueYachts - premiumYachtViews);

  const minutesActive =
    typeof activeSeconds === 'number'
      ? activeSeconds / 60
      : (timeOnSiteSec || 0) / 60;

  let score = 0;
  score += standardYachtViews * STANDARD_VIEW_WEIGHT;
  score += premiumYachtViews * PREMIUM_VIEW_WEIGHT;
  score += Math.min(20, minutesActive) * MIN_PER_MINUTE_ACTIVE; // cap at 20 min
  if (isReturnVisitor) score += RETURN_VISIT_BONUS;
  if (deviceTier === 'premium') score += PREMIUM_DEVICE_BONUS;
  else if (deviceTier === 'mid') score += MID_DEVICE_BONUS;
  if (comparePageVisited) score += COMPARE_USE_BONUS;
  if (costCalcUsed) score += COST_CALC_USE_BONUS;
  if (yachtFinderUsed) score += YACHT_FINDER_USE_BONUS;
  if (pricingCalendarUsed) score += PRICING_CALENDAR_USE_BONUS;
  score += ctaClicks * CTA_CLICK_WEIGHT;
  if (scrollDeep) score += SCROLL_DEEP_BONUS;
  score += copyEvents * COPY_EVENT_WEIGHT;
  score += printEvents * PRINT_EVENT_WEIGHT;

  return Math.round(score * 10) / 10; // one decimal
}

export function isHotLead(score) {
  return typeof score === 'number' && score >= HOT_LEAD_THRESHOLD;
}

// Human-readable explanation of why a score landed where it did.
// Used in Telegram alerts so George can see WHY a visitor scored high.
export function explainScore(inputs) {
  const lines = [];
  const std = Math.max(0, (inputs.uniqueYachts || 0) - (inputs.premiumYachtViews || 0));
  if (std > 0) lines.push(`+${std * STANDARD_VIEW_WEIGHT} standard yachts (${std})`);
  if (inputs.premiumYachtViews > 0)
    lines.push(`+${inputs.premiumYachtViews * PREMIUM_VIEW_WEIGHT} premium yachts (${inputs.premiumYachtViews})`);
  if (inputs.activeSeconds || inputs.timeOnSiteSec) {
    const mins = (inputs.activeSeconds ?? inputs.timeOnSiteSec ?? 0) / 60;
    lines.push(`+${(Math.min(20, mins) * MIN_PER_MINUTE_ACTIVE).toFixed(1)} time (${Math.round(mins)}m)`);
  }
  if (inputs.isReturnVisitor) lines.push(`+${RETURN_VISIT_BONUS} return visitor`);
  if (inputs.deviceTier === 'premium') lines.push(`+${PREMIUM_DEVICE_BONUS} premium device`);
  else if (inputs.deviceTier === 'mid') lines.push(`+${MID_DEVICE_BONUS} mid device`);
  if (inputs.comparePageVisited) lines.push(`+${COMPARE_USE_BONUS} compare used`);
  if (inputs.costCalcUsed) lines.push(`+${COST_CALC_USE_BONUS} cost-calc`);
  if (inputs.yachtFinderUsed) lines.push(`+${YACHT_FINDER_USE_BONUS} yacht-finder`);
  if (inputs.pricingCalendarUsed) lines.push(`+${PRICING_CALENDAR_USE_BONUS} pricing-cal`);
  if (inputs.ctaClicks > 0) lines.push(`+${inputs.ctaClicks * CTA_CLICK_WEIGHT} CTA clicks (${inputs.ctaClicks})`);
  if (inputs.scrollDeep) lines.push(`+${SCROLL_DEEP_BONUS} deep scroll`);
  if (inputs.copyEvents > 0) lines.push(`+${inputs.copyEvents * COPY_EVENT_WEIGHT} copy events`);
  if (inputs.printEvents > 0) lines.push(`+${inputs.printEvents * PRINT_EVENT_WEIGHT} PRINT`);
  return lines;
}

export const HOT_SCORE_WEIGHTS = {
  STANDARD_VIEW_WEIGHT,
  PREMIUM_VIEW_WEIGHT,
  RETURN_VISIT_BONUS,
  PREMIUM_DEVICE_BONUS,
  MID_DEVICE_BONUS,
  COMPARE_USE_BONUS,
  COST_CALC_USE_BONUS,
  YACHT_FINDER_USE_BONUS,
  PRICING_CALENDAR_USE_BONUS,
  CTA_CLICK_WEIGHT,
  SCROLL_DEEP_BONUS,
  COPY_EVENT_WEIGHT,
  PRINT_EVENT_WEIGHT,
  MIN_PER_MINUTE_ACTIVE,
};
