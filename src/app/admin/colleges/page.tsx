import Link from "next/link";
import { StatusBadge } from "@/components/admin/status";
import { db } from "@/db";
import { listColleges } from "@/lib/admin/queries";
import { requireResearcherPage } from "@/lib/admin/session";

export const metadata = { title: "Colleges" };

export default async function CollegesAdmin() {
  await requireResearcherPage();
  const colleges = await listColleges(db);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl">Colleges</h1>
        <Link href="/admin/colleges/new" className="bg-ink px-4 py-2 text-sm font-medium text-paper no-underline">
          New college
        </Link>
      </div>
      <ul className="divide-y divide-rule border-y border-rule">
        {colleges.map((c) => (
          <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <span>
              <Link href={`/admin/colleges/${c.id}`}>{c.name}</Link>
              {c.isDemo && <span className="ml-2 text-xs text-demo-ink">demo</span>}
            </span>
            <StatusBadge status={c.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
