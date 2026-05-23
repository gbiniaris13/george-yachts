// /cabin/mood-board — touch ②
"use client";

import { useEffect, useRef, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

// Client-side image compression — Canvas API, no deps.
// Returns a JPEG Blob no wider/taller than `maxEdge` px.
async function compressImage(file, maxEdge = 2000, quality = 0.82) {
  const buf = await file.arrayBuffer();
  const blob = new Blob([buf], { type: file.type });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    let { width, height } = img;
    if (width > maxEdge || height > maxEdge) {
      const ratio = Math.min(maxEdge / width, maxEdge / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("compress-failed"))),
        "image/jpeg",
        quality
      )
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function MoodBoardPage() {
  const [items, setItems] = useState(null);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  async function load() {
    try {
      const j = await (await fetch("/api/cabin/mood-board")).json();
      setItems(j.items ?? []);
    } catch {
      setItems([]);
    }
  }
  useEffect(() => { void load(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/cabin/mood-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url.trim(), caption: caption.trim() }),
      });
      const j = await r.json();
      if (!r.ok) {
        // 2026-05-23 — the API now returns a `hint` when an image
        // URL can't be fetched (Pinterest hotlink protection,
        // dead link, etc.). Show the hint verbatim — it tells the
        // user exactly what to do next ("upload the image instead").
        if (j.hint) throw new Error(j.hint);
        throw new Error(j.error || "save-failed");
      }
      setUrl("");
      setCaption("");
      void load();
    } catch (err) {
      setError(
        err.message === "url-must-be-https"
          ? "Please paste a secure (https://) image link."
          : err.message && err.message.length > 25
          ? err.message
          : "Could not add that. Try again in a moment."
      );
    }
    setSubmitting(false);
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";        // allow re-selecting same file
    if (!file) return;
    // Accept any image MIME (incl. iPhone HEIC). We re-encode to
    // JPEG client-side before upload via Canvas; the server only
    // ever sees image/jpeg. If the browser can't decode the source
    // (e.g. HEIC on Chrome desktop), compressImage rejects and the
    // catch surfaces a friendly error.
    if (!/^image\//.test(file.type)) {
      setError("Please choose a photo (JPG, PNG, WebP, HEIC).");
      return;
    }
    setError(null);
    setUploadProgress("compressing");
    try {
      const compressed = await compressImage(file);
      setUploadProgress("uploading");
      const form = new FormData();
      form.append("file", compressed, file.name.replace(/\.\w+$/, "") + ".jpg");
      if (caption.trim()) form.append("caption", caption.trim());
      const r = await fetch("/api/cabin/mood-board/upload", {
        method: "POST",
        body: form,
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "upload-failed");
      setCaption("");
      void load();
    } catch (err) {
      const m = err?.message;
      setError(
        m === "too-large"
          ? "That image is too large even after compression. Try a smaller one."
          : m === "compress-failed"
          ? "We could not read that photo on this browser. Try saving it as a JPG first."
          : "Upload failed. Try again in a moment."
      );
    } finally {
      setUploadProgress(null);
    }
  }

  async function onRemove(id) {
    setItems((prev) => (prev ?? []).filter((i) => i.id !== id));
    await fetch("/api/cabin/mood-board", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <article>
      <SectionTitle
        kicker="A private place for inspiration"
        title="Pin the"
        italic="vibe."
      />
      <IntroParagraph>
        Photographs of sunsets, dishes, atmospheres, music covers — whatever
        captures the feeling of the week you want. Paste any image link
        (Pinterest, Unsplash, your camera roll uploaded somewhere) and your
        captain will see your mood, not just your checkboxes.
      </IntroParagraph>

      <div className="mood-add">
        <div className="mood-add__caption-row">
          <input
            type="text"
            placeholder="A short caption (applies to next pin) — optional"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={240}
            className="mood-add__caption"
          />
        </div>

        <div className="mood-add__actions">
          <label className="mood-add__upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onUpload}
              disabled={uploadProgress !== null}
              style={{ display: "none" }}
            />
            <span>
              {uploadProgress === "compressing" ? "Preparing…"
                : uploadProgress === "uploading" ? "Uploading…"
                : "Upload a photo"}
            </span>
          </label>

          <span className="mood-add__or">or</span>

          <form className="mood-add__paste" onSubmit={onAdd}>
            <input
              type="url"
              inputMode="url"
              placeholder="paste an https:// image link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mood-add__url"
            />
            <button type="submit" disabled={submitting || !url.trim()} className="mood-add__btn">
              {submitting ? "Pinning…" : "Pin link"}
            </button>
          </form>
        </div>

        {error && <p className="mood-add__error">{error}</p>}
      </div>

      <div className="mood-grid">
        {items === null && <SkeletonGrid />}
        {items?.length === 0 && (
          /* 2026-05-21 — Pass 7 (Helen): "for an art collector who
              would use this tool most, the empty state offers nothing
              to react to. As shipped, it looks like a feature that
              was scoped but not designed."
              The board now opens with four CSS-gradient placeholders
              evoking the Greek visual register (Cycladic blue,
              taverna marble, Aegean horizon, olive grove). They are
              labelled as inspiration — not the user's pins — and
              quietly disappear once the user adds anything. No
              external assets used: no photos to license, no risk of
              an example image stealing focus from the customer's
              own taste. */
          <>
            <p className="mood-empty">
              Your Mood Board is empty. Below — four moments from the
              Greek visual register. Pin your own as you go, and these
              quietly step aside.
            </p>
            {/* 2026-05-23 — George: "λίγο περίεργα, λίγο φτηνά. Να
                φαίνεται πολύ πιο ακριβό. Multimillion, πολυεθνική
                εταιρεία yachting, boutique εταιρεία yachting."
                Rebuilt as museum-plate cards: portrait 4:5 aspect,
                gold-rule inner border, plate numbering, bilingual
                Greek/English captions, layered painterly gradients
                with SVG film grain for that editorial-print finish.
                Still no asset round-trip — pure CSS + inline SVG
                so it survives any deploy. */}
            <div className="mood-grid__plates" aria-hidden>
              <figure className="mood-plate mood-plate--blue">
                <div className="mood-plate__art" />
                <figcaption className="mood-plate__caption">
                  <span className="mood-plate__num">Plate 01</span>
                  <span className="mood-plate__name">Cycladic blue</span>
                  <span className="mood-plate__gloss">Κυκλάδες, μεσημέρι</span>
                </figcaption>
              </figure>
              <figure className="mood-plate mood-plate--marble">
                <div className="mood-plate__art" />
                <figcaption className="mood-plate__caption">
                  <span className="mood-plate__num">Plate 02</span>
                  <span className="mood-plate__name">Taverna marble</span>
                  <span className="mood-plate__gloss">Τραπέζι σε σκιά</span>
                </figcaption>
              </figure>
              <figure className="mood-plate mood-plate--horizon">
                <div className="mood-plate__art" />
                <figcaption className="mood-plate__caption">
                  <span className="mood-plate__num">Plate 03</span>
                  <span className="mood-plate__name">An Aegean horizon</span>
                  <span className="mood-plate__gloss">Ηλιοβασίλεμα</span>
                </figcaption>
              </figure>
              <figure className="mood-plate mood-plate--olive">
                <div className="mood-plate__art" />
                <figcaption className="mood-plate__caption">
                  <span className="mood-plate__num">Plate 04</span>
                  <span className="mood-plate__name">Old olive grove</span>
                  <span className="mood-plate__gloss">Ξεροκαλόκαιρο</span>
                </figcaption>
              </figure>
            </div>
          </>
        )}
        {items?.map((it) => (
          <figure key={it.id} className="mood-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* 2026-05-23 — referrerPolicy="no-referrer" is a defence
                for any legacy rows where image_path is still a raw
                external URL (pre-2026-05-23 rows where we hadn't yet
                shipped the server-side rehost). Pinterest et al check
                the Referer header — sending none bypasses hotlink
                protection. New rows are stored in our bucket and
                this attribute is a no-op for them. */}
            <img
              src={it.display_url || it.image_path}
              alt={it.caption || ""}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {it.caption && <figcaption>{it.caption}</figcaption>}
            <button
              type="button"
              aria-label="Remove"
              className="mood-card__remove"
              onClick={() => onRemove(it.id)}
            >
              ×
            </button>
          </figure>
        ))}
      </div>

      <style>{`
        .mood-add {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 18px;
          margin-top: 28px;
          margin-bottom: 28px;
        }
        .mood-add__caption-row { margin-bottom: 14px; }
        .mood-add__caption {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13,27,42,0.18);
          padding: 8px 0 9px;
          font-family: var(--gy-font-body);
          font-size: 14px;
          color: var(--gy-navy);
          outline: none;
        }
        .mood-add__caption:focus { border-bottom-color: var(--gy-gold); }
        .mood-add__actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mood-add__upload {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 11px 22px;
          border: 1px solid var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 160ms ease;
          display: inline-block;
        }
        .mood-add__upload:hover { background: #142233; }
        .mood-add__or {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(13,27,42,0.45);
          font-size: 13px;
        }
        .mood-add__paste {
          display: flex;
          gap: 8px;
          flex: 1;
          min-width: 220px;
        }
        .mood-add__url {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13,27,42,0.18);
          padding: 8px 0 9px;
          font-family: var(--gy-font-body);
          font-size: 13px;
          color: var(--gy-navy);
          outline: none;
        }
        .mood-add__url:focus { border-bottom-color: var(--gy-gold); }
        .mood-add__btn {
          background: transparent;
          color: var(--gy-navy);
          padding: 9px 16px;
          border: 1px solid rgba(13,27,42,0.2);
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .mood-add__btn:hover:not(:disabled) {
          color: var(--gy-gold);
          border-color: var(--gy-gold);
        }
        .mood-add__btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .mood-add__error {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 10px 0 0 0;
        }

        .mood-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .mood-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .mood-empty {
          grid-column: 1 / -1;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(13,27,42,0.55);
          text-align: center;
          padding: 28px 18px 14px;
          font-size: 14.5px;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }
        /* 2026-05-23 — Museum-plate cards. The previous CSS-gradient
           swatches read as a Bootstrap demo (George: "λίγο φτηνά").
           Same constraint (no external assets, no licensing risk) +
           a much more boutique presentation:
             • 4:5 portrait aspect (gallery-print proportions)
             • painterly layered conic + radial gradients
             • SVG film-grain noise overlay (turbulence, 0.65 alpha)
             • thin gold inner border (inset shadow trick)
             • plate-number eyebrow + serif italic name + Greek gloss
             • hover lift + brighten for that "click me" affordance
           Drops out of the DOM the moment the user pins one real
           image, so the principal's own taste takes over. */
        .mood-grid__plates {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 8px;
        }
        @media (min-width: 768px) {
          .mood-grid__plates { grid-template-columns: repeat(4, 1fr); gap: 22px; }
        }
        .mood-plate {
          margin: 0;
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #0D1B2A;
          /* Inner gold rule — the inset-shadow trick is sharper
             than a real border because it sits ABOVE the art and
             never pushes the edges around. */
          box-shadow:
            inset 0 0 0 1px rgba(201, 168, 76, 0.55),
            0 6px 18px rgba(13, 27, 42, 0.18);
          transition: transform 320ms ease, box-shadow 320ms ease;
          cursor: default;
        }
        .mood-plate:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 0 0 1px rgba(201, 168, 76, 0.85),
            0 12px 28px rgba(13, 27, 42, 0.28);
        }
        /* Painterly art layer — fills the card, gets the film-grain
           overlay through a CSS background-image with an inline SVG
           turbulence filter (no asset request). */
        .mood-plate__art {
          position: absolute;
          inset: 0;
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>");
          background-size: 240px 240px;
        }
        /* Each plate's painterly base — multi-stop, slightly conic
           where it helps to suggest light direction. */
        .mood-plate--blue .mood-plate__art {
          background-color: #2a5e87;
          background-image:
            radial-gradient(at 25% 15%, rgba(255,255,255,0.42), transparent 55%),
            radial-gradient(at 75% 90%, rgba(8,30,60,0.55), transparent 60%),
            linear-gradient(178deg, #c9e1f0 0%, #6ea4c8 38%, #3a76a3 72%, #1c4670 100%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
        }
        .mood-plate--marble .mood-plate__art {
          background-color: #e8e0cd;
          background-image:
            radial-gradient(at 22% 18%, rgba(255,255,255,0.7), transparent 55%),
            radial-gradient(at 78% 78%, rgba(60,50,30,0.18), transparent 60%),
            conic-gradient(from 200deg at 50% 60%, #f5f1e8, #e8dec5, #cdc2a3, #ddd4c1, #f5f1e8),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>");
        }
        .mood-plate--horizon .mood-plate__art {
          background-color: #5d8aa8;
          background-image:
            radial-gradient(at 70% 25%, rgba(255,210,160,0.72), transparent 48%),
            linear-gradient(180deg, #f7c98e 0%, #ecae7a 22%, #c7a896 42%, #7a99b0 62%, #2e547a 100%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
        }
        .mood-plate--olive .mood-plate__art {
          background-color: #5c6147;
          background-image:
            radial-gradient(at 30% 35%, rgba(140,150,108,0.65), transparent 55%),
            radial-gradient(at 75% 80%, rgba(40,45,30,0.55), transparent 60%),
            linear-gradient(160deg, #c8c4a4 0%, #8b9070 50%, #475234 100%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
        }
        /* Caption block — editorial typography over a deep navy
           gradient veil so it reads cleanly against any plate. */
        .mood-plate__caption {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 50px 14px 16px 14px;
          background: linear-gradient(to top,
            rgba(13, 27, 42, 0.78) 0%,
            rgba(13, 27, 42, 0.55) 55%,
            transparent 100%);
          color: #F8F5F0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 1;
        }
        .mood-plate__num {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.95);
          font-weight: 600;
        }
        .mood-plate__name {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 17px;
          line-height: 1.2;
          color: #F8F5F0;
          letter-spacing: 0.1px;
        }
        .mood-plate__gloss {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(248, 245, 240, 0.7);
        }
        /* Marble plate is light — invert caption veil so text stays
           white-on-dark instead of fighting cream. */
        .mood-plate--marble .mood-plate__caption {
          background: linear-gradient(to top,
            rgba(13, 27, 42, 0.85) 0%,
            rgba(13, 27, 42, 0.65) 55%,
            transparent 100%);
        }
        .mood-card {
          margin: 0;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          position: relative;
          overflow: hidden;
        }
        .mood-card img {
          display: block;
          width: 100%;
          height: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }
        .mood-card figcaption {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13,27,42,0.7);
          padding: 8px 10px 10px 10px;
          border-top: 1px solid rgba(13,27,42,0.06);
        }
        .mood-card__remove {
          position: absolute;
          top: 6px; right: 6px;
          background: rgba(13,27,42,0.7);
          color: var(--gy-ivory);
          width: 24px;
          height: 24px;
          border: 0;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          opacity: 0;
          transition: opacity 160ms ease;
        }
        .mood-card:hover .mood-card__remove { opacity: 1; }
      `}</style>
    </article>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mood-skel">
          <style jsx>{`
            .mood-skel {
              aspect-ratio: 1;
              background: linear-gradient(90deg,
                rgba(13,27,42,0.06) 25%,
                rgba(13,27,42,0.12) 37%,
                rgba(13,27,42,0.06) 63%);
              background-size: 400% 100%;
              animation: shimmer 1.4s infinite;
            }
            @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
          `}</style>
        </div>
      ))}
    </>
  );
}
