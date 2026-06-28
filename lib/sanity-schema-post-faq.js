/**
 * Sanity Schema: faqItems field for the post document
 *
 * Adds a structured Q&A array to blog posts so authoring teams can enter
 * FAQ pairs as discrete data instead of inline H3-followed-by-paragraph
 * inside the body. Used for FAQPage JSON-LD (machine-readable for AI
 * search / Google rich results) and a visible "Frequently asked
 * questions" section on the live page.
 *
 * The blog post page in this repo
 * (`app/blog/[slug]/page.jsx`) already supports BOTH paths:
 *
 *   - Preferred: structured `faqItems` field on the post (this schema)
 *   - Fallback: body H3 ending in "?" followed by a normal paragraph
 *     (legacy posts continue to work — see `extractFAQs()` in the page).
 *
 * Posts without `faqItems` render normally; no empty section, no broken
 * JSON-LD. Adding the field is fully additive.
 *
 * Apply in the Sanity Studio project (this lives outside this repo):
 *
 *   // schemas/post.ts (or wherever the post document is defined)
 *   import { postFaqItemsField } from './post-faq-items'; // place this file
 *
 *   export default defineType({
 *     name: 'post',
 *     type: 'document',
 *     fields: [
 *       // ...existing fields (title, slug, author, mainImage,
 *       //   publishedAt, excerpt, quickAnswer, body) up to and
 *       //   including `body`
 *       postFaqItemsField,   // <-- positioned after `body`,
 *                             //     before `relatedYachts`
 *       // ...relatedYachts
 *     ],
 *   });
 *
 * Then `npx sanity deploy` from the Studio project.
 */

export const postFaqItemsField = {
  name: "faqItems",
  title: "FAQ Items (for FAQPage schema)",
  description:
    "Optional. Q&A pairs rendered as FAQPage JSON-LD for AI search citation and as a visible accordion below the article body. Leave empty to omit the section entirely.",
  type: "array",
  of: [
    {
      type: "object",
      name: "faqItem",
      title: "FAQ Item",
      fields: [
        {
          name: "question",
          title: "Question",
          type: "string",
          validation: (Rule) => Rule.required().max(200),
        },
        {
          name: "answer",
          title: "Answer",
          type: "text",
          rows: 5,
          validation: (Rule) => Rule.required().min(40).max(800),
          description:
            "Plain text answer. 40-800 characters. No markdown - write naturally as a complete paragraph.",
        },
      ],
      preview: {
        select: {
          title: "question",
          subtitle: "answer",
        },
      },
    },
  ],
};
