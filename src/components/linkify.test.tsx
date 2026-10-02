import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Linkify } from "./linkify";

describe("Linkify", () => {
  it("renders URLs as external links and keeps surrounding text", () => {
    const html = renderToStaticMarkup(
      <p>
        <Linkify text="see https://officeofcivilrights.cornell.edu/data-statistics/." />
      </p>,
    );
    expect(html).toBe(
      '<p>see <a href="https://officeofcivilrights.cornell.edu/data-statistics/" target="_blank" rel="noopener noreferrer nofollow" class="break-words">https://officeofcivilrights.cornell.edu/data-statistics/</a>.</p>',
    );
  });

  it("escapes text instead of interpreting markup", () => {
    const html = renderToStaticMarkup(<Linkify text={'<img src=x onerror="alert(1)"> https://x.edu/"><script>'} />);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
    expect(html).toContain('href="https://x.edu/"');
  });
});
