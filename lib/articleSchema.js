// lib/articleSchema.js
// Helper function to generate Article schema for blog posts (GEO optimization)

// Approximate word count from Sanity Portable Text body. Article
// schema's `wordCount` is a strong freshness/quality signal — Google
// uses it for "in-depth" SERP eligibility, AI agents weight it for
// authority. We don't need exact precision; close enough is fine.
function approximateWordCount(body) {
  if (!Array.isArray(body)) return undefined;
  let total = 0;
  for (const block of body) {
    if (block?._type !== "block") continue;
    for (const child of block.children || []) {
      if (child?._type === "span" && typeof child.text === "string") {
        total += child.text.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return total > 0 ? total : undefined;
}

export function generateArticleSchema(post) {
  // Handle different date field names from Sanity
  const publishedDate = post.publishedAt || post._createdAt;
  const modifiedDate = post._updatedAt || post.publishedAt || post._createdAt;

  // Get image URL if available
  const imageUrl = post.mainImage?.asset?.url ||
    (post.mainImage ? `https://cdn.sanity.io/images/ecqr94ey/production/${post.mainImage.asset?._ref?.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}` : null);

  const wordCount = approximateWordCount(post.body);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    // Boss directive 2026-05-08 — when the Sanity post has a
    // `quickAnswer`, prefer it for the schema description. Quick
    // Answer is the AI-citable 50-word answer; using it here
    // increases the chance ChatGPT / Perplexity surface this
    // article when answering the matching query.
    "description": post.quickAnswer || post.excerpt || post.description || `${post.title} - George Yachts Brokerage House`,
    "image": imageUrl,
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    ...(wordCount ? { "wordCount": wordCount } : {}),
    // Phase 1 (2026-05-08, Boss SEO/AI directive) — full Person
    // schema attached, mirrored from /team/george-biniaris page,
    // including the Forbes feature as `subjectOf` + award. AI engines
    // and Google now have a fully credentialled author entity for
    // every blog post — strongest possible E-E-A-T signal short of
    // adding inline citations.
    "author": (() => {
      // Inline copy of generatePersonSchema("george-biniaris") so this
      // file stays a pure schema generator (no Sanity / framework deps
      // imported here). When the team data changes, update both — the
      // canonical copy lives in lib/teamSchema.js, this is the
      // article-embed mirror.
      const author = {
        "@type": "Person",
        "@id": "https://georgeyachts.com/team/george-biniaris#person",
        "name": "George P. Biniaris",
        "jobTitle": "Managing Broker",
        "description": "Managing Broker at George Yachts Brokerage House. IYBA member specializing in crewed motor yacht, sailing yacht, and catamaran charters across Greek waters. Featured in Forbes (May 2026).",
        "url": "https://georgeyachts.com/team/george-biniaris",
        "image": "https://georgeyachts.com/images/team/george-biniaris.jpg",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://georgeyachts.com/#organization",
          "name": "George Yachts Brokerage House",
          "url": "https://georgeyachts.com",
        },
        "affiliation": {
          "@type": "Organization",
          "@id": "https://georgeyachts.com/#organization",
          "name": "George Yachts Brokerage House",
          "url": "https://georgeyachts.com",
        },
        "memberOf": {
          "@type": "Organization",
          "name": "International Yacht Brokers Association",
          "alternateName": "IYBA",
          "url": "https://iyba.org",
        },
        "knowsAbout": [
          "Luxury Yacht Charter Greece",
          "Crewed Motor Yacht Charter",
          "Sailing Yacht Charter",
          "Catamaran Charter",
          "MYBA Charter Agreements",
          "APA (Advance Provisioning Allowance)",
          "Cyclades Yacht Itineraries",
          "Ionian Island Cruising",
          "Saronic Gulf Itineraries",
          "UHNW Client Services",
          "Yacht Acquisition Advisory",
          "Greek Waters Navigation",
        ],
        "knowsLanguage": ["English", "Greek"],
        "sameAs": [
          "https://www.linkedin.com/in/george-p-biniaris/",
          "https://www.instagram.com/georgeyachts",
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Yacht Charter Broker",
          "occupationalCategory": "41-3091.00",
        },
        "nationality": { "@type": "Country", "name": "Greece" },
        "workLocation": {
          "@type": "Place",
          "name": "Athens, Greece",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Charilaou Trikoupi 190A",
            "addressLocality": "Nea Kifisia",
            "addressRegion": "Attica",
            "postalCode": "14564",
            "addressCountry": "GR",
          },
        },
        "award": ["Featured in Forbes — May 2026"],
        "subjectOf": {
          "@type": "NewsArticle",
          "headline": "How The Wealthy Are Hedging For Instability",
          "url": "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
          "datePublished": "2026-05-01",
          "publisher": { "@type": "Organization", "name": "Forbes" },
        },
      };
      return author;
    })(),
    "publisher": {
      "@type": "Organization",
      "name": "George Yachts Brokerage House",
      "url": "https://georgeyachts.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://georgeyachts.com/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://georgeyachts.com/blog/${post.slug?.current || post.slug}`
    },
    "articleSection": "Maritime Intelligence",
    "inLanguage": "en-US",
    // Speakable — flags summary + headings as voice-answer eligible.
    // Google Assistant and AI voice agents prefer speakable articles
    // for audio answers; adds virtually zero weight for text crawl.
    // Speakable — Phase 4 (2026-05-08): now includes the Quick Answer
    // block (.gy-qa-text) so AI voice agents lift the curated 40–50
    // word direct answer rather than the article first paragraph.
    // Google Assistant + future Speech AI agents preferentially pull
    // marked-speakable text for audio answers.
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".gy-qa-text", "h1", "h2", "article p:first-of-type"],
    },
  };
}
