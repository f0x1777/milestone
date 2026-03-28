import { cookies } from "next/headers";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock,
  FileText,
  GitBranch,
  LogOut,
  PauseCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
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

const statusConfig: Record<string, { color: string; bg: string; dot: string }> =
  {
    live: {
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      dot: "bg-emerald-500",
    },
    active: {
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      dot: "bg-emerald-500",
    },
    "under review": {
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      dot: "bg-amber-500",
    },
    paused: {
      color: "text-rose-700",
      bg: "bg-rose-50 border-rose-200",
      dot: "bg-rose-500",
    },
    draft: {
      color: "text-charcoal-500",
      bg: "bg-charcoal-50 border-charcoal-200",
      dot: "bg-charcoal-400",
    },
    closed: {
      color: "text-charcoal-500",
      bg: "bg-charcoal-50 border-charcoal-200",
      dot: "bg-charcoal-400",
    },
  };

function getStatusStyle(status: string) {
  return (
    statusConfig[status.toLowerCase()] ?? {
      color: "text-milestone-700",
      bg: "bg-milestone-50 border-milestone-200",
      dot: "bg-milestone-500",
    }
  );
}

const auditIcons: Record<string, typeof CheckCircle2> = {
  "Grant created": FileText,
  "Funds deposited": Wallet,
  "Evidence pack submitted": GitBranch,
  "Decision hash recorded": ShieldCheck,
};

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
      {/* ── Header bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-charcoal-900">
            Grant control room
          </h1>
          <p className="mt-1 text-sm text-charcoal-400">
            Manage grants, review evidence, and track fund releases.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-charcoal-100 bg-white px-4 py-2 shadow-soft">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-milestone-100 text-milestone-600">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium text-charcoal-700">
              {session ? `${session.name}` : "Guest"}
            </span>
            {session && (
              <span className="rounded-full bg-charcoal-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal-500">
                {session.role}
              </span>
            )}
          </div>
          <form action="/api/mock-auth/logout" method="post">
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal-100 bg-white text-charcoal-400 shadow-soft transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Alerts ── */}
      {createdGrantSlug && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Grant <span className="font-semibold">{createdGrantSlug}</span>{" "}
          created successfully.
        </div>
      )}
      {grantError && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <PauseCircle className="h-4 w-4 shrink-0" />
          {grantError}
        </div>
      )}

      {/* ── Stats row ── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Active grants",
            value: snapshot.stats.activeGrants,
            icon: CircleDot,
            accent: true,
          },
          {
            label: "Escrowed",
            value: snapshot.stats.escrowed,
            icon: Wallet,
            accent: false,
          },
          {
            label: "Released",
            value: snapshot.stats.released,
            icon: TrendingUp,
            accent: false,
          },
          {
            label: "Open flags",
            value: snapshot.stats.openFlags,
            icon: PauseCircle,
            accent: false,
          },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 transition-shadow hover:shadow-card ${
              accent
                ? "border-milestone-200 bg-gradient-to-br from-milestone-50 to-white"
                : "border-charcoal-100 bg-white"
            } shadow-soft`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400">
                {label}
              </p>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  accent
                    ? "bg-milestone-100 text-milestone-500"
                    : "bg-charcoal-50 text-charcoal-400"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p
              className={`mt-3 text-3xl font-semibold tracking-tight ${
                accent ? "text-milestone-600" : "text-charcoal-900"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Data source banner ── */}
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-charcoal-100 bg-charcoal-50/50 px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-charcoal-400">
          <div
            className={`h-2 w-2 rounded-full ${
              snapshot.source === "supabase"
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          />
          {snapshot.sourceLabel}
        </div>
        <Link
          href="/auth"
          className="text-sm font-medium text-milestone-500 transition hover:text-milestone-600"
        >
          Switch account
        </Link>
      </div>

      {/* ── Grants table ── */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-charcoal-900">
              Tracked grants
            </h2>
            <p className="mt-1 text-sm text-charcoal-400">
              {snapshot.grants.length} grant
              {snapshot.grants.length !== 1 ? "s" : ""} under management
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-charcoal-100 shadow-soft">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_140px_120px_160px] gap-4 border-b border-charcoal-100 bg-charcoal-50/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400">
            <span>Grant</span>
            <span>Amount</span>
            <span>Release</span>
            <span>Status</span>
            <span>Note</span>
          </div>

          {/* Table rows */}
          {snapshot.grants.map((grant) => {
            const style = getStatusStyle(grant.status);
            return (
              <div
                key={grant.id}
                className="grid grid-cols-[1fr_140px_140px_120px_160px] items-center gap-4 border-b border-charcoal-50 bg-white px-5 py-4 transition-colors last:border-b-0 hover:bg-charcoal-50/40"
              >
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/grants/${grant.slug}`}
                    className="truncate font-medium text-charcoal-800 transition hover:text-milestone-600"
                  >
                    {grant.title}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-charcoal-400">
                    {grant.beneficiary} · {grant.reviewer}
                  </p>
                </div>
                <p className="text-sm font-semibold text-charcoal-700">
                  {grant.amount}
                </p>
                <p className="text-sm text-charcoal-500">{grant.release}</p>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.color}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                    />
                    {grant.status}
                  </span>
                </div>
                <p className="truncate text-xs text-charcoal-400">
                  {grant.note}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Create grant + Audit trail side by side ── */}
      <section className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Create grant form */}
        <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-milestone-50 text-milestone-500 ring-1 ring-milestone-200">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">
                Create a new grant
              </h2>
              <p className="text-sm text-charcoal-400">
                Define terms and commit funds to the vault.
              </p>
            </div>
          </div>

          <form action="/api/grants" method="post" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Grant title
                <input
                  name="title"
                  required
                  minLength={4}
                  placeholder="e.g. Developer Onboarding Fund"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Visibility
                <select
                  name="visibility"
                  defaultValue="public"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
              Summary
              <textarea
                name="summary"
                rows={2}
                placeholder="Describe expected outcomes and evaluation criteria."
                className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Total amount (XLM)
                <input
                  name="totalAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="12500"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Release cap per window (XLM)
                <input
                  name="capPerWindow"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder="3500"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Reviewer
                <input
                  name="reviewerName"
                  placeholder="e.g. Alice Chen"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Beneficiary
                <input
                  name="beneficiaryName"
                  placeholder="e.g. LATAM Builder Cohort"
                  className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                />
              </label>
            </div>
            <div className="rounded-2xl border border-charcoal-100 bg-charcoal-50/60 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-milestone-500">
                  Initial milestone
                </p>
                <p className="mt-1 text-sm text-charcoal-400">
                  Capture the first KPI window so the grant is ready for evidence and review immediately.
                </p>
              </div>
              <div className="mt-4 grid gap-4">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Milestone name
                  <input
                    name="firstMilestoneName"
                    placeholder="e.g. MVP shipped to testnet"
                    className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Milestone description
                  <textarea
                    name="firstMilestoneDescription"
                    rows={2}
                    placeholder="Describe the expected deliverable for the first release window."
                    className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                    Success metric
                    <input
                      name="firstMilestoneSuccessMetric"
                      placeholder="e.g. CI green + demo published"
                      className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                    Verification method
                    <input
                      name="firstMilestoneVerificationMethod"
                      placeholder="e.g. reviewer checks repo, run URL and demo"
                      className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                    />
                  </label>
                </div>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Evidence requirements
                  <textarea
                    name="firstMilestoneEvidenceRequirements"
                    rows={2}
                    placeholder="e.g. repo URL, commit hash, docs link, demo URL and test run."
                    className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                    Target date
                    <input
                      name="firstMilestoneTargetDate"
                      type="date"
                      className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                    Budget hint (XLM)
                    <input
                      name="firstMilestoneBudgetHint"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="2500"
                      className="rounded-xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100"
                    />
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-6 py-2.5 text-sm font-semibold text-white shadow-cta-inset transition-all hover:from-charcoal-900 hover:to-black"
            >
              Create grant
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Audit trail */}
        <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-50 text-charcoal-500 ring-1 ring-charcoal-200">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">
                Audit trail
              </h2>
              <p className="text-sm text-charcoal-400">
                Recent grant activity and decisions.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            {snapshot.auditTrail.map((item, index) => {
              const Icon = auditIcons[item.label] ?? CheckCircle2;
              return (
                <div
                  key={`${item.label}-${item.createdAt ?? item.detail}`}
                  className="group relative flex gap-4 py-3"
                >
                  {/* Timeline line */}
                  {index < snapshot.auditTrail.length - 1 && (
                    <div className="absolute left-[15px] top-[36px] h-[calc(100%-12px)] w-px bg-charcoal-100" />
                  )}
                  {/* Icon */}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-charcoal-100 bg-white text-charcoal-400 transition-colors group-hover:border-milestone-200 group-hover:text-milestone-500">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {/* Content */}
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-charcoal-800">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-charcoal-400">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Evidence ingestion ── */}
      <section className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-50 text-charcoal-500 ring-1 ring-charcoal-200">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900">
              Evidence ingestion
            </h2>
            <p className="text-sm text-charcoal-400">
              Automated collection from delegated GitHub repositories.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {snapshot.delegatedGithubWorkflow.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-milestone-50 text-sm font-bold text-milestone-500 ring-1 ring-milestone-200">
                {index + 1}
              </div>
              <p className="font-medium text-charcoal-800">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What happens when you create a grant ── */}
      <section className="mt-10 rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50/30 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400">
          When you create a grant
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              title: "Grant recorded",
              detail: "Title, terms, amounts, and roles are persisted.",
            },
            {
              icon: Sparkles,
              title: "First window opens",
              detail:
                "An initial review window is created for evidence submission.",
            },
            {
              icon: ShieldCheck,
              title: "Audit event logged",
              detail: "Creation enters the trail with a metadata hash.",
            },
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-milestone-400" />
              <div>
                <p className="text-sm font-medium text-charcoal-700">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
