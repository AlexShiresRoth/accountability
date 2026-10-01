import { ActionForm } from "@/components/admin/action-form";
import { CollegeFields } from "@/components/admin/college-fields";
import { requireResearcherPage } from "@/lib/admin/session";
import { createCollegeAction } from "../../actions";

export const metadata = { title: "New college" };

export default async function NewCollege() {
  await requireResearcherPage();
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl">New college</h1>
      <ActionForm action={createCollegeAction} submitLabel="Create draft college">
        <CollegeFields />
      </ActionForm>
    </div>
  );
}
