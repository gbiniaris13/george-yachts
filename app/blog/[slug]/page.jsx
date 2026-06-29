import React from "react";
import { notFound } from "next/navigation";
import { sanityClient, urlFor, withRetry } from "@/lib/sanity";
import { createClient } from "@sanity/client";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "@/components/RichTextComponents";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import JsonLd from "../../components/JsonLd";
import { generateArticleSchema } from "@/lib/articleSchema";
import RelatedArticles from "@/components/RelatedArticles";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogPostFooter from "@/components/BlogPostFooter";
import { autoLinkPortableText } from "@/lib/auto-link-content";

// Non-CDN client for real-time content fetching.
// withRetry — see lib/sanity.js: rides out transient CDN connect-timeouts
// at build time so one blip can't abort the whole deploy.
const freshClient = withRetry(
  createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-11-09",
    useCdn: false,
  })
);

export const revalidate = 60;

export async function generateStaticParams() {
  // 2026-05-12 — Sanity outage resilience. Return [] on fetch
  // error so the build doesn't crash; new posts render dynamically.
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  try {
    const slugs = await sanityClient.fetch(query);
    return slugs.map((post) => ({ slug: post.slug }));
  } catch (err) {
    console.error("blog/[slug] generateStaticParams fetch failed:", err);
    return [];
  }
}

async function getPost(slug) {
  // F.1 — pull `relatedYachts` (refs) so the BlogPostFooter can
  // render up to 3 yacht cards.
  //
  // F.3 — when an editor inserts a `yachtCallout` block inside the
  // post body, we dereference its `yacht` ref *inline* in the GROQ
  // result so RichTextComponents can render the callout without an
  // extra fetch. The portable-text walker keeps every other block
  // type intact via the `..` spread.
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    publishedAt,
    _createdAt,
    _updatedAt,
    author,
    excerpt,
    quickAnswer,
    mainImage,
    faqItems[]{ question, answer },
    body[]{
      ...,
      _type == "yachtCallout" => {
        ...,
        "yacht": yacht->{
          name, "slug": slug.current, length, sleeps,
          weeklyRatePrice, fleetTier, priceModel,
          "image": images[0].asset->url
        }
      }
    },
    "relatedYachts": relatedYachts[]->{
      name, "slug": slug.current, length, sleeps,
      weeklyRatePrice, fleetTier, priceModel,
      "image": images[0].asset->url
    }
  }`;
  return freshClient.fetch(query, { slug });
}

// F.1 fallback — when a post has no editor-curated `relatedYachts`, we
// still need to render the "Yachts to consider" block on every article
// (brief acceptance: "Every blog post displays this section"). Pulls a
// compact projection of every fleet yacht once per ISR window; the page
// then deterministically picks 3 keyed off the post slug so the same
// article always shows the same fallback trio (predictable + varied
// across the 19+ articles).
async function getFleetForFallback() {
  const query = `*[_type == "yacht" && defined(slug.current)] | order(name asc){
    name, "slug": slug.current, length, sleeps,
    weeklyRatePrice, fleetTier, priceModel,
    "image": images[0].asset->url
  }`;
  return freshClient.fetch(query).catch(() => []);
}

function pickFallbackYachts(slug, fleet) {
  if (!Array.isArray(fleet) || fleet.length === 0) return [];
  // Stable hash of the slug — sum of char codes mod fleet length picks
  // the starting offset. Take 3 consecutive yachts wrapping around.
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const offset = h % fleet.length;
  return [0, 1, 2].map((k) => fleet[(offset + k) % fleet.length]);
}

async function getRelatedPosts(currentSlug) {
  const query = `*[_type == "post" && slug.current != $currentSlug && defined(slug.current)] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt
  }`;
  return freshClient.fetch(query, { currentSlug });
}

/**
 * Extract FAQ-style Q&A pairs from Portable Text body.
 * Looks for H3 headings ending in "?" followed by a normal paragraph.
 */
function extractFAQs(body) {
  if (!body || !Array.isArray(body)) return [];
  const faqs = [];

  for (let i = 0; i < body.length; i++) {
    const block = body[i];
    if (block._type !== "block" || block.style !== "h3") continue;

    const questionText = (block.children || []).map((c) => c.text || "").join("");
    if (!questionText.trim().endsWith("?")) continue;

    const answerBlock = body[i + 1];
    if (!answerBlock || answerBlock._type !== "block" || answerBlock.style !== "normal") continue;

    const answerText = (answerBlock.children || []).map((c) => c.text || "").join("");
    if (answerText) {
      faqs.push({ question: questionText, answer: answerText });
    }
  }

  return faqs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  // No manual "| George Yachts" here — the layout's title.template
  // ("%s | George Yachts") appends the brand once. Adding it manually
  // produced "... | George Yachts | George Yachts" on every post
  // (found live 2026-06-10).
  if (!post) return { title: "Article Not Found" };

  let description = post.excerpt || null;

  if (!description && post.body) {
    const firstTextBlock = post.body.find(
      (block) => block._type === "block" && block.children
    );
    if (firstTextBlock) {
      const rawText = firstTextBlock.children
        .map((span) => span.text || "")
        .join("");
      description = rawText.slice(0, 155) || null;
    }
  }

  if (!description) {
    description = `Expert insights and maritime analysis: ${post.title}.`;
  }

  const ogImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : "https://georgeyachts.com/opengraph-image.png";

  const canonicalUrl = `https://georgeyachts.com/blog/${slug}`;

  return {
    title: `${post.title} | The Journal`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | The Journal | George Yachts`,
      description,
      url: canonicalUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | The Journal | George Yachts`,
      description,
      images: [ogImageUrl],
    },
  };
}

const ArticlePage = async ({ params }) => {
  const { slug } = await params;
  const [post, relatedPosts, fleetPool] = await Promise.all([
    getPost(slug),
    getRelatedPosts(slug),
    getFleetForFallback(),
  ]);

  if (!post) {
    // 2026-05-12 — was a JSX fallback returning HTTP 200 (soft 404),
    // which Google penalises because the URL appeared indexable.
    // notFound() triggers Next's real 404 path: HTTP 404 status +
    // app/not-found.jsx (cinematic page with smart-suggestion engine
    // from Item 6) renders for the visitor.
    notFound();
  }

  const articleSchema = generateArticleSchema({ ...post, slug });

  // Prefer the structured `faqItems` field (added 2026-05-14 — see
  // `lib/sanity-schema-post-faq.js` for the Studio paste). Fall back to
  // extracting H3-followed-by-paragraph from the body for legacy posts
  // that put their FAQ inline in the body editor.
  //
  // Only one path runs for any given post: structured > extracted.
  const structuredFaqs = Array.isArray(post.faqItems)
    ? post.faqItems.filter((f) => f && f.question && f.answer)
    : [];
  const faqs = structuredFaqs.length > 0
    ? structuredFaqs
    : extractFAQs(post.body);

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  // Stage 2 (Extra IA) - auto-link yacht NAMES in the body to their detail
  // pages, sourced live from Sanity so the map never goes stale. Clean name
  // (type prefix stripped) >= 5 chars only - the same substring threshold the
  // engine already uses for island/term names, so no new false-match risk.
  let yachtTerms = [];
  try {
    const fleet = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)]{ name, "slug": slug.current }`
    );
    const seen = new Set();
    for (const y of fleet || []) {
      const clean = (y.name || "")
        .replace(/^(M\/Y|S\/Y|S\/CAT|P\/CAT|M\/S|M\/C|S\/C|M\/V)\s+/i, "")
        .trim();
      if (clean.length >= 5 && !seen.has(clean)) {
        seen.add(clean);
        yachtTerms.push([clean, `/yachts/${y.slug}`]);
      }
    }
  } catch {
    yachtTerms = [];
  }

  // Auto-link keywords (Cyclades, APA, MYBA, etc.) + yacht names to internal pages
  const enhancedBody = autoLinkPortableText(post.body, yachtTerms);

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-sans selection:bg-[#C9A84C] selection:text-black">
      <JsonLd data={articleSchema} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://georgeyachts.com" },
          { "@type": "ListItem", "position": 2, "name": "The Journal", "item": "https://georgeyachts.com/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title }
        ]
      }) }} />

      {/* Visual breadcrumbs */}
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "The Journal", url: "/blog" },
        { name: post.title },
      ]} />

      {/* PURE TYPOGRAPHIC HERO */}
      <section className="relative w-full min-h-[60vh] md:min-h-[68vh] flex flex-col px-8 md:px-20 pt-16 pb-16 md:pb-24 overflow-hidden">
        {/* Subtle grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />

        {/* Gold top rule */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent mb-16" />

        {/* Top bar */}
        <div className="flex items-center justify-between w-full">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/50 hover:text-[#C9A84C] transition-colors duration-500 text-[9px] tracking-[0.55em] uppercase font-bold group"
          >
            <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            The Journal
          </Link>

          <div className="flex flex-col items-end gap-1">
            <span className="text-white/50 text-[9px] tracking-[0.55em] uppercase">
              {new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {post._updatedAt && post.publishedAt &&
              Math.abs(new Date(post._updatedAt) - new Date(post.publishedAt)) > 24 * 60 * 60 * 1000 && (
              <span className="text-[#C9A84C]/40 text-[8px] tracking-[0.4em] uppercase">
                Updated: {new Date(post._updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>

        {/* Typographic block — left on mobile, centered on desktop */}
        <div className="flex flex-col items-start md:items-center md:text-center flex-1 justify-center mt-12 md:mt-0">
          <div className="flex items-center space-x-4 mb-8">
            <span className="block w-8 h-px bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[9px] tracking-[0.6em] uppercase font-bold">
              Editorial
            </span>
            <span className="hidden md:block w-8 h-px bg-[#C9A84C]" />
          </div>

          <h1
            className="font-cormorant max-w-4xl"
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(40px, 7.5vw, 96px)",
              fontWeight: 300,
              color: "#F8F5F0",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              textShadow: "0 6px 32px rgba(13, 27, 42,0.55)",
            }}
          >
            {post.title}
          </h1>

          {/* Phase 1 (2026-05-08, E-E-A-T) — author byline now links
              to the author's full profile page when George is the
              listed author. Adds an "IYBA Member" credential pip
              right of the name (visible authority signal — Google
              + AI engines + readers all see expertise badge). */}
          <div className="flex items-center space-x-5 mt-10">
            <span className="block w-12 h-px bg-white/10" />
            <span className="text-white/50 text-[9px] tracking-[0.5em] uppercase">
              By {post.author === "George P. Biniaris" ? (
                <Link
                  href="/team/george-biniaris"
                  className="hover:text-[#C9A84C] transition-colors"
                  style={{ color: "rgba(248, 245, 240, 0.7)" }}
                >
                  {post.author}
                </Link>
              ) : (
                post.author
              )}
              {post.author === "George P. Biniaris" && (
                <>
                  {" · "}
                  <span style={{ color: "rgba(201, 168, 76, 0.65)" }}>
                    IYBA Member
                  </span>
                </>
              )}
            </span>
            <span className="block w-12 h-px bg-white/10" />
          </div>
        </div>

        {/* Bottom rule */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mt-14" />
      </section>

      {/* FULL-WIDTH EDITORIAL IMAGE — contain, no crop */}
      {post.imageUrl && (
        <section className="w-full px-8 md:px-20">
          <div className="relative w-full bg-[#0D1B2A]">
            <img
              src={`${post.imageUrl}?w=1400&fm=webp&q=75`}
              alt={post.imageAlt || post.title}
              className="w-full h-auto block"
              style={{ filter: "brightness(0.85) saturate(0.9)" }}
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0D1B2A] to-transparent" />
          </div>
        </section>
      )}

      {/* EDITORIAL BODY */}
      <section className="relative z-10 bg-[#0D1B2A] px-6 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center space-x-6 mb-16">
            <span className="block w-6 h-px bg-[#C9A84C]/50" />
            <span className="text-[#C9A84C]/50 text-[8px] tracking-[0.7em] uppercase">
              George Yachts &middot; Maritime Intelligence
            </span>
            <span className="block flex-1 h-px bg-white/5" />
          </div>

          {/* Boss directive 2026-05-08 — AI-search Quick Answer.
              When a Sanity post carries a `quickAnswer` field, render
              it as a 50-word direct answer block at the top of the
              article. This is the format Perplexity / ChatGPT /
              Google AI Overviews preferentially extract. Editorial
              workflow: Boss adds the field in Sanity Studio for the
              3-4 top-converting posts; future posts include it as a
              standard field. When missing, the block just doesn't
              render — no visual disruption. */}
          {post.quickAnswer && (
            <aside
              className="gy-quick-answer"
              aria-label="Quick answer"
              data-speakable="true"
              style={{
                borderLeft: "2px solid #C9A84C",
                padding: "20px 24px",
                margin: "0 0 56px",
                background: "rgba(201, 168, 76, 0.04)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  margin: "0 0 12px",
                }}
              >
                Quick Answer
              </p>
              <p
                className="gy-qa-text"
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "17px",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(248, 245, 240, 0.88)",
                  margin: 0,
                }}
              >
                {post.quickAnswer}
              </p>
            </aside>
          )}

          <article className="editorial-content [&_p]:mb-10 [&_p]:leading-[2] [&_p]:text-white/60 [&_p]:text-[1.05rem] [&_p:first-of-type]:text-white/80 [&_p:first-of-type]:text-[1.15rem] [&_p:first-of-type]:leading-[1.85]">
            <PortableText value={enhancedBody} components={RichTextComponents} />
          </article>

          {/* End-of-article marker */}
          <div className="mt-20 pt-16 border-t border-white/[0.04] flex flex-col items-center space-y-5">
            <span className="text-[#C9A84C]/25 text-4xl font-marcellus select-none">
              &#10022;
            </span>
            <p className="text-white/50 text-[8px] tracking-[0.7em] uppercase">
              George Yachts Brokerage Editorial
            </p>
          </div>

          {/* Bottom back link */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/50 hover:text-[#C9A84C] transition-colors duration-500 text-[9px] tracking-[0.55em] uppercase font-bold group"
            >
              <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Return to The Journal
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently asked questions — visible section, only renders when
          the post has a structured `faqItems` field (legacy posts that
          put FAQs inline as H3-in-body skip this to avoid duplication;
          their FAQ JSON-LD is still emitted via extractFAQs above). */}
      {structuredFaqs.length > 0 && (
        <section className="relative z-10 bg-[#0D1B2A] px-6 pb-20 md:pb-28">
          <div className="max-w-[720px] mx-auto">
            <div className="flex items-center space-x-6 mb-12">
              <span className="block w-6 h-px bg-[#C9A84C]/50" />
              <span className="text-[#C9A84C]/50 text-[8px] tracking-[0.7em] uppercase">
                Frequently Asked
              </span>
              <span className="block flex-1 h-px bg-white/5" />
            </div>

            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                color: "#F8F5F0",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: "0 0 40px",
              }}
            >
              Frequently asked questions
            </h2>

            <div className="space-y-2">
              {structuredFaqs.map((item, idx) => (
                <details
                  key={idx}
                  className="group border-b border-white/[0.07] py-6"
                >
                  <summary
                    className="cursor-pointer list-none flex items-start justify-between gap-6 text-white/85 hover:text-[#C9A84C] transition-colors duration-300"
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: "20px",
                      fontWeight: 400,
                      lineHeight: 1.35,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[#C9A84C]/70 transition-transform duration-300 group-open:rotate-45"
                      style={{ fontSize: "20px", lineHeight: 1 }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-5 text-white/65"
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.85,
                      fontWeight: 300,
                    }}
                  >
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* F.1 + F.2 — Yachts to consider + author bio. Sits BEFORE
          related articles so the highest-conversion path (yacht
          inquiry) is offered first. */}
      <BlogPostFooter
        relatedYachts={
          Array.isArray(post.relatedYachts) && post.relatedYachts.length > 0
            ? post.relatedYachts
            : pickFallbackYachts(slug, fleetPool)
        }
      />

      <RelatedArticles posts={relatedPosts} />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ArticlePage;
