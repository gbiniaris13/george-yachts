// lib/articleSchema.js
// Helper function to generate Article schema for blog posts (GEO optimization)

export function generateArticleSchema(post) {
  // Handle different date field names from Sanity
  const publishedDate = post.publishedAt || post._createdAt;
  const modifiedDate = post._updatedAt || post.publishedAt || post._createdAt;
  
  // Get image URL if available
  const imageUrl = post.mainImage?.asset?.url || 
    (post.mainImage ? `https://cdn.sanity.io/images/ecqr94ey/production/${post.mainImage.asset?._ref?.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}` : null);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.description || `${post.title} - George Yachts Brokerage House`,
    "image": imageUrl,
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": "George P. Biniaris",
      "jobTitle": "Managing Broker",
      "url": "https://georgeyachts.com/team/george-biniaris",
      "affiliation": {
        "@type": "Organization",
        "name": "George Yachts Brokerage House",
        "url": "https://georgeyachts.com"
      },
      "knowsAbout": [
        "Luxury Yacht Charter",
        "Greek Waters Navigation", 
        "MYBA Charter Contracts",
        "Cyclades Yacht Itineraries",
        "Ionian Island Cruising"
      ],
      "memberOf": {
        "@type": "Organization",
        "name": "International Yacht Brokers Association (IYBA)",
        "url": "https://iyba.org"
      }
    },
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
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", "article p:first-of-type"],
    },
  };
}
