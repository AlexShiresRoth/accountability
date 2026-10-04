// CourtListener (Free Law Project) RECAP search: federal court dockets where the institution is a named party.
// Keyless for light use. Finds case leads for researchers; it never creates case records.
// Coverage: federal courts only. State-court suits (like Jane Doe v. Cornell University in New York Supreme Court)
// are not covered and still arrive through news discovery.

import { searchTermGroups } from "./terms";

const ENDPOINT = "https://www.courtlistener.com/api/rest/v4/search/";
const SITE = "https://www.courtlistener.com";

export type DocketLead = {
  url: string;
  title: string;
  court: string | null;
  filedAt: Date | null;
  docketNumber: string | null;
};

/** Dockets naming one of `partyNames`, filed on or after `since`, whose filings mention any search term. */
export function courtListenerUrl(partyNames: string[], since: string): string {
  const parties = partyNames.map((n) => `"${n}"`).join(" OR ");
  const terms = searchTermGroups.flat().join(" OR ");
  const q = `caseName:(${parties}) AND (${terms})`;
  return `${ENDPOINT}?${new URLSearchParams({ q, type: "r", order_by: "dateFiled desc", filed_after: since })}`;
}

type ApiResult = {
  caseName?: string;
  court?: string;
  court_citation_string?: string;
  dateFiled?: string;
  docketNumber?: string;
  docket_absolute_url?: string;
};

export function parseCourtListener(body: string): DocketLead[] {
  let data: { results?: ApiResult[] };
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`CourtListener returned a non-JSON response: ${body.slice(0, 120)}`);
  }
  return (data.results ?? [])
    .filter((r) => r.docket_absolute_url && r.caseName)
    .map((r) => {
      const court = r.court_citation_string || r.court || null;
      const docketNumber = r.docketNumber ?? null;
      return {
        url: `${SITE}${r.docket_absolute_url}`,
        title: `${r.caseName!.trim()} (${[court, docketNumber && `No. ${docketNumber}`].filter(Boolean).join(", ")})`,
        court,
        filedAt: r.dateFiled ? new Date(`${r.dateFiled.slice(0, 10)}T00:00:00Z`) : null,
        docketNumber,
      };
    });
}

export const isCourtListenerUrl = (url: string) => {
  try {
    return new URL(url).hostname.endsWith("courtlistener.com");
  } catch {
    return false;
  }
};
