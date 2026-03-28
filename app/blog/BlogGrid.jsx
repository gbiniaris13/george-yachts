"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Reading time estimate ─── */
function readingTime(bodyLength) {
  if (!bodyLength) return "5 min read";
  const words = Math.round(bodyLength / 5);
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

/* ─── Date formatter ─── */
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

/* ─── Scroll reveal for grid ─── */
function useGridReveal() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const sorted = [...entries].sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        let idx = 0;
        sorted.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${idx * 80}ms`;
            entry.target.classList.add("blog-card--visible");
            observer.unobserve(entry.target);
            idx++;
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const cards = grid.querySelectorAll(".blog-card");
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  });

  return gridRef;
}

/* ─── Featured Card (First Post) ─── */
function FeaturedCard({ post }) {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <Link
      href={`/blog/${post.slug}`}
      ref={setRef}
      className="blog-featured"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      <div className="blog-featured__image-wrap">
        {post.imageUrl && (
          <Image
            src={`${post.imageUrl}?w=1200&h=700&fit=crop&auto=format`}
            alt={post.imageAlt || `${post.title} - George Yachts Journal`}
            fill
            priority
            className="blog-featured__img"
            sizes="100vw"
          />
        )}
        <div className="blog-featured__overlay" />
        <div className="blog-featured__badge">Latest</div>
      </div>
      <div className="blog-featured__content">
        <div className="blog-featured__meta">
          <span className="blog-featured__date">{formatDate(post.publishedAt)}</span>
          <span className="blog-featured__dot">&middot;</span>
          <span className="blog-featured__reading">{readingTime(post.bodyLength)}</span>
        </div>
        <h2 className="blog-featured__title">{post.title}</h2>
        <p className="blog-featured__excerpt">{post.excerpt}</p>
        <div className="blog-featured__cta">
          <span>Read Article</span>
          <span className="blog-featured__arrow">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Regular Card ─── */
function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card__image-wrap">
        {post.imageUrl ? (
          <Image
            src={`${post.imageUrl}?w=600&h=750&fit=crop&auto=format`}
            alt={post.imageAlt || `${post.title} - luxury yacht charter Greece`}
            fill
            className="blog-card__img"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="blog-card__placeholder">Editorial</div>
        )}
        <div className="blog-card__overlay" />
        <div className="blog-card__reading-badge">{readingTime(post.bodyLength)}</div>
      </div>
      <div className="blog-card__content">
        <div className="blog-card__meta">
          <span className="blog-card__date">{formatDate(post.publishedAt)}</span>
          <span className="blog-card__sep">&middot;</span>
          <span className="blog-card__author">By {post.author?.split("|")[0]?.trim() || "George P. Biniaris"}</span>
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <span className="blog-card__link">
          Read Entry
          <span className="blog-card__link-arrow">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

/* ─── Main Grid ─── */
export default function BlogGrid({ posts }) {
  const gridRef = useGridReveal();

  if (posts.length === 0) {
    return (
      <section className="blog-empty">
        <h3 className="blog-empty__title">No entries found</h3>
        <p className="blog-empty__text">The journal is currently being curated.</p>
      </section>
    );
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      {/* Featured Article */}
      <section className="blog-featured-section">
        <FeaturedCard post={featured} />
      </section>

      {/* Article Grid */}
      {rest.length > 0 && (
        <section className="blog-grid-section">
          <div className="blog-grid-section__header">
            <span className="blog-grid-section__line" />
            <h2 className="blog-grid-section__title">All Articles</h2>
            <span className="blog-grid-section__line" />
          </div>
          <div className="blog-grid" ref={gridRef}>
            {rest.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
