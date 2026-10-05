import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./site";

// Social sharing card (Open Graph / X), rendered in the site's dark palette with its typefaces.

export const ogSize = { width: 1200, height: 630 };

const colors = { paper: "#15171a", ink: "#e8e5de", muted: "#a8a399", accent: "#9db8d8", rule: "#2c2f34" };

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

/** Smaller type for longer titles, so case titles fit in three or four lines. */
function titleSize(title: string): number {
  if (title.length <= 40) return 76;
  if (title.length <= 80) return 60;
  return 48;
}

export async function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const [serif, sans] = await Promise.all([font("source-serif-4-semibold.ttf"), font("inter-medium.ttf")]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: colors.accent }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontFamily: "Source Serif", fontSize: titleSize(title), lineHeight: 1.12, maxWidth: 1000 }}>
            {title}
          </div>
          {subtitle && <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: colors.muted, maxWidth: 960 }}>{subtitle}</div>}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${colors.rule}`,
            paddingTop: 28,
            fontSize: 24,
            color: colors.muted,
          }}
        >
          <span>{site.name}</span>
          <span>Sourced · Verified · Cited</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Source Serif", data: serif, weight: 600, style: "normal" },
        { name: "Inter", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
