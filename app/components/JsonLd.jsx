/**
 * JsonLd.jsx - Reusable JSON-LD Schema Component
 * 
 * This component renders structured data that helps AI search engines
 * (ChatGPT, Perplexity, Google AI Overviews) understand and cite your content.
 */

export default function JsonLd({ data }) {
    return (
          <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
                />
        );
}
