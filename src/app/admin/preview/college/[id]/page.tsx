import Link from "next/link";
import { notFound } from "next/navigation";
import { CollegeProfileView } from "@/components/college/profile-view";
import { db } from "@/db";
import { getCollege } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { getCollegeProfile } from "@/lib/public/queries";
import { shouldHideDemo } from "@/lib/public/visibility";

export const metadata = { title: "Profile preview" };

/** The public profile as it would look with drafts and pending records published. Rejected records are excluded. */
export default async function CollegePreview({ params }: PageProps<"/admin/preview/college/[id]">) {
  await requireResearcherPage();
  const data = await getCollege(db, (await params).id);
  if (!data) notFound();
  const profile = await getCollegeProfile({ db, hideDemo: shouldHideDemo(), preview: true }, data.college.slug);

  return (
    <div className="-mx-4 -my-8">
      <div className="border-b-2 border-dashed border-demo-rule bg-demo px-4 py-3 text-sm text-demo-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p>
            <strong>Preview.</strong> Includes drafts and records awaiting review, tagged &ldquo;Not yet verified&rdquo;.
            Only verified records appear on the public page. Rejected records are left out.
          </p>
          <p className="flex gap-4">
            <Link href={`/admin/colleges/${data.college.id}`} className="text-demo-ink">
              Back to admin
            </Link>
            <Link href={`/college/${data.college.slug}`} className="text-demo-ink">
              Public page
            </Link>
          </p>
        </div>
      </div>
      {profile ? (
        <CollegeProfileView profile={profile} />
      ) : (
        <p className="mx-auto max-w-5xl px-4 py-12 text-ink-muted">This college is rejected, so there is nothing to preview.</p>
      )}
    </div>
  );
}
