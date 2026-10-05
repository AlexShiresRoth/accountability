import { serializeJsonLd, type JsonLdObject } from "@/lib/seo";

/** Structured data for search engines. A plain <script>: it is data, not executable code. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
