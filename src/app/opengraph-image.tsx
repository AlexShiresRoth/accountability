import { ogCard, ogSize } from "@/lib/og-card";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.description}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Campus accountability",
    title: "Look beyond the rankings.",
    subtitle: "How universities report, prevent, and respond to violence against women.",
  });
}
