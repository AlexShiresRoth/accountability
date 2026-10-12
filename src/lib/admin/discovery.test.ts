import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Database } from "@/db/types";
import type { FetchText } from "@/jobs/discovery/run";
import { createTestDb } from "@/test/db";
import { fixtures } from "@/test/fixtures";
import { runManualDiscovery } from "./discovery";

let db: Database;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ db, close } = await createTestDb());
  const f = fixtures(db);
  await f.college({ slug: "university-of-chicago", name: "University of Chicago", status: "draft" });
  await f.college({ slug: "cornell-university", name: "Cornell University", status: "draft" });
});
afterAll(() => close());

function recordingFetch() {
  const urls: string[] = [];
  const fetchText: FetchText = async (url) => {
    urls.push(decodeURIComponent(url));
    return { status: 200, body: url.includes("courtlistener") ? '{"results":[]}' : "<rss><channel></channel></rss>" };
  };
  return { urls, overrides: { fetchText, sleep: async () => {} } };
}

describe("runManualDiscovery", () => {
  it("searches only the chosen school, with the chosen lookback, and records who ran it", async () => {
    const { urls, overrides } = recordingFetch();
    const run = await runManualDiscovery(db, { collegeSlug: "university-of-chicago", days: 90, actor: "Alex" }, overrides);
    expect(run.ok).toBe(true);
    if (!run.ok) return;

    expect(urls).toContain("https://chicagomaroon.com/feed/");
    expect(urls.some((u) => u.includes("Cornell"))).toBe(false);
    expect(urls.filter((u) => u.includes("news.google.com")).every((u) => u.includes("when:90d"))).toBe(true);
    expect(urls.some((u) => u.includes("gdelt"))).toBe(false); // off on the server unless DISCOVERY_GDELT=on

    const [row] = await db.select().from(s.ingestionRuns).where(eq(s.ingestionRuns.id, run.result.runId));
    expect(row.triggeredBy).toBe("admin");
    expect(row.summary).toMatchObject({ scope: "University of Chicago, last 90 days (Alex)" });
  });

  it("refuses unknown schools, schools not in the database, and other lookbacks", async () => {
    const { overrides } = recordingFetch();
    expect(await runManualDiscovery(db, { collegeSlug: "nowhere", days: 2, actor: "A" }, overrides)).toMatchObject({ ok: false });
    expect(await runManualDiscovery(db, { collegeSlug: "ucla", days: 2, actor: "A" }, overrides)).toMatchObject({
      ok: false,
      problems: [expect.stringContaining("isn’t in the database")],
    });
    expect(await runManualDiscovery(db, { collegeSlug: "cornell-university", days: 365, actor: "A" }, overrides)).toMatchObject({ ok: false });
  });

  it("does not start while another run is in progress", async () => {
    const [running] = await db.insert(s.ingestionRuns).values({ job: "discovery", triggeredBy: "cron" }).returning();
    const { urls, overrides } = recordingFetch();
    const run = await runManualDiscovery(db, { collegeSlug: "cornell-university", days: 2, actor: "A" }, overrides);
    expect(run).toMatchObject({ ok: false, problems: [expect.stringContaining("in progress")] });
    expect(urls).toEqual([]);
    await db.delete(s.ingestionRuns).where(eq(s.ingestionRuns.id, running.id));
  });
});
