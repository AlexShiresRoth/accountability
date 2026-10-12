// Case: police investigation of an alleged sexual assault at a fraternity house near the University of Chicago,
// October 11, 2026.
//
// Researched 2026-10-12 by Claude, the day after the alleged incident. Status after import: pending_review.
// This is a developing matter: re-check every source before verifying, and add later developments as new events.
//
// Before verifying, decide whether this meets the bar for a case record. Unlike the Chi Phi case there is, so far,
// no proceeding and no account of the university's handling: an open police investigation, a university alert, and
// a national fraternity's directive. The woman is not affiliated with the university, and the fraternity has no
// formal affiliation with it (per the university's alert). Holding the record until there is an arrest, a charge,
// a university process, or a lawsuit is a reasonable choice.
//
// Editorial choices (review them):
// - No individual is named or described. The university's alert, as quoted by the Maroon, gives eyewitnesses'
//   description of the suspect, including ethnicity; none of it is used. Nobody has been identified or charged.
// - The woman's age (given by Chicago police) is left out, as is everything about her beyond what is needed to
//   state what was reported.
// - Location context is "off_campus" and no address is recorded: the sources say the house is near the campus,
//   and the university's alert says fraternities have no formal affiliation with it. Whether the house falls within
//   UChicago's Clery geography (e.g. as public property or noncampus) was not checked.
// - The fraternity chapter is named, as in the Chi Phi case: the institutional question here (how the university
//   relates to unrecognised fraternities whose members are its students) depends on it.
//
// Primary records: the university's community alert was not located on safety-security.uchicago.edu (its News &
// Alerts index and the usual security-alert URL forms were checked on 2026-10-12; the alert may have gone out by
// email or text only). Its content is therefore cited through the Maroon and ABC7, which quote it. No Chicago Police
// Department release was located; police statements are cited through the Sun-Times and ABC7.
//
// Conflicting detail (not entered): the Maroon reports that a UCPD officer on patrol was flagged down and arranged
// for the woman to be taken to the University of Chicago Medical Center; ABC7, citing police, says she
// "self-transported". The events say only that she was treated there.
//
// Excerpts were checked against the article text downloaded on 2026-10-12 (WGN's article returned HTTP 403 and is
// not cited).
//
// Monitoring (set in admin → case → Monitoring after import; bundles cannot set it): suggested search terms
// "Alpha Epsilon Pi", "AEPi".
//
// Not entered (follow-up):
// - The university community alert itself, if it is posted or archived.
// - Any Chicago Police Department statement or arrest record.
// - Whether the university opens its own process (the Maroon asked; the university had not answered).

import type { ResearchBundle } from "@/lib/admin/research-bundle";

const maroon = (pinpoint: string, excerpt?: string, claim?: string) => ({ source: "maroon20261011", pinpoint, excerpt, claim });
const abc7 = (pinpoint: string, excerpt?: string, claim?: string) => ({ source: "abc720261012", pinpoint, excerpt, claim });
const sunTimes = (pinpoint: string, excerpt?: string, claim?: string) => ({ source: "sunTimes20261012", pinpoint, excerpt, claim });

export const uchicagoAepi: ResearchBundle = {
  college: {
    slug: "university-of-chicago",
    create: { name: "University of Chicago", aliases: ["UChicago", "U of C"], city: "Chicago", state: "IL" },
  },
  sources: {
    maroon20261011: {
      type: "reputable_journalism",
      publisher: "The Chicago Maroon",
      title: "Sexual Assault Reported at AEPi Fraternity House",
      url: "https://chicagomaroon.com/53960/news/sexual-assault-reported-at-aepi-fraternity-house/",
      archivedUrl: null,
      publicationDate: "2026-10-11",
      retrievedAt: "2026-10-12",
      documentPath: null,
      notes:
        "University of Chicago student newspaper. Quotes the University's community alert of October 11, 2026, and a statement from Alpha Epsilon Pi's national organization. Marked as updated 8:15 p.m. October 11 to add the national organization's comments.",
      internalNotes:
        "RSS pubDate Mon, 12 Oct 2026 00:56:05 +0000 (October 11, Chicago time). The site answers HTTP 403 to browser user agents; it was read with the discovery bot's user agent. Quotes the alert's description of the suspect, including ethnicity: do not reproduce it.",
    },
    sunTimes20261012: {
      type: "reputable_journalism",
      publisher: "Chicago Sun-Times",
      title: "Woman, 21, sexually assaulted at frat house near the University of Chicago in Hyde Park",
      url: "https://chicago.suntimes.com/crime/2026/10/12/woman-21-sexually-assaulted-near-the-university-of-chicago-in-hyde-park",
      archivedUrl: null,
      publicationDate: "2026-10-12",
      retrievedAt: "2026-10-12",
      documentPath: null,
      notes: "Reports Chicago police statements; attributes the fraternity's name to the Chicago Maroon.",
      internalNotes: "datePublished 2026-10-12T11:45:52Z, dateModified 2026-10-12T12:11:35Z. Gives the block of the address and the woman's age: do not reproduce either.",
    },
    abc720261012: {
      type: "reputable_journalism",
      publisher: "ABC7 Chicago (WLS-TV)",
      title: "Woman says someone sexually assaulted her fraternity house near UChicago campus: police",
      url: "https://abc7chicago.com/post/uchicago-news-police-investigating-alleged-sexual-assault-university-avenue-chicago-campus-hyde-park/19930976/",
      archivedUrl: null,
      publicationDate: "2026-10-12",
      retrievedAt: "2026-10-12",
      documentPath: null,
      notes:
        "Reports Chicago police statements and the University's alert, and prints the full statement of Alpha Epsilon Pi Headquarters. The headline is as printed (it omits a word).",
      internalNotes:
        "datePublished 2026-10-12T02:06:00Z (October 11, Chicago time), dateModified 2026-10-12T12:58:07Z; publicationDate uses the UTC date. Says the woman \"self-transported\" to the hospital, which differs from the Maroon's account.",
    },
  },
  reports: [],

  cases: [
    {
      slug: "uchicago-2026-aepi",
      title: "Police investigation of an alleged sexual assault at a fraternity house near the University of Chicago",
      summary:
        "A woman reported that she was sexually assaulted during a party at the Alpha Epsilon Pi fraternity's Lambda chapter house, near the University of Chicago campus, early on October 11, 2026. Chicago police are investigating with the University of Chicago Police Department. The woman is not affiliated with the university. In its community alert, the university said fraternities are not recognized student organizations, but that students who belong to them remain subject to university policies and disciplinary procedures. Alpha Epsilon Pi's national headquarters said it had told the chapter not to hold events while the investigation is pending. As of October 12, 2026, no arrest had been reported, according to the sources reviewed.",
      locationContext: "off_campus",
      publicationJustification:
        "Documents a reported sexual assault at a fraternity house whose members are University of Chicago students, the police investigation that followed, and how the university describes its relationship to fraternities it does not recognize. Review before verifying: there is not yet any proceeding or account of the university's own handling.",
      collegeSlugs: ["university-of-chicago"],
      citations: [
        maroon(
          "Article",
          "fraternities are not recognized student organizations and have no formal affiliation with the University",
          "University's description of its relationship to fraternities, from its community alert",
        ),
        abc7("AEPi Headquarters statement", "the chapter has been told to not hold any events or programs", "National fraternity's directive to the chapter"),
      ],
      events: [
        {
          ref: "incident",
          eventDate: "2026-10-11",
          datePrecision: "day",
          sequence: 0,
          eventType: "alleged_incident",
          description:
            "A woman reported that a man sexually assaulted her at about 2 a.m. on Sunday, October 11, 2026, during a party at the house of the Lambda chapter of the Alpha Epsilon Pi fraternity, according to Chicago police and a University of Chicago community alert as reported by the Chicago Maroon, the Chicago Sun-Times and ABC7 Chicago. According to the alert, the suspect, who has not been identified, fled the house after another person intervened. She was treated at the University of Chicago Medical Center. This is a reported allegation; no one has been charged.",
          citations: [
            maroon(
              "Article",
              "A woman reported being sexually assaulted at the house of the Lambda chapter of the Alpha Epsilon Pi (AEPi) fraternity early Sunday morning",
              "Report of the assault and location, per the University's alert",
            ),
            maroon("Article", "an unidentified suspect fled the building after an individual intervened", "Suspect fled after someone intervened"),
            abc7("Article", "An alert by the University of Chicago said the incident occurred during a party at a fraternity house.", "University alert"),
            sunTimes("Article", "The woman told officers the assault happened around 2 a.m. Sunday", "Time of the reported assault, per Chicago police"),
          ],
        },
        {
          ref: "university-alert",
          eventDate: "2026-10-11",
          datePrecision: "day",
          sequence: 1,
          eventType: "university_report",
          description:
            "The University of Chicago Police Department learned of the report the same night: according to the Chicago Maroon, a UCPD officer on patrol was flagged down after the incident. That afternoon the university issued a community alert. It said fraternities are not recognized student organizations and have no formal affiliation with the university, but that students in fraternities remain subject to university policies and disciplinary procedures, and it asked anyone with information to contact Chicago police or UCPD. A university spokesperson did not immediately say whether the university was pursuing its own investigation, according to the Maroon.",
          citations: [
            maroon("Article", "A UCPD officer on patrol was flagged down following the incident", "UCPD's involvement that night"),
            maroon(
              "Article",
              "students in fraternities remain subject to University policies and disciplinary procedures",
              "Content of the University's community alert",
            ),
            maroon(
              "Article",
              "did not immediately respond to questions about whether UChicago was pursuing an investigation independent from the CPD’s",
              "Whether the University opened its own process",
            ),
          ],
        },
        {
          ref: "police-investigation",
          eventDate: "2026-10-11",
          datePrecision: "day",
          sequence: 2,
          eventType: "police_report",
          description:
            "The Chicago Police Department is investigating the reported assault, with support from the University of Chicago Police Department. As of October 12, 2026, no arrest had been reported in the sources reviewed.",
          citations: [
            maroon("Article", "The Chicago Police Department is conducting an investigation with support from UCPD.", "Investigating agencies"),
            sunTimes("Article", "Chicago police are investigating", "Chicago police investigation"),
          ],
        },
      ],
    },
  ],
};
