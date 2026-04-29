// Issue #1 — The Bridge — founder-note edition.
// Brief §17 verbatim with the boardroom's 2026-04-29 amendment that
// George flagged for the first real subscriber (royalairtrip): the
// "you are among the first" warmth line.

export const ISSUE_1_SUBJECT = "A small thing I'll send from the Greek waters";
export const ISSUE_1_PREHEADER = "The Bridge — Issue #1 from George Yachts.";

export const ISSUE_1_BODY_TEXT = `Hi from Athens.

This is the first issue of what I'm calling The Bridge — a short read I'll send every other Thursday from the Greek waters.

I run George Yachts. We are a boutique yacht charter brokerage, exclusively in Greek waters. I'm a working broker — that means I spend half my time on the bridge of a vessel and the other half in conversations with captains, crew, and clients. I know our fleet personally because I've stood on most of these decks.

The Bridge will be short. It will not pitch. Each issue will give you one thing worth knowing — a market signal, a story from a charter, a small piece of insider intel about a yacht or a stretch of water. The kind of thing I'd tell a friend asking "what should I know about the Greek summer?"

You will not get a calendar of yachts to book. You will not get discount codes. If something specific catches your interest, you hit reply and I'll personally pull options for your dates.

A few things you should know about how I work:

— Greek waters only. Cyclades, Saronic, Ionian, Sporades. Nowhere else. This is what I know.

— Filotimo. The Greek word for the genuine care that comes from honor, not from transaction. It's the operating principle of George Yachts. You'll see it in how we communicate, what we recommend, and what we refuse.

— Working broker, not corporate. When you reply to this email, it goes to me. george@georgeyachts.com. Always.

You are among the first to receive The Bridge. If something matters more to you than what's on this page, just hit reply — I read every one.

You're receiving Issue #1 because either you signed up at georgeyachts.com, or we've spoken before about chartering and I thought you'd want to know about this. If neither, hit unsubscribe below and you'll never hear from me through this channel again — no hard feelings.

Issue #2 lands in two weeks. I'll have something for you.

Welcome aboard.

— George

George Biniaris
Managing Broker, George Yachts
georgeyachts.com`;

export const ISSUE_1_WORD_COUNT = ISSUE_1_BODY_TEXT.trim().split(/\s+/).length;
// Reading time at ~220 wpm (the standard for journalism content).
export const ISSUE_1_READING_TIME_MIN = Math.max(
  1,
  Math.round(ISSUE_1_WORD_COUNT / 220),
);

/**
 * Hero image candidates for Issue #1. Brief §17.3 prefers a helm shot
 * from a premium motor yacht (or any Power Cat helm tagged
 * `newsletter-eligible`). For first send we lean on what's already
 * served from the live homepage of georgeyachts.com — a vetted asset
 * George has already approved for public use. He'll see it in the
 * Telegram approval card before sending.
 */
export const ISSUE_1_HERO_IMAGE_URL =
  // Sanity helm shot — used on the homepage hero for ALTEYA.
  // Falls into the curation rules: composition, helm angle, premium
  // motor yacht, ≥1600px on long side.
  "https://cdn.sanity.io/images/ecqr94ey/production/12400bb1c4f4826cc5c4f038f77ccb200c655455-2240x1680.jpg?w=1600&q=85&fit=max&auto=format";
