import React from "react";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "@/components/RichTextComponents";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateStaticParams() {
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const slugs = await sanityClient.fetch(query);
  return slugs.map((post) => ({ slug: post.slug }));
}

async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    publishedAt,
    author,
    body,
        excerpt,
            mainImage
  }`;
  return sanityClient.fetch(query, { slug });
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: "Article Not Found | George Yachts" };

    // --- Description: excerpt → body text fallback → generic fallback ---
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

    // --- OG Image: Sanity mainImage → opengraph-image.png fallback ---
    const ogImageUrl = post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
          : "https://georgeyachts.com/opengraph-image.png";

    const canonicalUrl = `https://georgeyachts.com/blog/${slug}`;

    return {
          title: `${post.title} | The Journal | George Yachts`,
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
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DAA520]/30 to-transparent mb-16" />

        {/* Top bar */}
        <div className="flex items-center justify-between w-full">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/30 hover:text-[#DAA520] transition-colors duration-500 text-[9px] tracking-[0.55em] uppercase font-bold group"
          >
            <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            The Journal
          </Link>

          <span className="text-white/20 text-[9px] tracking-[0.55em] uppercase">
            {date}
          </span>
        </div>

        {/* Typographic block — left on mobile, centered on desktop */}
        <div className="flex flex-col items-start md:items-center md:text-center flex-1 justify-center mt-12 md:mt-0">

          <div className="flex items-center space-x-4 mb-8">
            <span className="block w-8 h-px bg-[#DAA520]" />
            <span className="text-[#DAA520] text-[9px] tracking-[0.6em] uppercase font-bold">
              Editorial
            </span>
            <span className="hidden md:block w-8 h-px bg-[#DAA520]" />
          </div>

          <h1 className="font-marcellus text-white uppercase leading-[1.08] tracking-tight text-3xl md:text-4xl lg:text-5xl max-w-3xl">
            {post.title}
          </h1>

          <div className="flex items-center space-x-5 mt-10">
            <span className="block w-12 h-px bg-white/10" />
            <span className="text-white/30 text-[9px] tracking-[0.5em] uppercase">
              By {post.author}
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
          <div className="relative w-full bg-[#020617]">
            <img
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              className="w-full h-auto block"
              style={{ filter: "brightness(0.85) saturate(0.9)" }}
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent" />
          </div>
        </section>
      )}

      {/* EDITORIAL BODY */}
      <section className="relative z-10 bg-[#020617] px-6 py-20 md:py-32">
        <div className="max-w-[720px] mx-auto">

          <div className="flex items-center space-x-6 mb-16">
            <span className="block w-6 h-px bg-[#DAA520]/50" />
            <span className="text-[#DAA520]/50 text-[8px] tracking-[0.7em] uppercase">
              George Yachts &middot; Maritime Intelligence
            </span>
            <span className="block flex-1 h-px bg-white/5" />
          </div>

          <article className="editorial-content [&_p]:mb-10 [&_p]:leading-[2] [&_p]:text-white/60 [&_p]:text-[1.05rem] [&_p:first-of-type]:text-white/80 [&_p:first-of-type]:text-[1.15rem] [&_p:first-of-type]:leading-[1.85]">
            <PortableText value={post.body} components={RichTextComponents} />
          </article>

          {/* End-of-article marker */}
          <div className="mt-20 pt-16 border-t border-white/[0.04] flex flex-col items-center space-y-5">
            <span className="text-[#DAA520]/25 text-4xl font-marcellus select-none">
              &#10022;
            </span>
            <p className="text-white/15 text-[8px] tracking-[0.7em] uppercase">
              George Yachts Brokerage Editorial
            </p>
          </div>

          {/* Bottom back link */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/20 hover:text-[#DAA520] transition-colors duration-500 text-[9px] tracking-[0.55em] uppercase font-bold group"
            >
              <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Return to The Journal
            </Link>
          </div>
        </div>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ArticlePage;
