import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ecqr94ey',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
});

function nameToSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/^[sm]\/y\s+/i, '')
    .replace(/^cruise ship\s+/i, '')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

async function generateSlugs() {
  const yachts = await client.fetch('*[_type == "yacht" && !defined(slug.current) && !(_id in path("drafts.**"))]{_id, name}');

  console.log(`Found ${yachts.length} yachts without slugs\n`);

  const slugMap = {};

  for (const yacht of yachts) {
    if (!yacht.name) {
      console.log(`⚠️ Skipping ${yacht._id} — no name`);
      continue;
    }

    let slug = nameToSlug(yacht.name);

    if (slugMap[slug]) {
      slug = slug + '-' + Math.random().toString(36).substring(2, 5);
    }
    slugMap[slug] = true;

    try {
      await client.patch(yacht._id)
        .set({ slug: { _type: 'slug', current: slug } })
        .commit();
      console.log(`✅ ${yacht.name.trim()} → /yachts/${slug}`);
    } catch (err) {
      console.error(`❌ Failed: ${yacht.name} — ${err.message}`);
    }
  }

  console.log(`\n✅ Done! ${Object.keys(slugMap).length} slugs generated.`);
}

generateSlugs();
