import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { SiteShell } from "@/components/site-shell";
import { parseMockSession } from "@/lib/mock-auth";
import { cookies } from "next/headers";

export default async function AuthPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const cookieStore = await cookies();
  const session = parseMockSession(cookieStore.get("milestone_session")?.value);
  if (session) redirect("/dashboard");

  const params = await searchParams;
  const nextPath = params.next ?? "/dashboard";

  return (
    <SiteShell compact>
      <div className="mx-auto max-w-5xl py-8">
        <AuthForm nextPath={nextPath} />
      </div>
    </SiteShell>
  );
}
