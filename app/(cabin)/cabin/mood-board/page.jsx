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
      if (!r.ok) throw new Error(j.error || "save-failed");
      setUrl("");
      setCaption("");
      void load();
    } catch (err) {
      setError(
        err.message === "url-must-be-https"
          ? "Please paste a secure (https://) image link."
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
              Your Mood Board is empty. These are the kinds of moments
              guests pin here — replace them with your own as you go.
            </p>
            <div className="mood-grid__seeds" aria-hidden>
              <figure className="mood-seed mood-seed--blue">
                <figcaption>Cycladic blue</figcaption>
              </figure>
              <figure className="mood-seed mood-seed--marble">
                <figcaption>Taverna marble at noon</figcaption>
              </figure>
              <figure className="mood-seed mood-seed--horizon">
                <figcaption>An Aegean horizon</figcaption>
              </figure>
              <figure className="mood-seed mood-seed--olive">
                <figcaption>Old olive, dry summer</figcaption>
              </figure>
            </div>
          </>
        )}
        {items?.map((it) => (
          <figure key={it.id} className="mood-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.display_url || it.image_path} alt={it.caption || ""} loading="lazy" />
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
        /* 2026-05-21 — Pass 7 (Helen) — inspiration seeds.
           Pure CSS gradients, no asset round-trip. They are clearly
           NOT photographs (no faces, no specific places) so they
           inspire without competing with whatever the user pins.
           Drops out of the DOM completely once the user adds even
           one real pin — items.length === 0 is the only render
           condition above. */
        .mood-grid__seeds {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 4px;
        }
        @media (min-width: 768px) {
          .mood-grid__seeds { grid-template-columns: repeat(4, 1fr); }
        }
        .mood-seed {
          margin: 0;
          position: relative;
          aspect-ratio: 1;
          border: 1px solid rgba(13,27,42,0.08);
          overflow: hidden;
        }
        .mood-seed figcaption {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 8px 10px;
          background: linear-gradient(to top, rgba(13,27,42,0.55), transparent);
          color: #ffffff;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          letter-spacing: 0.1px;
        }
        .mood-seed--blue {
          background: linear-gradient(180deg, #b9d7ec 0%, #6ea4c8 55%, #2a5e87 100%);
        }
        .mood-seed--marble {
          background:
            radial-gradient(at 30% 20%, rgba(255,255,255,0.5), transparent 50%),
            radial-gradient(at 70% 80%, rgba(13,27,42,0.08), transparent 60%),
            linear-gradient(135deg, #f5f1e8 0%, #ddd4c1 100%);
        }
        .mood-seed--horizon {
          background:
            linear-gradient(180deg, #f3d6a7 0%, #e9b985 35%, #9bb8c8 60%, #5d8aa8 100%);
        }
        .mood-seed--olive {
          background:
            radial-gradient(at 40% 60%, rgba(95,107,73,0.55), transparent 55%),
            linear-gradient(160deg, #c8c4a4 0%, #8b9070 50%, #5c6147 100%);
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
