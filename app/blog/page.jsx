import React from "react";
import { sanityClient } from "../../lib/sanity";
import Footer from "../components/Footer";
import ContactFormSection from "../components/ContactFormSection";
import Link from "next/link";

// Force dynamic rendering to ensure new posts appear immediately
export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Journal | George Yachts",
  description:
    "Editorial, news, and market insights from the world of luxury yachting.",
};

// --- THE GROQ QUERY ---
const BLOG_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  author
}`;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogPage = async () => {
  let posts = [];
  try {
    posts = await sanityClient.fetch(BLOG_QUERY);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-[#DAA520] selection:text-black">
      {/* --- MINIMALIST EDITORIAL HEADER --- */}
      <header className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#DAA520] text-[10px] tracking-[0.5em] uppercase font-bold mb-6 animate-fade-in">
            George Yachts Editorial
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white font-marcellus uppercase tracking-tighter leading-none mb-8">
            The Journal
          </h1>
          <div className="flex items-center justify-center space-x-6">
            <span className="h-px w-12 bg-white/20"></span>
            <p className="text-white/40 text-[10px] md:text-xs tracking-[0.4em] uppercase font-light">
              Market Insights & Curated Stories
            </p>
            <span className="h-px w-12 bg-white/20"></span>
          </div>
        </div>
      </header>

      {/* --- BLOG GRID SECTION --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#020617]">
        <div className="max-w-[1530px] mx-auto">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
              {posts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post._id}
                  className="group flex flex-col"
                >
                  {/* Image Container with Cinematic Zoom */}
                  <div className="relative w-full aspect-4/5 overflow-hidden mb-10 border border-white/5 bg-[#01040a]">
                    <img
                      src={
                        post.imageUrl ||
                        "https://placehold.co/800x1000/02132d/ffffff?text=Editorial"
                      }
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover transition-transform duration-8000 ease-out group-hover:scale-110 filter brightness-[0.85] group-hover:brightness-100"
                    />
                    {/* Dark gradient overlay for a moody, high-end look */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col grow">
                    <div className="flex items-center space-x-4 mb-6">
                      <p className="text-[#DAA520] text-[10px] tracking-[0.4em] uppercase font-bold">
                        {formatDate(post.publishedAt)}
                      </p>
                      <span className="w-8 h-px bg-white/10"></span>
                      <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">
                        By {post.author || "Editorial"}
                      </p>
                    </div>

                    <h2 className="text-3xl lg:text-4xl text-white font-marcellus mb-6 transition-colors duration-500 leading-[1.1] group-hover:text-[#DAA520]">
                      {post.title}
                    </h2>

                    <p className="text-white/50 font-light text-sm leading-relaxed mb-10 line-clamp-3 italic font-serif">
                      {post.excerpt}
                    </p>

                    {/* Read Article Trigger */}
                    <div className="mt-auto">
                      <span className="inline-block text-white text-[10px] tracking-[0.4em] font-bold uppercase border-b border-[#DAA520]/20 pb-2 group-hover:border-[#DAA520] transition-all duration-300 group-hover:tracking-[0.5em]">
                        Read Entry
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-40 border border-white/5 bg-white/[0.02]">
              <h3 className="text-2xl text-white font-marcellus mb-4 uppercase tracking-widest">
                No entries found
              </h3>
              <p className="text-white/30 font-light text-xs tracking-[0.3em] uppercase">
                The journal is currently being curated.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-white/5">
        <ContactFormSection />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
