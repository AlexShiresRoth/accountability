import { redirect } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { TextField } from "@/components/admin/fields";
import { getResearcher } from "@/lib/admin/session";
import { adminPasswordProblem } from "@/lib/admin/session-token";
import { loginAction } from "../actions";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getResearcher()) redirect("/admin");
  const problem = adminPasswordProblem(process.env.ADMIN_PASSWORD);

  return (
    <div className="mx-auto max-w-sm space-y-6 py-10">
      <h1 className="text-2xl">Sign in</h1>
      {problem && (
        <p className="border-l-4 border-caution-rule bg-caution px-4 py-2 text-sm text-caution-ink">
          Sign-in is disabled until the server is configured: {problem}
        </p>
      )}
      <ActionForm action={loginAction} submitLabel="Sign in">
        <TextField name="name" label="Your name" required hint="Recorded with every change and verification you make." />
        <TextField name="password" label="Password" type="password" required />
      </ActionForm>
    </div>
  );
}
