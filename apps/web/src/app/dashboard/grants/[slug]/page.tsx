import { notFound } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Flag,
  Layers3,
  ShieldCheck,
  Sparkles,
  Wallet
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { GrantDetailHero } from "@/components/grant-detail-hero";
import { GrantDetailSection } from "@/components/grant-detail-section";
import { GrantDetailStream } from "@/components/grant-detail-stream";
import {
  getGrantDetailSnapshot,
  type GrantEvaluation,
  type GrantDetailSnapshot
} from "@/lib/grants";

export const dynamic = "force-dynamic";

type GrantDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type StreamTone = "default" | "success" | "warning" | "muted";

const inputClassName =
  "rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100";

const textareaClassName =
  "rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition placeholder:text-charcoal-300 focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100";

const selectClassName =
  "rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5 text-sm text-charcoal-800 outline-none transition focus:border-milestone-400 focus:ring-2 focus:ring-milestone-100";

function getQueryValue(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Recorded just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getActionSuccessMessage(action?: string) {
  switch (action) {
    case "grant":
      return "Grant created. The first KPI window is ready for evidence and review.";
    case "milestone":
      return "Milestone saved. The grant now has a new KPI checkpoint.";
    case "evidence":
      return "Evidence pack submitted. Reviewer inputs can be recorded from this page.";
    case "evaluation":
      return "Evaluation recorded. The audit timeline has been updated.";
    default:
      return null;
  }
}

function getMilestoneTone(status: string): StreamTone {
  const normalized = status.toLowerCase();

  if (normalized.includes("approved") || normalized.includes("completed")) {
    return "success";
  }

  if (normalized.includes("paused")) {
    return "warning";
  }

  if (normalized.includes("submitted") || normalized.includes("progress")) {
    return "default";
  }

  return "muted";
}

function getEvidenceTone(status: string): StreamTone {
  const normalized = status.toLowerCase();

  if (normalized.includes("accept")) {
    return "success";
  }

  if (normalized.includes("reject")) {
    return "muted";
  }

  if (normalized.includes("review") || normalized.includes("submitted")) {
    return "warning";
  }

  return "default";
}

function getEvaluationTone(decision: string): StreamTone {
  const normalized = decision.toLowerCase();

  if (normalized.includes("approve")) {
    return "success";
  }

  if (normalized.includes("pause") || normalized.includes("reject")) {
    return "warning";
  }

  return "default";
}

function buildEvidenceDetail(pack: GrantDetailSnapshot["evidencePacks"][number]) {
  const details = [
    `Submitted ${formatTimestamp(pack.submittedAt)}`,
    pack.githubRepoUrl ? `Repo ${pack.githubRepoUrl}` : null,
    pack.githubBranch ? `Branch ${pack.githubBranch}` : null,
    pack.githubCommitHash ? `Commit ${pack.githubCommitHash}` : null,
    pack.testRunUrl ? `Run ${pack.testRunUrl}` : null,
    pack.demoUrl ? `Demo ${pack.demoUrl}` : null,
    pack.docsUrl ? `Docs ${pack.docsUrl}` : null
  ].filter(Boolean);

  return details.join(" · ");
}

function buildEvaluationDetail(evaluation: GrantEvaluation) {
  const note = evaluation.overrideReason || evaluation.reviewerNote;

  if (!note) {
    return "Reviewer note pending.";
  }

  return note;
}

function buildNextAction(snapshot: GrantDetailSnapshot) {
  if (snapshot.grant.statusKey === "paused") {
    return "Resolve the pause reason, attach the missing evidence, and request a new evaluation.";
  }

  if (!snapshot.evidencePacks.length) {
    return "Submit the first evidence pack so the reviewer can assess the active KPI window.";
  }

  if (!snapshot.evaluations.length) {
    return "Record the first reviewer evaluation and decide whether the release should move forward.";
  }

  const latestEvaluation = snapshot.evaluations[0]?.decision.toLowerCase() ?? "";

  if (latestEvaluation.includes("approve")) {
    return "The next step is to anchor the approved partial release on the Soroban vault.";
  }

  if (latestEvaluation.includes("adjust")) {
    return "Refine the release amount, document the override reason, and move the decision onchain.";
  }

  if (latestEvaluation.includes("pause") || latestEvaluation.includes("reject")) {
    return "Update the evidence pack, close the reviewer gap, and capture a fresh decision hash.";
  }

  return "Keep the active milestone explicit and continue attaching evidence for the next review window.";
}

function buildContractState(snapshot: GrantDetailSnapshot) {
  if (snapshot.grant.contractAddress) {
    return `Vault linked at ${snapshot.grant.contractAddress}. Grant reference ${snapshot.grant.contractGrantId ?? "pending sync"}.`;
  }

  return "Vault deployment is still pending. This UI is ready to map approvals, pauses, and releases onto Stellar testnet once the contract ID is available.";
}

function countOpenFlags(snapshot: GrantDetailSnapshot) {
  let flags = snapshot.grant.statusKey === "paused" ? 1 : 0;

  if (
    snapshot.evaluations.some((evaluation) => {
      const decision = evaluation.decision.toLowerCase();
      return decision.includes("pause") || decision.includes("reject");
    })
  ) {
    flags += 1;
  }

  return String(flags);
}

function getActiveMilestone(snapshot: GrantDetailSnapshot) {
  return (
    snapshot.milestones.find((milestone) => {
      const status = milestone.status.toLowerCase();
      return (
        status.includes("progress") ||
        status.includes("submitted") ||
        status.includes("planned")
      );
    }) ?? snapshot.milestones[0]
  );
}

function GrantMetric({
  label,
  value,
  hint,
  icon: Icon
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft transition-shadow hover:shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-400">
          {label}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-milestone-50 text-milestone-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-charcoal-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-charcoal-400">{hint}</p>
    </div>
  );
}

export default async function GrantDetailPage({
  params,
  searchParams
}: GrantDetailPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const actionSuccess = getActionSuccessMessage(getQueryValue(query, "actionSuccess"));
  const actionError = getQueryValue(query, "actionError");
  const result = await getGrantDetailSnapshot(slug);

  if (!result.ok) {
    if (result.status === 404) {
      notFound();
    }

    return (
      <SiteShell compact>
        <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.28em]">
            Grant detail unavailable
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-rose-900">
            We could not load this grant right now.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-rose-700">
            {result.error}
          </p>
        </section>
      </SiteShell>
    );
  }

  const detail = result.snapshot;
  const activeMilestone = getActiveMilestone(detail);

  return (
    <SiteShell compact>
      {actionSuccess ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {actionSuccess}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {actionError}
        </div>
      ) : null}

      <GrantDetailHero
        title={detail.grant.title}
        slug={detail.grant.slug}
        status={detail.grant.status}
        amount={detail.grant.amount}
        released={detail.grant.release}
        sponsor={detail.grant.sponsor}
        reviewer={detail.grant.reviewer}
        beneficiary={detail.grant.beneficiary}
        summary={detail.grant.summary}
        sourceLabel={detail.sourceLabel}
        contractAddress={detail.grant.contractAddress}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GrantMetric
          label="Active milestone"
          value={activeMilestone?.name ?? "KPI pending"}
          hint={
            activeMilestone?.successMetric ??
            "Define the first KPI checkpoint to start tracking releases."
          }
          icon={Layers3}
        />
        <GrantMetric
          label="Evidence packs"
          value={String(detail.evidencePacks.length)}
          hint="Repo, docs, demo, and CI references captured for review."
          icon={FileText}
        />
        <GrantMetric
          label="Evaluations"
          value={String(detail.evaluations.length)}
          hint="Reviewer decisions with explicit rationale and suggested release."
          icon={ClipboardList}
        />
        <GrantMetric
          label="Open flags"
          value={countOpenFlags(detail)}
          hint="Pause or rejection decisions that still require follow-up."
          icon={Flag}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <GrantDetailSection
          eyebrow="Milestones"
          title="KPI checkpoints that drive releases"
          description="Each milestone records what success looks like, how it will be verified, and what evidence must be attached before funds move."
        >
          <div className="grid gap-4">
            {detail.milestones.length ? (
              detail.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="rounded-2xl border border-charcoal-100 bg-charcoal-50/60 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-charcoal-900">{milestone.name}</p>
                      <p className="mt-1 text-sm leading-6 text-charcoal-400">
                        {milestone.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                        getMilestoneTone(milestone.status) === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : getMilestoneTone(milestone.status) === "warning"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : getMilestoneTone(milestone.status) === "muted"
                              ? "border-charcoal-200 bg-charcoal-50 text-charcoal-500"
                              : "border-milestone-200 bg-milestone-50 text-milestone-600"
                      }`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-charcoal-100 bg-white p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Success metric
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-charcoal-700">
                        {milestone.successMetric}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-charcoal-100 bg-white p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Verification
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-charcoal-700">
                        {milestone.verificationMethod}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-charcoal-100 bg-white p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Evidence required
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-charcoal-700">
                        {milestone.evidenceRequirements}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-charcoal-100 bg-white p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Target window
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-charcoal-700">
                        {milestone.targetDate
                          ? `Target date ${milestone.targetDate}`
                          : "Target date pending"}
                        {milestone.budgetHint
                          ? ` · Budget hint ${milestone.budgetHint}`
                          : ""}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50/60 p-5 text-sm text-charcoal-400">
                No milestones yet. Add the first KPI checkpoint below.
              </div>
            )}
          </div>

          <form
            action={`/api/grants/${detail.grant.slug}/milestones`}
            method="post"
            className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-milestone-500">
              <Layers3 className="h-4 w-4" />
              Add milestone
            </div>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Name
                <input
                  name="name"
                  required
                  minLength={3}
                  placeholder="e.g. Reviewer-ready MVP on testnet"
                  className={inputClassName}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Description
                <textarea
                  name="description"
                  rows={2}
                  placeholder="What must be delivered before this window can be approved?"
                  className={textareaClassName}
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Success metric
                  <input
                    name="successMetric"
                    placeholder="e.g. CI green, demo URL live, docs published"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Verification method
                  <input
                    name="verificationMethod"
                    placeholder="e.g. reviewer checks repo, run, and walkthrough"
                    className={inputClassName}
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Evidence requirements
                <textarea
                  name="evidenceRequirements"
                  rows={2}
                  placeholder="List the links, artifacts, or proofs required for this release window."
                  className={textareaClassName}
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Target date
                  <input name="targetDate" type="date" className={inputClassName} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Budget hint (XLM)
                  <input
                    name="budgetHint"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2500"
                    className={inputClassName}
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-5 py-2.5 text-sm font-semibold text-white shadow-cta-inset transition hover:from-charcoal-900 hover:to-black"
            >
              Save milestone
            </button>
          </form>
        </GrantDetailSection>

        <GrantDetailSection
          eyebrow="Evidence"
          title="Evidence packs ready for reviewer input"
          description="Each pack stores delegated repository references, test runs, docs, and demos so the reviewer can approve a release without chasing context."
        >
          {detail.evidencePacks.length ? (
            <GrantDetailStream
              items={detail.evidencePacks.map((pack) => ({
                label: pack.windowLabel,
                detail: buildEvidenceDetail(pack),
                meta: pack.status,
                tone: getEvidenceTone(pack.status)
              }))}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50/60 p-5 text-sm text-charcoal-400">
              No evidence packs yet. Attach the first delivery window below.
            </div>
          )}

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {detail.delegatedGithubWorkflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-charcoal-100 bg-charcoal-50/60 p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-milestone-50 text-sm font-bold text-milestone-500">
                  {index + 1}
                </div>
                <p className="mt-3 font-medium text-charcoal-900">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-charcoal-400">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <form
            action={`/api/grants/${detail.grant.slug}/evidence`}
            method="post"
            className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-milestone-500">
              <FileText className="h-4 w-4" />
              Submit evidence pack
            </div>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Window label
                <input
                  name="windowLabel"
                  required
                  minLength={3}
                  placeholder="e.g. Window 02"
                  className={inputClassName}
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  GitHub repository URL
                  <input
                    name="githubRepoUrl"
                    placeholder="https://github.com/org/repo"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Branch
                  <input
                    name="githubBranch"
                    placeholder="main"
                    className={inputClassName}
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Commit hash
                  <input
                    name="githubCommitHash"
                    placeholder="abc123"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Test run URL
                  <input
                    name="testRunUrl"
                    placeholder="https://github.com/org/repo/actions/runs/123"
                    className={inputClassName}
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Docs URL
                  <input
                    name="docsUrl"
                    placeholder="https://example.com/docs"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Demo URL
                  <input
                    name="demoUrl"
                    placeholder="https://example.com/demo"
                    className={inputClassName}
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Notes
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Explain what changed in this delivery window and any reviewer context."
                  className={textareaClassName}
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-5 py-2.5 text-sm font-semibold text-white shadow-cta-inset transition hover:from-charcoal-900 hover:to-black"
            >
              Save evidence pack
            </button>
          </form>
        </GrantDetailSection>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <GrantDetailSection
          eyebrow="Evaluation"
          title="Reviewer scoring and release recommendation"
          description="The reviewer can score progress, pick a decision, and leave the rationale that will later be anchored onchain."
        >
          <div className="grid gap-4">
            {detail.evaluations.length ? (
              detail.evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-2xl border border-charcoal-100 bg-charcoal-50/60 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-charcoal-900">{evaluation.decision}</p>
                      <p className="mt-1 text-sm text-charcoal-400">
                        Evaluated {formatTimestamp(evaluation.evaluatedAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                        getEvaluationTone(evaluation.decision) === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : getEvaluationTone(evaluation.decision) === "warning"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-milestone-200 bg-milestone-50 text-milestone-600"
                      }`}
                    >
                      {evaluation.suggestedAmount}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-charcoal-100 bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Score
                      </p>
                      <p className="mt-2 text-lg font-semibold text-charcoal-900">
                        {evaluation.score}/100
                      </p>
                    </div>
                    <div className="rounded-xl border border-charcoal-100 bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Progress
                      </p>
                      <p className="mt-2 text-lg font-semibold text-charcoal-900">
                        {evaluation.progressScore}/100
                      </p>
                    </div>
                    <div className="rounded-xl border border-charcoal-100 bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Delivery
                      </p>
                      <p className="mt-2 text-lg font-semibold text-charcoal-900">
                        {evaluation.deliveryScore}/100
                      </p>
                    </div>
                    <div className="rounded-xl border border-charcoal-100 bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                        Risk
                      </p>
                      <p className="mt-2 text-lg font-semibold text-charcoal-900">
                        {evaluation.riskScore}/100
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-charcoal-500">
                    {buildEvaluationDetail(evaluation)}
                  </p>
                  {evaluation.decisionHash ? (
                    <p className="mt-2 text-xs text-charcoal-400">
                      Decision hash: {evaluation.decisionHash}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50/60 p-5 text-sm text-charcoal-400">
                No reviewer evaluations yet. Record the first decision below.
              </div>
            )}
          </div>

          <form
            action={`/api/grants/${detail.grant.slug}/evaluations`}
            method="post"
            className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-milestone-500">
              <ClipboardList className="h-4 w-4" />
              Record evaluation
            </div>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Evidence pack
                <select name="evidencePackId" defaultValue="" className={selectClassName}>
                  <option value="">No linked evidence pack</option>
                  {detail.evidencePacks.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.windowLabel}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Score
                  <input
                    name="score"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Progress
                  <input
                    name="progressScore"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Delivery
                  <input
                    name="deliveryScore"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Risk
                  <input
                    name="riskScore"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="20"
                    className={inputClassName}
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Suggested amount (XLM)
                  <input
                    name="suggestedAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1800"
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                  Decision
                  <select name="decision" defaultValue="approve" className={selectClassName}>
                    <option value="approve">Approve</option>
                    <option value="adjust">Adjust</option>
                    <option value="pause">Pause</option>
                    <option value="reject">Reject</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Reviewer note
                <textarea
                  name="reviewerNote"
                  rows={3}
                  placeholder="Why does this release deserve approval, adjustment, or a pause?"
                  className={textareaClassName}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-charcoal-600">
                Override reason
                <textarea
                  name="overrideReason"
                  rows={2}
                  placeholder="Explain any deviation from the suggested amount or why the grant is paused."
                  className={textareaClassName}
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-5 py-2.5 text-sm font-semibold text-white shadow-cta-inset transition hover:from-charcoal-900 hover:to-black"
            >
              Save evaluation
            </button>
          </form>
        </GrantDetailSection>

        <div className="grid gap-6">
          <GrantDetailSection
            eyebrow="Next action"
            title="What moves this grant forward"
            description="Milestone keeps the next operational step explicit so the sponsor, reviewer, and beneficiary are aligned on the same state."
          >
            <div className="grid gap-4">
              <div className="rounded-2xl border border-charcoal-100 bg-gradient-to-br from-white to-milestone-50/70 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 text-milestone-500" />
                  <div>
                    <p className="font-medium text-charcoal-900">{buildNextAction(detail)}</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal-400">
                      Release cap per window: {detail.grant.capPerWindow}. Released so far:{" "}
                      {detail.grant.releasedAmount}.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-milestone-500" />
                  <div>
                    <p className="font-medium text-charcoal-900">Contract readiness</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal-400">
                      {buildContractState(detail)}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-charcoal-100 bg-charcoal-50/60 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                          Contract address
                        </p>
                        <p className="mt-2 break-all text-sm text-charcoal-700">
                          {detail.grant.contractAddress ?? "Pending deploy"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-charcoal-100 bg-charcoal-50/60 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                          Contract grant ID
                        </p>
                        <p className="mt-2 break-all text-sm text-charcoal-700">
                          {detail.grant.contractGrantId ?? "Pending sync"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GrantDetailSection>

          <GrantDetailSection
            eyebrow="Timeline"
            title="Auditable lifecycle"
            description="Every material event is visible here before it is later mirrored to the public transparency view."
          >
            <GrantDetailStream
              items={detail.timeline.map((item) => ({
                label: item.label,
                detail: item.detail,
                meta: item.createdAt ? formatTimestamp(item.createdAt) : "Recorded",
                tone: "default"
              }))}
            />
          </GrantDetailSection>
        </div>
      </div>
    </SiteShell>
  );
}
