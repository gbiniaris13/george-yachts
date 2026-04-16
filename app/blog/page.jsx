import React from "react";
import { sanityClient } from "@/lib/sanity";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import BlogGrid from "./BlogGrid";
import "@/styles/blog.css";

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
  try {
    posts = await sanityClient.fetch(BLOG_QUERY, {}, { next: { tags: ['posts'] } });
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

      <div className="border-t border-white/5">
        <ContactFormSection />
      </div>
      <Footer />
    </div>
  );
}
