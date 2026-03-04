import React from "react";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "@/components/RichTextComponents";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// 1. Fetch paths for static generation to keep things lightning fast
export async function generateStaticParams() {
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const slugs = await sanityClient.fetch(query);
  return slugs.map((post) => ({ slug: post.slug }));
}

// 2. Fetch the specific post data from Sanity
async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    publishedAt,
    author,
    body
  }`;
  return sanityClient.fetch(query, { slug });
}

// 3. Dynamic SEO Metadata for each unique article
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | George Yachts" };
  return {
    title: `${post.title} | The Journal | George Yachts`,
    description: `Expert insights and maritime analysis: ${post.title}.`,
  };
}

const ArticlePage = async ({ params }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <h1 className="text-white font-marcellus text-3xl">
          Article Not Found
        </h1>
      </div>
    );
  }

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-[#DAA520] selection:text-black">
      {/* --- IMMERSIVE FULL-SCREEN HERO --- */}
      <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0">
          <img
            src={
              post.imageUrl ||
              "https://placehold.co/1920x1080/02132d/ffffff?text=Editorial"
            }
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover filter brightness-[0.6]"
          />
        </div>

        {/* Sophisticated Dark Vignette */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-6 pb-24 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center space-x-6 mb-8 animate-fade-in">
              <span className="text-[#DAA520] text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold">
                {date}
              </span>
              <span className="w-16 h-px bg-white/20"></span>
              <span className="text-white/60 text-[10px] md:text-xs tracking-[0.4em] uppercase">
                BY {post.author}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl lg:text-8xl font-marcellus text-white uppercase tracking-tight leading-[1.05] drop-shadow-2xl">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* --- EDITORIAL CONTENT SECTION --- */}
      <section className="relative z-10 bg-[#020617] px-6 py-20 md:py-32">
        <div className="max-w-[850px] mx-auto">
          {/* Elegant Navigation Back */}
          <div className="mb-20">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/40 hover:text-[#DAA520] transition-colors duration-500 text-[10px] tracking-[0.5em] uppercase font-bold border-b border-white/5 pb-2 group"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              The Journal Index
            </Link>
          </div>

          {/* The Rich Text Body (Powered by our custom Engine) */}
          {/* Using Tailwind's arbitrary variants to handle deep paragraph styling without styled-jsx */}
          <article className="editorial-content [&_p]:mb-8 [&_p]:leading-[1.9]">
            <PortableText value={post.body} components={RichTextComponents} />
          </article>

          {/* Signature End-of-Article Marker */}
          <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center">
            <span className="text-[#DAA520] text-4xl font-marcellus opacity-40 mb-4">
              ✦
            </span>
            <p className="text-white/20 text-[9px] tracking-[0.6em] uppercase">
              George Yachts Brokerage Editorial
            </p>
          </div>
        </div>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ArticlePage;
