import type { VerificationStatus } from "@/lib/enums";

const styles: Record<VerificationStatus, string> = {
  draft: "border-rule-strong text-ink-muted",
  pending_review: "border-caution-rule bg-caution text-caution-ink",
  verified: "border-ink bg-ink text-paper",
  needs_update: "border-caution-rule text-caution-ink",
  rejected: "border-rule-strong text-ink-muted line-through",
};

export const statusLabels: Record<VerificationStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  verified: "Verified",
  needs_update: "Needs update",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: VerificationStatus }) {
  return <span className={`inline-block border px-1.5 py-px text-xs font-semibold whitespace-nowrap ${styles[status]}`}>{statusLabels[status]}</span>;
}
