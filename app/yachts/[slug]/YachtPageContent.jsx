'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import Lightbox from './Lightbox';

export default function YachtPageContent({ yacht, heroImage, description }) {
  const { t } = useI18n();

  return (
    <>
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
              {yacht.subtitle} · {yacht.length} · {yacht.sleeps} {t('common.guests', 'guests')}
            </p>
          </div>
        </section>

        {/* STORY SECTION */}
        {description && (
          <section className="yacht-story reveal">
            <div className="container">
              <PortableText value={description} />
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
                  <h2 className="yacht-insider__title">{t('yacht.insiderTitle', "George's Inside Info")}</h2>
                </div>
                <blockquote className="yacht-insider__quote" cite="https://georgeyachts.com/team/george-biniaris">
                  &ldquo;{yacht.georgeInsiderTip}&rdquo;
                </blockquote>
                <p className="yacht-insider__signature">
                  — <span itemProp="author">George P. Biniaris</span>, {t('yacht.managingBroker', 'Managing Broker')} &amp; IYBA {t('yacht.member', 'Member')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SPECIFICATIONS — GEO Question H2 */}
        <section className="yacht-specs reveal">
          <div className="container">
            <h2 className="yacht-specs__title">{t('yacht.specsTitle', 'What Are the Specifications of')} {yacht.name}?</h2>
            <div className="yacht-specs__grid">
              {yacht.length && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.length', 'Length')}</span>
                  <span className="yacht-specs__value">{yacht.length}</span>
                </div>
              )}
              {yacht.builder && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.builder', 'Builder')}</span>
                  <span className="yacht-specs__value">{yacht.builder}</span>
                </div>
              )}
              {yacht.yearBuiltRefit && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.year', 'Year')}</span>
                  <span className="yacht-specs__value">{yacht.yearBuiltRefit}</span>
                </div>
              )}
              {yacht.sleeps && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.guests', 'Guests')}</span>
                  <span className="yacht-specs__value">{yacht.sleeps}</span>
                </div>
              )}
              {yacht.cabins && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.cabins', 'Cabins')}</span>
                  <span className="yacht-specs__value">{yacht.cabins}</span>
                </div>
              )}
              {yacht.crew && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.crew', 'Crew')}</span>
                  <span className="yacht-specs__value">{yacht.crew}</span>
                </div>
              )}
              {yacht.cruiseSpeed && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.cruiseSpeed', 'Cruise Speed')}</span>
                  <span className="yacht-specs__value">{yacht.cruiseSpeed}</span>
                </div>
              )}
              {yacht.maxSpeed && (
                <div className="yacht-specs__item">
                  <span className="yacht-specs__label">{t('common.maxSpeed', 'Max Speed')}</span>
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
              <h2 className="yacht-ideal__title">{t('yacht.idealTitle', 'Who Is')} {yacht.name} {t('yacht.idealFor', 'Ideal For')}?</h2>
              <p className="yacht-ideal__text">{yacht.idealFor}</p>
            </div>
          </section>
        )}

        {/* KEY FEATURES — GEO Question H2 */}
        {yacht.features && yacht.features.length > 0 && (
          <section className="yacht-features reveal">
            <div className="container">
              <h2 className="yacht-features__title">{t('yacht.featuresTitle', 'What Features Make')} {yacht.name} {t('yacht.standOut', 'Stand Out')}?</h2>
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
              <h2 className="yacht-toys__title">{t('yacht.toysTitle', 'What Water Toys Are Available on')} {yacht.name}?</h2>
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
              <h2 className="yacht-gallery__title">{t('yacht.galleryTitle', 'What Does')} {yacht.name} {t('yacht.lookLike', 'Look Like Inside and Out')}?</h2>
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
              <h2 className="yacht-pricing__title">{t('yacht.pricingTitle', 'What Is the Weekly Charter Rate for')} {yacht.name}?</h2>
              <p className="yacht-pricing__rate">{yacht.weeklyRatePrice}</p>
            </div>
          </section>
        )}

        {/* CTA SECTION - Dual Options */}
        <section className="yacht-cta reveal">
          <div className="container">
            <div className="gold-line mb-12" />

            <span className="label-text block text-center mb-4">
              {t('yacht.beginJourney', 'Begin Your Journey')}
            </span>

            <h2 className="text-4xl md:text-5xl font-marcellus text-white text-center mb-4 uppercase tracking-wide">
              {t('yacht.experience', 'Experience')}{' '}
              <span className="gradient-gold italic font-light">
                {yacht.name}
              </span>
            </h2>

            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
              {t('yacht.ctaText', 'Ready to explore the Greek islands aboard this magnificent vessel? Choose how you\'d like to connect.')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="https://calendly.com/george-georgeyachts/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {t('yacht.bookVideo', 'Book a Video Consultation')}
              </a>

              <a
                href="/#contact"
                className="btn-secondary"
              >
                {t('yacht.submitInquiry', 'Submit an Inquiry')}
              </a>
            </div>

            <p className="text-center text-gray-500 text-xs mt-8 tracking-widest uppercase">
              {t('yacht.servicePromise', 'Personal service · No obligation · Response within 24 hours')}
            </p>
          </div>
        </section>

        {/* BACK LINK */}
        <section className="yacht-back">
          <div className="container">
            <Link href="/charter-yacht-greece" className="yacht-back__link">
              ← {t('yacht.viewAllYachts', 'View All Charter Yachts')}
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
