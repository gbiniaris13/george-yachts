# /public/audio/ — Drop CC0 ocean recording here

Phase 27e (Forbes-launch eve, 2026-05-05) — the AmbientPlayer in the
nav header (top-right gold equaliser-bar icon) auto-loads
`/audio/ocean.mp3` if it exists. If the file is absent, the player
falls back to the existing Web Audio synth (which Boss has flagged
as too "wind-like").

## How to upgrade the ambient sound

1. Pick a free CC0 ocean recording from one of these sources:

   **Pixabay** (free for commercial use, no attribution required)
   https://pixabay.com/sound-effects/search/ocean%20waves/
   Recommended search: "ocean waves loop", "calm sea", "gentle waves"
   Pick a 60–90s loop, hydrophone-style, no seagulls/people.

   **Mixkit** (free with no attribution)
   https://mixkit.co/free-sound-effects/wave/
   Recommended: "Sea Waves Loop" or "Calm Beach"

   **Freesound** (CC0 only — filter by license)
   https://freesound.org/search/?q=ocean+waves&f=license:%22Creative+Commons+0%22
   Pick a 60s+ field recording with no human voices.

2. Download the file as MP3 (128–192 kbps is fine; lower = smaller bundle).

3. Save it to this directory as **`ocean.mp3`** — exactly that name.
   The player code looks for `/audio/ocean.mp3` specifically.

4. Commit + push. Vercel will pick it up on the next deploy.

5. Verify on a desktop: click the gold equaliser-bar icon in the
   top-right corner of the nav. You should hear the real ocean
   recording fade in instead of the synthesized one. The eq bars
   pulse gold while playing.

## File constraints

- **Format**: MP3 (HTML5 `<audio>` plays it natively in every browser)
- **Length**: 60–120 seconds (it loops)
- **Size**: under 2 MB for fast first-play; under 1 MB ideal
- **Quality**: hydrophone or beach field recording — no synth, no music
- **Content**: ocean waves only; NO seagulls, NO Greek voices, NO
  bouzouki (Boss directive — "πλούσιοι, αυτό όχι λαϊκό")

## Why we don't bundle a default file

A default ocean.mp3 in the repo would add ~1 MB to every clone +
Vercel build. We let the file land here optionally so the choice
of "what does the brand sound like" stays editorial.
