# Redesign Baseline — 2026-04-20 17:xx

Snapshot of the production homepage **immediately before** the 5-move
luxury/tech redesign begins. Every file listed here is restorable
byte-for-byte via the git tag.

## The tag

```
snapshot/pre-redesign-2026-04-20
→ commit 4d43919
→ message: fix(home): language pill overlap + rock-solid hero centering
```

Pushed to `origin`. Every Claude session can check it out with:

```sh
git fetch --tags
git show snapshot/pre-redesign-2026-04-20
```

## Section inventory (in render order on `/`)

Source of truth: `app/HomeClient.jsx`.

| # | Section | Component path | Redesign target |
|---|---|---|---|
| 1 | Video hero | `app/components/VideoSection.jsx` | **Move #1** — cinematic reveal |
| 2 | Fleet CTAs (2 cards) | `app/components/FleetCTAs.jsx` | **Move #2** — split-screen |
| 3 | Home stats strip | `app/components/HomeStats.jsx` | (untouched) |
| 4 | Your Broker (George photo + copy) | `app/components/YourBroker.jsx` | (untouched) |
| 5 | How It Works (3 steps) | `app/components/HowItWorks.jsx` | (untouched) |
| 6 | Filotimo philosophy | `app/components/Filotimon.jsx` | **Move #4** — editorial spread |
| 7 | Broker testimonials | `app/components/BrokerTestimonials.jsx` | (untouched) |
| 8 | Credentials strip | `app/components/CredentialsStrip.jsx` | (untouched) |
| 9 | Budget slider | `app/components/BudgetSlider.jsx` | (untouched) |
| 10 | Interactive tools | `app/components/InteractiveTools.jsx` | (untouched) |
| 11 | Contact bar | `app/components/ContactBar.jsx` | (untouched) |
| 12 | Contact form | `app/components/ContactFormSection.jsx` | (untouched) |
| 13 | Footer | `app/components/Footer.jsx` | (untouched) |

### New sections the redesign inserts

- **Move #3 — Signature Yacht slot**
  Between `VideoSection` and `FleetCTAs`.
  Path: `app/components/SignatureYacht.jsx` (new).
- **Move #5 — Interactive Greek Waters Map**
  Between `HowItWorks` and `Filotimon`.
  Path: `app/components/GreekWatersMap.jsx` (new).

## How to revert ONE section to this baseline

Checkout just that file from the tag, keeping everything else current:

```sh
# Example: "revert the hero to how it was before the redesign"
git fetch --tags
git checkout snapshot/pre-redesign-2026-04-20 -- app/components/VideoSection.jsx
git commit -m "revert: restore VideoSection to pre-redesign baseline"
git push origin main
```

Same pattern for any file in the table above — swap the path.

## How to revert the ENTIRE homepage

```sh
git checkout snapshot/pre-redesign-2026-04-20 -- app/ lib/i18n/locales/
git commit -m "revert: full homepage to pre-redesign baseline"
git push origin main
```

The content outside `app/` and `lib/i18n/locales/` is not part of this
redesign scope.

## Current state of the hero (the part most likely to be rolled back)

As of this baseline, the hero renders:

1. Eyebrow: "EXCLUSIVELY GREEK WATERS" (i18n `hero.tagline`, gold 9pt)
2. H1: "GEORGE YACHTS" (Cormorant Garamond, 110px at desktop, white)
3. Subtitle: "BROKERAGE HOUSE LLC" (gold gradient, 16px)
4. Horizontal gold divider line (140px centered)
5. Sub-tagline: "Boutique Luxury Yacht Charter · Est. U.S.A. · Operating from Athens"
6. Seasonal italic line (rotates by month)
7. Two side-by-side buttons: **PRIVATE FLEET →** · **EXPLORER FLEET →**
8. Quiet secondary text link: "Or find your yacht in 60 seconds →"
9. Scroll indicator
10. Desktop category nav at bottom (Sailing Monohulls / Sailing Catamarans / Power Catamarans / Motor Yachts)

All centered inside a `max-w-[1200px] mx-auto` frame. Background is a
muted autoplaying MP4 of a yacht cruising (`/videos/yacht-cruising-new.mp4`).

## Current state of the fleet CTAs

Two side-by-side cards below the hero, each linking to the respective
fleet page:

- Private Fleet — £13K to £180K / week — "Full crew · Total discretion"
- Explorer Fleet — £420 to £1,800 / person — "More islands · More adventure"

Data comes from Sanity at render time (pricing range is computed live
from yacht records).

## Flag for future sessions

When George says "revert section X to how it was before", pull this
file and run the single-file checkout command above. Don't guess.
