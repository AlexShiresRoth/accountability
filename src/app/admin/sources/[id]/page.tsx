import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { PublishedEditWarning } from "@/components/admin/fields";
import { DeletePanel, StatusPanel } from "@/components/admin/panels";
import { SourceFields } from "@/components/admin/source-fields";
import { db } from "@/db";
import { getSource } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { updateSourceAction } from "../../actions";

export const metadata = { title: "Source" };

export default async function SourceAdmin({ params, searchParams }: PageProps<"/admin/sources/[id]">) {
  await requireResearcherPage();
  const { id } = await params;
  const data = await getSource(db, id);
  if (!data) notFound();
  const { source, usage } = data;
  const accepted = (await searchParams).accepted === "1";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-muted">
          <Link href="/admin/sources">Sources</Link> /
        </p>
        <h1 className="text-2xl">{source.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Cited {usage.citations} time(s) · used by {usage.reports} Clery report(s)
          {source.isDemo && " · demo fixture"}
        </p>
      </div>
      {accepted && (
        <p className="border-l-4 border-ink bg-surface px-4 py-2 text-sm">
          Accepted from the inbox as a draft source with a draft coverage entry. Check the article, archive it, and verify
          both before anything is published.
        </p>
      )}
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <PublishedEditWarning status={source.status} />
          <ActionForm action={updateSourceAction.bind(null, source.id)} submitLabel="Save source details">
            <SourceFields source={source} />
          </ActionForm>
        </div>
        <div className="space-y-4">
          <StatusPanel recordKey="source" record={source} />
          <DeletePanel recordKey="source" id={source.id} status={source.status} redirectTo="/admin/sources" />
        </div>
      </div>
    </div>
  );
}
