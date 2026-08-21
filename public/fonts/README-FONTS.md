# Self-hosted typefaces

Downloaded 2026-08-20 for the two-family system (design pass, job 14).
Served from `/fonts/`, which `next.config.mjs` sends with
`Cache-Control: public, max-age=31536000, immutable` (job 1).

| File | Family | Role | Size |
|---|---|---|---|
| `Stardom-Regular.woff2` | Stardom | Display: hero, h1, yacht names | 20.2 KB |
| `Switzer-Variable.woff2` | Switzer | Text: everything else, weights 100-900 in one file | 43.2 KB |
| `Switzer-VariableItalic.woff2` | Switzer italic | Emphasis, quotes | 33.4 KB |

96.8 KB for the whole system, against 174 KB before this pass.

## Source and licence

Both families are published by **Indian Type Foundry** via **Fontshare**
(https://www.fontshare.com), and both are released under the
**ITF Free Font License**, which the foundry states covers personal *and*
commercial use, including self-hosting.

- Stardom: https://www.fontshare.com/fonts/stardom (designer: Indian Type Foundry)
- Switzer: https://www.fontshare.com/fonts/switzer (designer: Jérémie Hornus)
- Licence text: https://www.fontshare.com/licenses/itf-ffl

The licence page renders client-side, so the text is not mirrored here rather
than being paraphrased inaccurately. Read it at the URL above before any use
beyond this site.

Switzer is not new to the project: it was already the workhorse before this
pass, loaded from the Fontshare CDN. The only change is that it is now served
from our own origin, which removes a render-blocking third-party stylesheet
and two TLS handshakes from every page load.

Greek is not covered by either family. It comes from **GFS Didot** (Greek Font
Society, OFL) via next/font/google, loaded without preload so it is fetched
only on pages that actually set Greek. See the note on the loaders in
`app/layout.jsx`.
