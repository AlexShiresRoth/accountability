import { splitLinks } from "@/lib/linkify";

/** Renders text with any http(s) URLs as external links. Phrasing content only, so it is safe inside <p>. */
export function Linkify({ text }: { text: string }) {
  return (
    <>
      {splitLinks(text).map((seg, i) =>
        seg.type === "link" ? (
          <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer nofollow" className="break-words">
            {seg.value}
          </a>
        ) : (
          seg.value
        ),
      )}
    </>
  );
}
