import React from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { createClient } from "@sanity/client";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import BlogGrid from "./BlogGrid";
import "@/styles/blog.css";

// Non-CDN client for server-side fetches that need real-time data
const freshClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-11-09",
  useCdn: false,
});

export const revalidate = 60;

export const metadata = {
  title: "The Journal | Luxury Yacht Charter Insights | George Yachts",
  description:
    "Expert editorial, market analysis, and insider insights on luxury yacht charter in Greece. Booking guides, itinerary tips, industry trends. By George P. Biniaris, Managing Broker.",
  alternates: { canonical: "https://georgeyachts.com/blog" },
  openGraph: {
    title: "The Journal | George Yachts Maritime Intelligence",
    description: "Expert insights on luxury yacht charter in Greece. Booking guides, market trends, insider tips from an IYBA member broker.",
    url: "https://georgeyachts.com/blog",
    type: "website",
  },
};

const BLOG_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  author,
  "bodyLength": length(pt::text(body))
}`;

// Roberto 2026-05-04 (link-audit fix) — pull every yacht so the
// blog index can render an internal-link strip at the bottom. The
// audit flagged 8+ yacht detail pages as orphans because they were
// only linked from /charter-yacht-greece. Cross-linking from /blog
// (a high-authority hub) gives every yacht a second internal route.
const FLEET_TEASER_QUERY = `*[_type == "yacht" && defined(slug.current)] {
  name,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
} | order(name asc)`;

function BlogListSchema(posts) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Journal — George Yachts Maritime Intelligence",
    description: "Expert editorial, market analysis, and insider insights on luxury yacht charter in Greece.",
    url: "https://georgeyachts.com/blog",
    publisher: {
      "@type": "Organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          headline: post.title,
          url: `https://georgeyachts.com/blog/${post.slug}`,
          image: post.imageUrl,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: "George P. Biniaris",
            jobTitle: "Managing Broker",
          },
          publisher: {
            "@type": "Organization",
            name: "George Yachts Brokerage House LLC",
          },
        },
      })),
    },
  };
  return schema;
}

export default async function BlogPage() {
  let posts = [];
  let fleetTeaser = [];
  try {
    [posts, fleetTeaser] = await Promise.all([
      freshClient.fetch(BLOG_QUERY, {}, { next: { tags: ['posts'], revalidate: 60 } }),
      sanityClient.fetch(FLEET_TEASER_QUERY),
    ]);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }

  const jsonLdSchema = BlogListSchema(posts);

  return (
    <div className="min-h-screen bg-black selection:bg-[#DAA520] selection:text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} />

      {/* HERO */}
      <header className="blog-hero">
        <div className="blog-hero__grain" />
        <div className="blog-hero__content">
          <p className="blog-hero__eyebrow">George Yachts Editorial</p>
          <h1 className="blog-hero__title">The Journal</h1>
          <div className="blog-hero__line" />
          <div className="blog-hero__meta">
            <span className="blog-hero__meta-line" />
            <p className="blog-hero__meta-text">Maritime Intelligence &amp; Curated Stories</p>
            <span className="blog-hero__meta-line" />
          </div>
          <p className="blog-hero__count">{posts.length} Articles</p>
        </div>
      </header>

      {/* BLOG GRID (Client Component for animations) */}
      <BlogGrid posts={posts} />

      {/* Roberto 2026-05-04 — fleet teaser strip. Every yacht now has
          a second incoming internal link (from this hub page) on top
          of /charter-yacht-greece, fixing the link-audit "orphan"
          flag. Server-rendered <a href> so any crawler picks it up. */}
      {Array.isArray(fleetTeaser) && fleetTeaser.length >= 4 && (
        <section
          aria-label="Browse the fleet"
          style={{
            background: "#000",
            padding: "72px 24px",
            borderTop: "1px solid rgba(218,165,32,0.12)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.4em",
                  color: "#DAA520",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                The Fleet
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 300,
                  color: "#fff",
                  margin: "0 0 8px",
                  lineHeight: 1.05,
                }}
              >
                Every Yacht We Charter
              </h2>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                {fleetTeaser.length} crewed yachts in Greek waters
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {fleetTeaser.map((y) => (
                <Link
                  key={y.slug}
                  href={`/yachts/${y.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    overflow: "hidden",
                    transition: "border-color 0.3s ease, transform 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      background: y.imageUrl
                        ? `#0a0a0a url(${y.imageUrl}) center/cover no-repeat`
                        : "#0a0a0a",
                    }}
                    aria-hidden={!y.imageUrl}
                  />
                  <div style={{ padding: "10px 12px 14px" }}>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 15,
                        color: "#fff",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {y.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link
                href="/charter-yacht-greece"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#DAA520",
                  textDecoration: "none",
                  paddingBottom: 4,
                  borderBottom: "1px solid #DAA520",
                }}
              >
                Browse the Full Fleet →
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="border-t border-white/5">
        <ContactFormSection />
      </div>
      <Footer />
    </div>
  );
}
