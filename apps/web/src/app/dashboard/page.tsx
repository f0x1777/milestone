import { cookies } from "next/headers";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LogOut,
  PauseCircle,
  Sparkles,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { getDashboardSnapshot } from "@/lib/grants";
import { parseMockSession } from "@/lib/mock-auth";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getQueryValue(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const cookieStore = await cookies();
  const session = parseMockSession(
    cookieStore.get("milestone_session")?.value
  );
  const snapshot = await getDashboardSnapshot();
  const params = (await searchParams) ?? {};
  const createdGrantSlug = getQueryValue(params, "grantCreated");
  const grantError = getQueryValue(params, "grantError");

  return (
    <SiteShell>
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-milestone-400">
                Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal-900">
                Milestone control room
              </h1>
            </div>
            <div className="rounded-full border border-milestone-200 bg-milestone-50 px-4 py-2 text-sm font-semibold text-milestone-600">
              {session ? `${session.name} · ${session.role}` : "Guest"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Active grants"
              value={snapshot.stats.activeGrants}
              hint="Funding, active and paused grants included."
              accent
            />
            <StatCard
              label="Escrowed"
              value={snapshot.stats.escrowed}
              hint="Current total grant commitment."
            />
            <StatCard
              label="Released"
              value={snapshot.stats.released}
              hint="Based on persisted released amounts."
            />
            <StatCard
              label="Open flags"
              value={snapshot.stats.openFlags}
              hint="Paused grants still awaiting resolution."
            />
          </div>

          <div className="mt-6 grid gap-4">
            {createdGrantSlug ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                Grant created successfully:{" "}
                <span className="font-semibold">{createdGrantSlug}</span>
              </div>
            ) : null}
            {grantError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                {grantError}
              </div>
            ) : null}
            <div className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-charcoal-800">
                    Current data connection
                  </p>
                  <p className="mt-2 text-sm text-charcoal-400">
                    {snapshot.sourceLabel}. Supabase-backed reads are active when
                    credentials exist. Contract execution is still the next step.
                  </p>
                </div>
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-600 shadow-soft transition hover:border-milestone-300 hover:bg-milestone-50"
                >
                  Reauth
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
          <SectionHeading
            eyebrow="Create Grant"
            title="Persist a real grant into Supabase"
            description="This form writes to the existing schema when server-side Supabase credentials are configured."
          />
          <form action="/api/grants" method="post" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-charcoal-600">
                Grant title
                <input
                  name="title"
                  required
                  minLength={4}
                  placeholder="Milestone Builders Fund"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-charcoal-600">
                Visibility
                <select
                  name="visibility"
                  defaultValue="public"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-charcoal-600">
              Summary
              <textarea
                name="summary"
                rows={3}
                placeholder="What outcome is the sponsor funding and how will it be reviewed?"
                className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-charcoal-600">
                Total amount (XLM)
                <input
                  name="totalAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="12500"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-charcoal-600">
                Cap per window (XLM)
                <input
                  name="capPerWindow"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="3500"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-charcoal-600">
                Reviewer name
                <input
                  name="reviewerName"
                  placeholder="Testnet Reviewer"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-charcoal-600">
                Beneficiary name
                <input
                  name="beneficiaryName"
                  placeholder="LATAM Builder Cohort"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
            </div>
            <div className="grid gap-3">
              {[
                {
                  icon: CheckCircle2,
                  title: "Creates the grant",
                  detail:
                    "Persists title, summary, amounts, visibility and related actors.",
                },
                {
                  icon: Sparkles,
                  title: "Adds the first milestone",
                  detail:
                    "The initial review window is created automatically.",
                },
                {
                  icon: PauseCircle,
                  title: "Writes an audit event",
                  detail:
                    "The creation event becomes part of the timeline.",
                },
              ].map(({ icon: Icon, title, detail }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-charcoal-100 bg-charcoal-50 p-4"
                >
                  <div className="rounded-lg bg-milestone-50 p-2 text-milestone-500 ring-1 ring-milestone-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-800">{title}</p>
                    <p className="mt-1 text-sm text-charcoal-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-6 py-3 text-sm font-semibold text-white shadow-cta-inset transition-all hover:from-charcoal-900 hover:to-black"
              >
                Create grant
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-sm text-charcoal-400">
                If write access is missing, the route returns a clear setup
                error instead of failing silently.
              </p>
            </div>
          </form>

          <form action="/api/mock-auth/logout" method="post" className="mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-600 shadow-soft transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      </section>

      <section className="mt-14 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
          <SectionHeading
            eyebrow="Grants"
            title="Tracked grants now come from the shared data layer"
            description="When Supabase is configured, this list reflects persisted grants instead of static demo cards."
          />
          <div className="mt-6 space-y-4">
            {snapshot.grants.map((grant) => (
              <div
                key={grant.id}
                className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-4 transition-shadow hover:shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-charcoal-800">
                      {grant.title}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-400">
                      {grant.beneficiary} · Reviewer: {grant.reviewer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-milestone-500">
                      {grant.amount}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-300">
                      {grant.status}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-charcoal-100 bg-white px-4 py-3 text-sm text-charcoal-500">
                  <span>{grant.release}</span>
                  <span className="text-right">{grant.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
          <SectionHeading
            eyebrow="Audit trail"
            title="The board keeps decisions visible"
            description="Hashes, evidence and release events are meant to survive the next implementation step."
          />
          <div className="mt-6 grid gap-3">
            {snapshot.auditTrail.map((item) => (
              <div
                key={`${item.label}-${item.createdAt ?? item.detail}`}
                className="rounded-xl border border-charcoal-100 bg-charcoal-50 p-4 transition-shadow hover:shadow-soft"
              >
                <p className="font-medium text-charcoal-800">{item.label}</p>
                <p className="mt-1 text-sm text-charcoal-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
        <SectionHeading
          eyebrow="Delegated GitHub flow"
          title="Repository access is designed as an operational delegation"
          description="This keeps Milestone aligned with a future delegated test account without forcing direct repo write access."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {snapshot.delegatedGithubWorkflow.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-4 transition-shadow hover:shadow-soft"
            >
              <p className="font-medium text-charcoal-800">{step.title}</p>
              <p className="mt-2 text-sm text-charcoal-400">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
