import { TextField } from "./fields";

type CollegeValues = {
  slug?: string;
  name?: string;
  aliases?: string[];
  city?: string | null;
  state?: string | null;
  enrollment?: number | null;
  enrollmentNote?: string | null;
  lastReviewedAt?: string | null;
};

export function CollegeFields({ college = {} }: { college?: CollegeValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="name" label="Name" required defaultValue={college.name} />
      <TextField name="slug" label="URL slug" required defaultValue={college.slug} hint="e.g. cornell-university. Changing it changes the public URL." />
      <div className="sm:col-span-2">
        <TextField name="aliases" label="Other names" defaultValue={college.aliases?.join(", ")} hint="Comma-separated, used by search." />
      </div>
      <TextField name="city" label="City" defaultValue={college.city} />
      <TextField name="state" label="State" defaultValue={college.state} />
      <TextField name="enrollment" label="Enrollment" defaultValue={college.enrollment} hint="Only from a cited source." />
      <TextField name="enrollmentNote" label="Enrollment note" defaultValue={college.enrollmentNote} hint="Which year and population, e.g. “Fall 2025, all students”." />
      <TextField name="lastReviewedAt" label="Last reviewed" type="date" defaultValue={college.lastReviewedAt} />
    </div>
  );
}
