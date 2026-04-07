import Image from "next/image";
import Link from "next/link";

/* ─── Date formatter ─── */
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Related Articles — server component rendered below every blog post.
 * Shows 3 recent posts (excluding the current one) to boost internal linking.
 */
export default function RelatedArticles({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="relative z-10 bg-[#000] px-6 pb-20 md:pb-28">
      <div className="max-w-[720px] mx-auto">
        {/* Section header */}
        <div className="flex items-center space-x-6 mb-12">
          <span className="block w-6 h-px bg-[#DAA520]/50" />
          <span
            className="text-[#DAA520]/50 text-[8px] tracking-[0.7em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Continue Reading
          </span>
          <span className="block flex-1 h-px bg-white/5" />
        </div>

        <h2
          className="text-white/80 text-2xl md:text-3xl mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}
        >
          Related Articles
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block border border-white/[0.06] rounded overflow-hidden hover:border-[#DAA520]/20 transition-colors duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0a]">
                {post.imageUrl ? (
                  <Image
                    src={`${post.imageUrl}?w=400&h=300&fit=crop&auto=format`}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-white/10 text-[9px] tracking-[0.4em] uppercase"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Editorial
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4">
                <span
                  className="text-[#DAA520]/70 text-[8px] tracking-[0.3em] uppercase block mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {formatDate(post.publishedAt)}
                </span>
                <h3
                  className="text-white/70 text-[1.05rem] leading-snug group-hover:text-[#DAA520] transition-colors duration-500 line-clamp-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p
                    className="text-white/60 text-[12px] leading-relaxed mt-2 line-clamp-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {post.excerpt}
                  </p>
                )}
                <span
                  className="inline-block mt-3 text-[#DAA520]/40 text-[9px] tracking-[0.2em] uppercase group-hover:text-[#DAA520]/70 transition-colors duration-500"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Read Article &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="text-white/50 hover:text-[#DAA520] transition-colors duration-500 text-[9px] tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
