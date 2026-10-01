import { ActionForm } from "@/components/admin/action-form";
import { SourceFields } from "@/components/admin/source-fields";
import { requireResearcherPage } from "@/lib/admin/session";
import { createSourceAction } from "../../actions";

export const metadata = { title: "New source" };

export default async function NewSource() {
  await requireResearcherPage();
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl">New source</h1>
      <ActionForm action={createSourceAction} submitLabel="Create draft source">
        <SourceFields source={{ retrievedAt: new Date().toISOString().slice(0, 10) }} />
      </ActionForm>
    </div>
  );
}
