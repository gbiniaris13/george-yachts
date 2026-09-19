// scripts/tapCheck.mjs - can a visitor actually tap the buttons that earn a request?
//
// 2026-09-19. Twice in four weeks a fixed element slid over the WhatsApp
// button and nothing noticed: the cookie banner (22 to 26 August) and the
// yacht page's Inquire bar on phones (22 August to 19 September). The daily
// health check probes servers and form APIs; it cannot see that a button is
// buried, because a buried button still answers 200. This script is the
// missing half: a real browser, a phone-sized screen, and the one question
// that matters, asked of the element itself: if a finger lands here, what
// does it hit?
//
// It runs on GitHub Actions every morning (.github/workflows/tap-check.yml),
// before the 10:00 Athens health check, which reads the result and prints
// it in George's email. Run it by hand with:
//   node scripts/tapCheck.mjs            (against the live site)
//   BASE=http://localhost:3020 node scripts/tapCheck.mjs
//
// It sends nothing, submits nothing and clicks only "Decline" on the cookie
// banner, inside a throwaway browser profile.
import { chromium, webkit, devices } from "playwright";

const BASE = (process.env.BASE || "https://georgeyachts.com").replace(/\/$/, "");
const WA = 'a[aria-label="Contact us on WhatsApp"]';

// What a finger would hit at three heights of the element. An element that
// is deliberately hidden (opacity 0 or pointer-events none) is reported as
// "hidden", not as a failure: the site hides the WhatsApp button on purpose
// while a form's own submit block is on screen.
async function probe(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { state: "missing" };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.display === "none" || r.width === 0 || r.height === 0) return { state: "missing" };
    if (parseFloat(cs.opacity) < 0.5 || cs.pointerEvents === "none" || cs.visibility === "hidden") {
      return { state: "hidden" };
    }
    if (r.bottom <= 0 || r.top >= innerHeight) return { state: "offscreen", top: Math.round(r.top) };
    const hits = [0.5, 0.2, 0.8].map((fy) => {
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height * fy);
      return !!t && (t === el || el.contains(t));
    });
    const blocker = (() => {
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return t && !(t === el || el.contains(t)) ? `${t.tagName.toLowerCase()}.${String(t.className).slice(0, 50)}` : null;
    })();
    return { state: hits.filter(Boolean).length >= 2 ? "tappable" : "covered", hits, blocker, top: Math.round(r.top) };
  }, selector);
}

const results = [];
function record(device, path, phase, name, res, { required = true } = {}) {
  const ok = res.state === "tappable" || (!required && res.state !== "covered");
  results.push({ ok, device, path, phase, name, ...res });
}

async function firstYachtPath() {
  try {
    const r = await fetch(`${BASE}/api/fleet`);
    const j = await r.json();
    const list = Array.isArray(j) ? j : j.yachts || j.fleet || [];
    const slug = list.find((y) => y.slug)?.slug;
    if (slug) return `/yachts/${slug}`;
  } catch {}
  return "/yachts/genny";
}

async function runDevice(label, browserType, contextOptions, paths, { phone }) {
  const browser = await browserType.launch();
  try {
    for (const path of paths) {
      // A fresh profile per page: the cookie banner is out, as it is for
      // every new visitor.
      const ctx = await browser.newContext(contextOptions);
      const page = await ctx.newPage();
      await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(4500); // hydration, dock transition (0.4 s), banner entrance

      const isYacht = path.startsWith("/yachts/");
      for (const phase of ["banner-open", "after-decline"]) {
        if (phase === "after-decline") {
          const decline = page.locator('[aria-label="Cookie consent"] button', { hasText: /decline/i });
          if (await decline.count()) {
            await decline.first().click();
            await page.waitForTimeout(1500);
          }
        }
        record(label, path, phase, "WhatsApp button", await probe(page, WA));
        if (phone) {
          record(label, path, phase, "Menu button", await probe(page, 'button[aria-label="Open navigation"]'));
          if (isYacht) record(label, path, phase, "Inquire bar", await probe(page, ".gy-yacht-mobile-cta__btn"));
        } else {
          record(label, path, phase, "Brief George (nav)", await probe(page, 'a[href="/#contact"], a[href="#contact"]'));
        }
        if (phase === "banner-open") {
          record(label, path, phase, "Cookie Accept", await probe(page, ".gy-cookie-btn"), { required: false });
        }
      }

      // Further down the page, where the sticky bars come out. The WhatsApp
      // button may be hidden on purpose there; what it may never be is
      // visible and covered.
      // Mobile WebKit has no mouse wheel, and the site scrolls through
      // Lenis, which ignores window.scrollTo; drive Lenis when it exists.
      await page.evaluate(() => {
        const y = Math.min(5400, document.documentElement.scrollHeight * 0.45);
        if (window.__gyLenis?.scrollTo) window.__gyLenis.scrollTo(y, { immediate: true, force: true });
        window.scrollTo(0, y);
      });
      await page.waitForTimeout(2000);
      record(label, path, "scrolled", "WhatsApp button", await probe(page, WA), { required: false });
      if (phone && isYacht) record(label, path, "scrolled", "Inquire bar", await probe(page, ".gy-yacht-mobile-cta__btn"));
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

const yacht = await firstYachtPath();
const paths = ["/", yacht, "/charter-yacht-greece", "/crewed-yacht-charter-greece", "/inquiry"];

await runDevice("iPhone (WebKit)", webkit, { ...devices["iPhone 13"] }, paths, { phone: true });
await runDevice("Android (Chromium)", chromium, { ...devices["Pixel 5"] }, paths, { phone: true });
await runDevice("Desktop (Chromium)", chromium, { viewport: { width: 1440, height: 900 } }, ["/", yacht], { phone: false });

const failed = results.filter((r) => !r.ok);
const line = (r) => `${r.ok ? "PASS" : "FAIL"} | ${r.device} | ${r.path} | ${r.phase} | ${r.name} | ${r.state}${r.blocker ? " by " + r.blocker : ""}`;
console.log(results.map(line).join("\n"));
console.log(`\n${results.length - failed.length}/${results.length} passed on ${BASE}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import("node:fs");
  const md = [
    `## Tap check: ${failed.length ? failed.length + " FAILED" : "all tappable"} (${results.length - failed.length}/${results.length})`,
    "",
    "| Result | Device | Page | Phase | Element | State |",
    "|---|---|---|---|---|---|",
    ...results.map((r) => `| ${r.ok ? "PASS" : "**FAIL**"} | ${r.device} | ${r.path} | ${r.phase} | ${r.name} | ${r.state}${r.blocker ? " by `" + r.blocker + "`" : ""} |`),
  ].join("\n");
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
}
process.exit(failed.length ? 1 : 0);
