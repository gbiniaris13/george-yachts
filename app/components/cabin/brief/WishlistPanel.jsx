"use client";

// app/components/cabin/brief/WishlistPanel.jsx
// =============================================================
// 2026-05-23 — Multi-user Brief (Phase 3, MUB-C).
//
// Optional "specific items" wishlist mounted at the bottom of
// every collaborative section (dining + beverages). George's
// spec:
//
//   "Συνήθως δεν γράφει ο πελάτης 12 μπίρες και 24 κοκακόλες
//    — η hostess αποφασίζει. Αλλά αν ο πελάτης θέλει να πάρει
//    ένα μπουκάλι τεκίλα ή 12 ουίσια, να έχει την επιλογή να
//    μπορεί να το κάνει, αν θέλει, να είναι optional."
//
// UI choices:
//   • Collapsed by default (<details>) — never demand the user
//     interact with it. The frequency picks above are the main
//     event; this is the optional escape hatch.
//   • Existing items rendered as cream cards: label (bold) +
//     optional quantity + optional notes + "added by [Name]"
//     attribution + remove × (only when the caller is allowed).
//   • Add form: label (required) + quantity (optional, free
//     text "1 bottle", "12 bottles") + notes (optional).
//   • All writes go through /api/cabin/brief/wishlist/:section
//     which enforces auth + lock + ownership for removal.
//
// Shared per cabin per section — anyone can add, everyone sees.
// =============================================================

import { useEffect, useState } from "react";

const SECTION_COPY = {
  dining: {
    title: "Specific dishes you'd like named",
    intro:
      "Optional. The chef provisions from your group's food preferences above — but if there's a dish, brand, or cut you'd like to name explicitly (a particular wagyu cut, a specific cheese, the brand of olive oil you love), add it here. The whole group sees the list as it grows.",
    placeholder: "e.g. Wagyu A5 ribeye · Maldon flaky salt · La Tourangelle walnut oil",
  },
  beverages: {
    title: "Specific bottles, brands or labels",
    intro:
      "Optional. The hostess provisions from your group's frequency picks above — but if there's a bottle, brand or label you'd like named explicitly (a particular tequila, a vintage champagne, a single malt you love), add it here. The whole group sees the list as it grows.",
    placeholder: "e.g. Don Julio 1942 · Krug Grande Cuvée · Talisker 10",
  },
};

export default function WishlistPanel({ sectionKey }) {
  const [items, setItems] = useState(null); // null = loading
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [label, setLabel] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [locked, setLocked] = useState(false);

  async function refresh() {
    try {
      const r = await fetch(`/api/cabin/brief/wishlist/${sectionKey}`, {
        credentials: "same-origin",
      });
      if (!r.ok) throw new Error("load-failed");
      const j = await r.json();
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  async function onAdd(e) {
    e?.preventDefault?.();
    setError(null);
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Please write what you'd like to add.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(`/api/cabin/brief/wishlist/${sectionKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          label: trimmed,
          quantity: quantity.trim(),
          notes: notes.trim(),
        }),
      });
      const j = await r.json();
      if (r.status === 423) {
        setLocked(true);
        setError("The brief is locked — no more changes for now.");
        return;
      }
      if (!r.ok || !j.ok) {
        throw new Error(j?.error || "save-failed");
      }
      setLabel("");
      setQuantity("");
      setNotes("");
      await refresh();
    } catch (err) {
      setError("Could not add just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(id) {
    if (!window.confirm("Remove this item from the group wishlist?")) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(
        `/api/cabin/brief/wishlist/${sectionKey}?id=${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "same-origin" },
      );
      if (r.status === 423) {
        setLocked(true);
        setError("The brief is locked — items can no longer be removed.");
        return;
      }
      if (!r.ok) throw new Error("remove-failed");
      await refresh();
    } catch {
      setError("Could not remove just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (items === null) return null;
  const copy = SECTION_COPY[sectionKey] || SECTION_COPY.dining;

  return (
    <details className="wlp">
      <summary>
        <span className="wlp__eyebrow">{copy.title}</span>
        <span className="wlp__count">
          {items.length === 0
            ? "Optional — open to add"
            : `${items.length} added${
                items.length === 1 ? "" : ""
              } · open to add more`}
        </span>
      </summary>

      <div className="wlp__body">
        <p className="wlp__intro">{copy.intro}</p>

        {items.length > 0 && (
          <ul className="wlp__items">
            {items.map((it) => (
              <li key={it.id} className="wlp__item">
                <div className="wlp__item-main">
                  <strong>{it.label}</strong>
                  {it.quantity && (
                    <span className="wlp__qty"> · {it.quantity}</span>
                  )}
                  {it.notes && (
                    <p className="wlp__notes">
                      <em>{it.notes}</em>
                    </p>
                  )}
                  <span className="wlp__attribution">
                    added by {it.addedByName}
                  </span>
                </div>
                {it.canRemove && !locked && (
                  <button
                    type="button"
                    className="wlp__remove"
                    onClick={() => onRemove(it.id)}
                    disabled={busy}
                    aria-label={`Remove ${it.label}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {!locked && (
          <form className="wlp__form" onSubmit={onAdd} noValidate>
            <label className="wlp__field">
              <span>Item</span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={copy.placeholder}
                maxLength={200}
                required
              />
            </label>
            <div className="wlp__grid-2">
              <label className="wlp__field">
                <span>Quantity (optional)</span>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 1 bottle · 12 bottles · 1 case"
                  maxLength={100}
                />
              </label>
              <label className="wlp__field">
                <span>Notes (optional)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. for the birthday on day 4"
                  maxLength={500}
                />
              </label>
            </div>
            <div className="wlp__actions">
              <button
                type="submit"
                className="wlp__add"
                disabled={busy || !label.trim()}
              >
                {busy ? "Adding…" : "Add to wishlist"}
              </button>
              {error && (
                <p className="wlp__err" role="alert">
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .wlp {
          margin: 28px 0 0 0;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 3px;
        }
        .wlp > summary {
          cursor: pointer;
          list-style: none;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }
        .wlp > summary::before {
          content: "+ ";
          color: var(--gy-gold);
          font-weight: 600;
        }
        .wlp[open] > summary::before { content: "− "; }
        .wlp__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: var(--gy-navy);
          font-weight: 600;
        }
        .wlp__count {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13, 27, 42, 0.6);
        }
        .wlp__body {
          padding: 0 20px 20px;
        }
        .wlp__intro {
          margin: 0 0 16px 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13.5px;
          color: rgba(13, 27, 42, 0.7);
          line-height: 1.6;
        }
        .wlp__items {
          list-style: none;
          margin: 0 0 18px 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wlp__item {
          background: #ffffff;
          border: 1px solid rgba(201, 168, 76, 0.22);
          border-radius: 3px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: flex-start;
        }
        .wlp__item-main {
          flex: 1;
          min-width: 0;
        }
        .wlp__item strong {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          font-weight: 500;
        }
        .wlp__qty {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          color: rgba(13, 27, 42, 0.65);
        }
        .wlp__notes {
          margin: 4px 0 0 0;
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.65);
          line-height: 1.55;
        }
        .wlp__attribution {
          display: block;
          margin-top: 4px;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.5);
        }
        .wlp__remove {
          background: transparent;
          border: 1px solid rgba(13, 27, 42, 0.18);
          color: rgba(13, 27, 42, 0.5);
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .wlp__remove:hover:not(:disabled) {
          color: #b14a3a;
          border-color: #b14a3a;
        }
        .wlp__form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px dashed rgba(13, 27, 42, 0.12);
        }
        .wlp__field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .wlp__field > span {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.65);
          font-weight: 600;
        }
        .wlp__field input {
          font-family: var(--gy-font-editorial);
          font-size: 16px;
          padding: 11px 12px;
          border: 1px solid rgba(13, 27, 42, 0.18);
          background: #ffffff;
          color: var(--gy-navy);
          border-radius: 3px;
          width: 100%;
          box-sizing: border-box;
        }
        .wlp__field input:focus {
          outline: none;
          border-color: var(--gy-gold);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.18);
        }
        .wlp__grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .wlp__grid-2 { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
        .wlp__actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .wlp__add {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 12px 22px;
          cursor: pointer;
          font-weight: 500;
          min-height: 44px;
        }
        .wlp__add:hover:not(:disabled) { background: #142233; }
        .wlp__add:disabled { opacity: 0.55; cursor: default; }
        .wlp__err {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: #b14a3a;
        }
      `}</style>
    </details>
  );
}
