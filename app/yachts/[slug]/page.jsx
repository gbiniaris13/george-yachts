import { sanityClient } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import YachtPageContent from './YachtPageContent';
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
      <YachtPageContent
        yacht={{
          name: yacht.name,
          subtitle: yacht.subtitle,
          georgeInsiderTip: yacht.georgeInsiderTip,
          length: yacht.length,
          yearBuiltRefit: yacht.yearBuiltRefit,
          builder: yacht.builder,
          sleeps: yacht.sleeps,
          cabins: yacht.cabins,
          crew: yacht.crew,
          maxSpeed: yacht.maxSpeed,
          cruiseSpeed: yacht.cruiseSpeed,
          weeklyRatePrice: yacht.weeklyRatePrice,
          features: yacht.features,
          toys: yacht.toys,
          idealFor: yacht.idealFor,
          images: yacht.images,
        }}
        heroImage={heroImage}
        description={yacht.description}
      />
    </>
  );
}
