import { sanityClient } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollReveal from './ScrollReveal';
import Lightbox from './Lightbox';
import './yacht-page.css';

// ISR - revalidate every hour
export const revalidate = 3600;

// Generate static paths for all yachts with slugs
export async function generateStaticParams() {
  const yachts = await sanityClient.fetch(`*[_type == "yacht" && defined(slug.current)]{
    "slug": slug.current
  }`);
  return yachts.map((yacht) => ({ slug: yacht.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const yacht = await sanityClient.fetch(
    `*[_type == "yacht" && slug.current == $slug][0]{
      name, subtitle, length, sleeps, weeklyRatePrice, cruisingRegion,
      "imageUrl": images[0].asset->url
    }`,
    { slug }
  );

  if (!yacht) return { title: 'Yacht Not Found' };

  const title = `${yacht.name} | ${yacht.subtitle} | Luxury Yacht Charter Greece`;
  const description = `Charter ${yacht.name}, a ${yacht.length} ${yacht.subtitle} accommodating ${yacht.sleeps} guests in Greek waters. ${yacht.weeklyRatePrice}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: yacht.imageUrl ? [{ url: yacht.imageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Product Schema for GEO — Complete
function YachtSchema({ yacht, imageUrl }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: yacht.name,
    description: `Luxury ${yacht.subtitle || ''} yacht available for charter in Greek waters. ${yacht.length}, accommodating ${yacht.sleeps} guests.`,
    brand: {
      '@type': 'Brand',
      name: yacht.builder || 'Luxury Yacht',
    },
    category: 'Luxury Motor Yacht Charter',
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      areaServed: {
        '@type': 'Place',
        name: yacht.cruisingRegion || 'Greece',
      },
      seller: {
        '@type': 'Organization',
        name: 'George Yachts Brokerage House',
        url: 'https://georgeyachts.com',
      },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Length', value: yacht.length },
      { '@type': 'PropertyValue', name: 'Guests', value: yacht.sleeps },
      { '@type': 'PropertyValue', name: 'Cabins', value: yacht.cabins },
      { '@type': 'PropertyValue', name: 'Crew', value: yacht.crew },
      { '@type': 'PropertyValue', name: 'Builder', value: yacht.builder },
      { '@type': 'PropertyValue', name: 'Max Speed', value: yacht.maxSpeed },
      { '@type': 'PropertyValue', name: 'Cruise Speed', value: yacht.cruiseSpeed },
    ].filter(prop => prop.value),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function YachtPage({ params }) {
  const { slug } = await params;

  const yacht = await sanityClient.fetch(
    `*[_type == "yacht" && slug.current == $slug][0]{
      _id,
      name,
      subtitle,
      description,
      georgeInsiderTip,
      length,
      yearBuiltRefit,
      builder,
      sleeps,
      cabins,
      crew,
      maxSpeed,
      cruiseSpeed,
      cruisingRegion,
      weeklyRatePrice,
      features,
      toys,
      idealFor,
      "images": images[]{
        "url": asset->url,
        "alt": alt
      }
    }`,
    { slug }
  );

  if (!yacht) {
    notFound();
  }

  const heroImage = yacht.images?.[0];

  return (
    <>
      <YachtSchema yacht={yacht} imageUrl={heroImage?.url} />
      <ScrollReveal />

      <article className="yacht-page">
        {/* HERO SECTION - Full Width Cinematic */}
        <section className="yacht-hero">
          {heroImage && (
            <div className="yacht-hero__image-container">
              <Image
                src={heroImage.url}
                alt={`${yacht.name} ${yacht.subtitle} - luxury yacht charter Greece`}
                fill
                priority
                className="yacht-hero__image"
                sizes="100vw"
              />
              <div className="yacht-hero__overlay" />
            </div>
          )}
          <div className="yacht-hero__content">
            <h1 className="yacht-hero__title">{yacht.name}</h1>
            <p className="yacht-hero__subtitle">
              {yacht.subtitle} · {yacht.length} · {yacht.sleeps} guests
            </p>
          </div>
        </section>

        {/* STORY SECTION — Rich content or auto-generated summary */}
        {yacht.description && yacht.description.length > 0 ? (
          <section className="yacht-story reveal">
            <div className="container">
              <PortableText value={yacht.description} />
            </div>
          </section>
        ) : (
          <section className="yacht-story reveal">
            <div className="container">
              <h2 className="yacht-story__heading">About {yacht.name}</h2>
              <p>
                {yacht.name} is a {yacht.subtitle?.split('|')[0]?.trim() || 'luxury yacht'} available
                for charter in Greek waters. At {yacht.length || 'her impressive length'}, she accommodates {yacht.sleeps || 'up to 12'} guests
                for unforgettable voyages through the Cyclades, Ionian Islands, Saronic Gulf, and Sporades.
              </p>
              <p>
                Contact George Yachts for detailed specifications, availability, and a personalized
                charter proposal tailored to your preferences.
              </p>
            </div>
          </section>
        )}

        {/* GEORGE'S INSIDE INFO — Author Attribution */}
        {yacht.georgeInsiderTip && (
          <section className="yacht-insider reveal">
            <div className="container">
              <div className="yacht-insider__card">
                <div className="yacht-insider__header">
                  <span className="yacht-insider__icon">💬</span>
                  <h2 className="yacht-insider__title">George&apos;s Inside Info</h2>
                </div>
                <blockquote className="yacht-insider__quote" cite="https://georgeyachts.com/team/george-biniaris">
                  &ldquo;{yacht.georgeInsiderTip}&rdquo;
                </blockquote>
                <p className="yacht-insider__signature">
                  — <span itemProp="author">George P. Biniaris</span>, Managing Broker &amp; IYBA Member
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SPECIFICATIONS — GEO Question H2 */}
        <section className="yacht-specs reveal">
          <div className="container">
            <h2 className="yacht-specs__title">What Are the Specifications of {yacht.name}?</h2>
            <div className="yacht-specs__grid">
              {yacht.length && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Length</span>
                  <span className="yacht-specs__value">{yacht.length}</span>
                </div>
              )}
              {yacht.builder && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Builder</span>
                  <span className="yacht-specs__value">{yacht.builder}</span>
                </div>
              )}
              {yacht.yearBuiltRefit && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Year</span>
                  <span className="yacht-specs__value">{yacht.yearBuiltRefit}</span>
                </div>
              )}
              {yacht.sleeps && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Guests</span>
                  <span className="yacht-specs__value">{yacht.sleeps}</span>
                </div>
              )}
              {yacht.cabins && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Cabins</span>
                  <span className="yacht-specs__value">{yacht.cabins}</span>
                </div>
              )}
              {yacht.crew && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Crew</span>
                  <span className="yacht-specs__value">{(() => {
                    const c = yacht.crew;
                    // Extract number and generic roles (strip names)
                    const numMatch = c.match(/^(\d+)/);
                    if (!numMatch) return c;
                    const num = numMatch[1];
                    // Extract roles, removing personal names
                    const rolesStr = c.replace(/^\d+\s*[—–-]\s*/, '');
                    if (!rolesStr || rolesStr === num) return num;
                    const roles = rolesStr.split(',').map(r => {
                      // Remove names: "Captain Thanos Kourtelis (..." → "Captain"
                      return r.trim()
                        .replace(/\s*\([^)]*\)/g, '') // remove parentheses
                        .replace(/^(Captain|Chef|Stewardess|Deckhand|Hostess|Engineer|Mate|Bosun|Chef\/Hostess)\s+[A-Z].*/i, '$1') // remove name after role
                        .replace(/\s+$/, '');
                    }).filter(r => r.length > 0);
                    // Deduplicate and count multiples
                    const roleCounts = {};
                    roles.forEach(r => {
                      const generic = r.replace(/^(Award-winning\s+)/i, '').replace(/^\d+\s+/, '');
                      roleCounts[generic] = (roleCounts[generic] || 0) + 1;
                    });
                    const roleList = Object.entries(roleCounts).map(([role, count]) =>
                      count > 1 ? `${count} ${role}s` : role
                    ).join(', ');
                    return `${num} — ${roleList}`;
                  })()}</span>
                </div>
              )}
              {yacht.cruiseSpeed && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Cruise Speed</span>
                  <span className="yacht-specs__value">{yacht.cruiseSpeed}</span>
                </div>
              )}
              {yacht.maxSpeed && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">Max Speed</span>
                  <span className="yacht-specs__value">{yacht.maxSpeed}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* IDEAL FOR — GEO Question H2 */}
        {yacht.idealFor && (
          <section className="yacht-ideal reveal">
            <div className="container">
              <h2 className="yacht-ideal__title">Who Is {yacht.name} Ideal For?</h2>
              <p className="yacht-ideal__text">{yacht.idealFor}</p>
            </div>
          </section>
        )}

        {/* KEY FEATURES — GEO Question H2 */}
        {yacht.features && yacht.features.length > 0 && (
          <section className="yacht-features reveal">
            <div className="container">
              <h2 className="yacht-features__title">What Features Make {yacht.name} Stand Out?</h2>
              <ul className="yacht-features__list">
                {yacht.features.map((feature, index) => (
                  <li key={index} className="yacht-features__item">
                    <span className="yacht-features__check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* WATER TOYS — GEO Question H2 */}
        {yacht.toys && yacht.toys.length > 0 && (
          <section className="yacht-toys reveal">
            <div className="container">
              <h2 className="yacht-toys__title">What Water Toys Are Available on {yacht.name}?</h2>
              <ul className="yacht-toys__list">
                {yacht.toys.map((toy, index) => (
                  <li key={index} className="yacht-toys__item">{toy}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* PHOTO GALLERY — Lightbox + GEO Question H2 */}
        {yacht.images && yacht.images.length > 1 && (
          <section className="yacht-gallery">
            <div className="container">
              <h2 className="yacht-gallery__title">What Does {yacht.name} Look Like Inside and Out?</h2>
              <Lightbox
                images={yacht.images.slice(1)}
                yachtName={yacht.name}
              />
            </div>
          </section>
        )}

        {/* PRICING — GEO Question H2 */}
        {yacht.weeklyRatePrice && (
          <section className="yacht-pricing reveal">
            <div className="container">
              <h2 className="yacht-pricing__title">What Is the Weekly Charter Rate for {yacht.name}?</h2>
              <p className="yacht-pricing__rate">{yacht.weeklyRatePrice}</p>
            </div>
          </section>
        )}

        {/* CTA SECTION - Dual Options */}
        <section className="yacht-cta reveal">
          <div className="container">
            <div className="gold-line mb-12" />

            <span className="label-text block text-center mb-4">
              Begin Your Journey
            </span>

            <h2 className="text-4xl md:text-5xl font-marcellus text-white text-center mb-4 uppercase tracking-wide">
              Experience{' '}
              <span className="gradient-gold italic font-light">
                {yacht.name}
              </span>
            </h2>

            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Ready to explore the Greek islands aboard this magnificent vessel?
              Choose how you&apos;d like to connect.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="https://calendly.com/george-georgeyachts/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Book a Video Consultation
              </a>

              <a
                href="/#contact"
                className="btn-secondary"
              >
                Submit an Inquiry
              </a>
            </div>

            <p className="text-center text-gray-500 text-xs mt-8 tracking-widest uppercase">
              Personal service · No obligation · Response within 24 hours
            </p>
          </div>
        </section>

        {/* BACK LINK */}
        <section className="yacht-back">
          <div className="container">
            <Link href="/charter-yacht-greece" className="yacht-back__link">
              ← View All Charter Yachts
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
