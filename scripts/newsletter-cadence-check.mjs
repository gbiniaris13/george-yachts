// Run: node scripts/newsletter-cadence-check.mjs (25/11/2026: six client letters a year, monthly advisors, no August)
import { shouldFireToday, bridgeDates } from "../lib/newsletter/auto-cadence.js";
import assert from "node:assert/strict";
const at = (iso) => new Date(`${iso}T13:00:00Z`);
assert.deepEqual(bridgeDates(2027), ["2027-01-26","2027-03-09","2027-05-11","2027-09-28","2027-10-26","2027-12-14"]);
assert.deepEqual(bridgeDates(2026).slice(-1), ["2026-12-08"]);
// Bridge fires on its date, not before, not twice, catches up a missed week, never in Jul/Aug/Nov.
assert.equal(shouldFireToday(at("2026-12-01"), "2026-11-03T13:00:00Z", "bridge").fire, false);
assert.equal(shouldFireToday(at("2026-12-08"), "2026-11-03T13:00:00Z", "bridge").fire, true);
assert.equal(shouldFireToday(at("2026-12-15"), "2026-12-08T13:00:00Z", "bridge").fire, false);
assert.equal(shouldFireToday(at("2026-12-15"), "2026-11-03T13:00:00Z", "bridge").fire, true);
assert.equal(shouldFireToday(at("2027-01-12"), "2026-12-08T13:00:00Z", "bridge").fire, false); // the lost-requests wave day
assert.equal(shouldFireToday(at("2027-01-26"), "2026-12-08T13:00:00Z", "bridge").fire, true);
for (const d of ["2027-07-13","2027-08-10","2026-11-24","2027-02-09","2027-04-13","2027-06-08"]) assert.equal(shouldFireToday(at(d), null, "bridge").fire, false, d);
// Wake: monthly, never August.
assert.equal(shouldFireToday(at("2027-08-12"), "2027-07-01T13:00:00Z", "wake").fire, false);
assert.equal(shouldFireToday(at("2027-07-29"), "2027-07-01T13:00:00Z", "wake").fire, true);
assert.equal(shouldFireToday(at("2027-07-15"), "2027-07-01T13:00:00Z", "wake").fire, false);
console.log("all newsletter gate checks pass; 2027 client letters:", bridgeDates(2027).join(", "));
