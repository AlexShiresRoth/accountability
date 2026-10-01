import Link from "next/link";
import { StatusBadge } from "@/components/admin/status";
import { db } from "@/db";
import { listSources } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";
import { sourceTypes } from "@/lib/source-types";

export const metadata = { title: "Sources" };

export default async function SourcesAdmin() {
  await requireResearcherPage();
  const sources = await listSources(db);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl">Sources</h1>
        <Link href="/admin/sources/new" className="bg-ink px-4 py-2 text-sm font-medium text-paper no-underline">
          New source
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-rule-strong">
              <th className="py-2 pr-4 font-medium">Title</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Publisher</th>
              <th className="py-2 pr-4 font-medium">Published</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((src) => (
              <tr key={src.id} className="border-b border-rule">
                <td className="py-2 pr-4">
                  <Link href={`/admin/sources/${src.id}`}>{src.title}</Link>
                  {src.isDemo && <span className="ml-2 text-xs text-demo-ink">demo</span>}
                </td>
                <td className="py-2 pr-4">{sourceTypes[src.type].label}</td>
                <td className="py-2 pr-4">{src.publisher}</td>
                <td className="tabular py-2 pr-4">{src.publicationDate ?? "—"}</td>
                <td className="py-2">
                  <StatusBadge status={src.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
