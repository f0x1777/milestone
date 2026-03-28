import { createHash, randomUUID } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import { join } from "path";
import {
  auditTrail as fallbackAuditTrail,
  delegatedGithubWorkflow,
  grantDetails as fallbackGrantDetails,
  grants as fallbackGrants,
  milestones as fallbackMilestones
} from "@/lib/mock-data";
import {
  createServerSupabaseClient,
  hasPublicSupabaseConfig,
  hasServiceRoleSupabaseConfig
} from "@/lib/supabase";

type JsonRecord = Record<string, unknown>;

type GrantRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  sponsor_org_id: string | null;
  reviewer_user_id: string | null;
  beneficiary_user_id: string | null;
  asset_code: string;
  total_amount: number | string;
  cap_per_window: number | string;
  released_amount: number | string;
  status: string;
  visibility: string;
  contract_address: string | null;
  contract_grant_id: string | null;
  created_at: string;
};

type PublicGrantRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  asset_code: string;
  total_amount: number | string;
  cap_per_window: number | string;
  released_amount: number | string;
  status: string;
  visibility: string;
  contract_address: string | null;
  contract_grant_id: string | null;
  sponsor_name: string | null;
  sponsor_slug: string | null;
  beneficiary_name: string | null;
  reviewer_name: string | null;
  created_at: string;
};

type UserRow = {
  id: string;
  display_name: string;
};

type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
};

type MilestoneRow = {
  id: string;
  grant_id: string;
  order_index: number;
  name: string;
  description: string | null;
  target_date?: string | null;
  budget_hint?: number | string | null;
  success_metric?: string | null;
  verification_method?: string | null;
  evidence_requirements?: string | null;
  status: string;
  created_at?: string;
};

type EvidencePackRow = {
  id: string;
  grant_id: string;
  window_label: string;
  github_repo_url: string | null;
  github_branch: string | null;
  github_commit_hash: string | null;
  docs_url: string | null;
  demo_url: string | null;
  test_run_url: string | null;
  notes: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
};

type EvaluationRow = {
  id: string;
  grant_id: string;
  evidence_pack_id: string | null;
  score: number | string;
  progress_score: number | string;
  delivery_score: number | string;
  risk_score: number | string;
  suggested_amount: number | string;
  decision: string;
  reviewer_note: string | null;
  override_reason: string | null;
  decision_hash: string | null;
  evaluated_at: string;
};

type AuditEventRow = {
  grant_id: string | null;
  event_type: string;
  payload: JsonRecord | null;
  created_at: string;
};

type CreateGrantPayload = {
  title: string;
  summary?: string;
  totalAmount: string;
  capPerWindow: string;
  reviewerName?: string;
  beneficiaryName?: string;
  visibility?: string;
  firstMilestoneName?: string;
  firstMilestoneDescription?: string;
  firstMilestoneSuccessMetric?: string;
  firstMilestoneVerificationMethod?: string;
  firstMilestoneEvidenceRequirements?: string;
  firstMilestoneTargetDate?: string;
  firstMilestoneBudgetHint?: string;
};

export type GrantCard = {
  id: string;
  slug: string;
  title: string;
  beneficiary: string;
  sponsor: string;
  reviewer: string;
  amount: string;
  release: string;
  note: string;
  status: string;
  statusKey: string;
  visibility: string;
};

export type AuditItem = {
  label: string;
  detail: string;
  createdAt?: string;
};

export type MilestoneItem = {
  name: string;
  status: string;
  summary: string;
};

export type DashboardSnapshot = {
  grants: GrantCard[];
  auditTrail: AuditItem[];
  delegatedGithubWorkflow: typeof delegatedGithubWorkflow;
  stats: {
    activeGrants: string;
    escrowed: string;
    released: string;
    openFlags: string;
  };
  source: "mock" | "supabase";
  sourceLabel: string;
};

export type TransparencySnapshot = {
  grants: GrantCard[];
  milestones: MilestoneItem[];
  auditTrail: AuditItem[];
  delegatedGithubWorkflow: typeof delegatedGithubWorkflow;
  source: "mock" | "supabase";
  sourceLabel: string;
};

export type GrantDetailHeader = GrantCard & {
  summary: string;
  capPerWindow: string;
  releasedAmount: string;
  contractAddress: string | null;
  contractGrantId: string | null;
};

export type GrantMilestone = {
  id: string;
  orderIndex: number;
  name: string;
  description: string;
  status: string;
  targetDate: string | null;
  budgetHint: string | null;
  successMetric: string;
  verificationMethod: string;
  evidenceRequirements: string;
};

export type GrantEvidencePack = {
  id: string;
  windowLabel: string;
  status: string;
  githubRepoUrl: string;
  githubBranch: string;
  githubCommitHash: string;
  docsUrl: string;
  demoUrl: string;
  testRunUrl: string;
  notes: string;
  submittedAt: string | null;
};

export type GrantEvaluation = {
  id: string;
  evidencePackId: string | null;
  score: number;
  progressScore: number;
  deliveryScore: number;
  riskScore: number;
  suggestedAmount: string;
  decision: string;
  reviewerNote: string;
  overrideReason: string;
  decisionHash: string;
  evaluatedAt: string;
};

export type GrantDetailSnapshot = {
  grant: GrantDetailHeader;
  milestones: GrantMilestone[];
  evidencePacks: GrantEvidencePack[];
  evaluations: GrantEvaluation[];
  timeline: AuditItem[];
  delegatedGithubWorkflow: typeof delegatedGithubWorkflow;
  source: "mock" | "supabase";
  sourceLabel: string;
};

export type GrantDetailResult =
  | {
      ok: true;
      snapshot: GrantDetailSnapshot;
    }
  | {
      ok: false;
      error: string;
      status?: number;
    };

export type CreateGrantResult =
  | {
      ok: true;
      grant: {
        id: string;
        slug: string;
      };
      source: "mock" | "supabase";
    }
  | {
      ok: false;
      error: string;
    };

type CreateMilestonePayload = {
  name: string;
  description?: string;
  targetDate?: string;
  budgetHint?: string;
  successMetric?: string;
  verificationMethod?: string;
  evidenceRequirements?: string;
};

type CreateEvidencePayload = {
  windowLabel: string;
  githubRepoUrl?: string;
  githubBranch?: string;
  githubCommitHash?: string;
  docsUrl?: string;
  demoUrl?: string;
  testRunUrl?: string;
  notes?: string;
};

type CreateEvaluationPayload = {
  evidencePackId?: string;
  score?: string;
  progressScore?: string;
  deliveryScore?: string;
  riskScore?: string;
  suggestedAmount?: string;
  decision?: string;
  reviewerNote?: string;
  overrideReason?: string;
};

type ValidatedGrantPayload = {
  title: string;
  summary: string;
  totalAmount: number;
  capPerWindow: number;
  reviewerName: string;
  beneficiaryName: string;
  visibility: "private" | "public";
  firstMilestoneName: string;
  firstMilestoneDescription: string;
  firstMilestoneSuccessMetric: string;
  firstMilestoneVerificationMethod: string;
  firstMilestoneEvidenceRequirements: string;
  firstMilestoneTargetDate: string | null;
  firstMilestoneBudgetHint: string;
};

type ValidatedMilestonePayload = {
  name: string;
  description: string;
  targetDate: string | null;
  budgetHint: string;
  successMetric: string;
  verificationMethod: string;
  evidenceRequirements: string;
};

type ValidatedEvidencePayload = {
  windowLabel: string;
  githubRepoUrl: string;
  githubBranch: string;
  githubCommitHash: string;
  docsUrl: string;
  demoUrl: string;
  testRunUrl: string;
  notes: string;
};

type ValidatedEvaluationPayload = {
  evidencePackId: string | null;
  score: number;
  progressScore: number;
  deliveryScore: number;
  riskScore: number;
  suggestedAmount: number;
  decision: string;
  reviewerNote: string;
  overrideReason: string;
};

type MutationResult =
  | {
      ok: true;
      id: string;
    }
  | {
      ok: false;
      error: string;
    };

export type CreateMilestoneResult =
  | {
      ok: true;
      milestone: {
        id: string;
      };
      source: "supabase";
    }
  | {
      ok: false;
      error: string;
    };

export type CreateEvidencePackResult =
  | {
      ok: true;
      evidencePack: {
        id: string;
      };
      source: "supabase";
    }
  | {
      ok: false;
      error: string;
    };

type RuntimeGrantRecord = {
  snapshot: GrantDetailSnapshot;
  totalAmount: number;
  releasedAmount: number;
  createdAt: string;
};

const fallbackDashboardBase = {
  activeGrants: 2,
  escrowed: 19300,
  released: 3500,
  openFlags: 1
};

const runtimeGrantStoreFile = join(process.cwd(), ".milestone-demo", "runtime-grants.json");

function parseNumericValue(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function slugifyGrantTitle(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "grant";
}

function formatAssetAmount(value: number, assetCode: string) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value)} ${assetCode}`;
}

export function formatReleaseLabel(releasedAmount: number, totalAmount: number) {
  if (totalAmount <= 0) {
    return "No releases yet";
  }

  const releasedPercentage = Math.round((releasedAmount / totalAmount) * 100);
  return releasedAmount > 0 ? `${releasedPercentage}% released` : "No releases yet";
}

export function humanizeGrantStatus(status: string) {
  const labels: Record<string, string> = {
    active: "Live",
    cancelled: "Cancelled",
    completed: "Completed",
    draft: "Draft",
    funding: "Funding",
    paused: "Paused"
  };

  return labels[status] ?? status.replace(/_/g, " ");
}

function humanizeMilestoneStatus(status: string) {
  return status.replace(/_/g, " ");
}

function humanizeEvidenceStatus(status: string) {
  return status.replace(/_/g, " ");
}

function humanizeEvaluationDecision(decision: string) {
  return decision.replace(/_/g, " ");
}

function formatOptionalAmount(value: number | string | null | undefined, assetCode: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return formatAssetAmount(parseNumericValue(value), assetCode);
}

function buildUniqueHash(scope: string, values: Record<string, unknown>) {
  return createHash("sha256")
    .update(`${scope}:${randomUUID()}:${JSON.stringify(values)}`)
    .digest("hex");
}

function buildGrantNote(summary: string | null, contractAddress: string | null) {
  if (summary) {
    return summary;
  }

  if (contractAddress) {
    return `Contract-linked grant at ${contractAddress}.`;
  }

  return "Grant ready for funding, evidence, and reviewer actions.";
}

function cloneRuntimeGrantRecord(record: RuntimeGrantRecord) {
  return structuredClone(record);
}

function readRuntimeGrantStore() {
  if (!existsSync(runtimeGrantStoreFile)) {
    return [] as RuntimeGrantRecord[];
  }

  try {
    const raw = readFileSync(runtimeGrantStoreFile, "utf8");
    const parsed = JSON.parse(raw) as RuntimeGrantRecord[];
    return Array.isArray(parsed) ? parsed.map(cloneRuntimeGrantRecord) : [];
  } catch {
    return [] as RuntimeGrantRecord[];
  }
}

function writeRuntimeGrantStore(records: RuntimeGrantRecord[]) {
  mkdirSync(join(process.cwd(), ".milestone-demo"), { recursive: true });
  writeFileSync(
    runtimeGrantStoreFile,
    JSON.stringify(records.map(cloneRuntimeGrantRecord), null, 2),
    "utf8"
  );
}

function getRuntimeGrantRecords() {
  return readRuntimeGrantStore()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function getRuntimeGrantRecord(slug: string) {
  const record = readRuntimeGrantStore().find(
    (entry) => entry.snapshot.grant.slug === slug
  );
  return record ? cloneRuntimeGrantRecord(record) : null;
}

function setRuntimeGrantRecord(record: RuntimeGrantRecord) {
  const records = readRuntimeGrantStore();
  const next = records.filter(
    (entry) => entry.snapshot.grant.slug !== record.snapshot.grant.slug
  );
  next.push(cloneRuntimeGrantRecord(record));
  writeRuntimeGrantStore(next);
}

function buildGrantCardFromRuntimeRecord(record: RuntimeGrantRecord): GrantCard {
  const grant = record.snapshot.grant;

  return {
    id: grant.id,
    slug: grant.slug,
    title: grant.title,
    beneficiary: grant.beneficiary,
    sponsor: grant.sponsor,
    reviewer: grant.reviewer,
    amount: grant.amount,
    release: grant.release,
    note: buildGrantNote(grant.summary, grant.contractAddress),
    status: grant.status,
    statusKey: grant.statusKey,
    visibility: grant.visibility
  };
}

function countRuntimeFlags(record: RuntimeGrantRecord) {
  let flags = record.snapshot.grant.statusKey === "paused" ? 1 : 0;

  if (
    record.snapshot.evaluations.some((evaluation) => {
      const decision = evaluation.decision.toLowerCase();
      return decision.includes("pause") || decision.includes("reject");
    })
  ) {
    flags += 1;
  }

  return flags;
}

function buildRuntimeAuditTrail(limit = 6) {
  return getRuntimeGrantRecords()
    .flatMap((record) => record.snapshot.timeline)
    .sort((left, right) =>
      (right.createdAt ?? "").localeCompare(left.createdAt ?? "")
    )
    .slice(0, limit)
    .map((item) => ({ ...item }));
}

function buildRuntimeMilestones(limit = 6) {
  return getRuntimeGrantRecords()
    .flatMap((record) => record.snapshot.milestones)
    .sort((left, right) => right.orderIndex - left.orderIndex)
    .slice(0, limit)
    .map((milestone) => ({
      name: milestone.name,
      status: milestone.status,
      summary: milestone.successMetric
    }));
}

function mapMilestone(row: MilestoneRow): GrantMilestone {
  return {
    id: row.id,
    orderIndex: row.order_index,
    name: row.name,
    description: row.description ?? "Milestone description pending.",
    status: humanizeMilestoneStatus(row.status),
    targetDate: row.target_date ?? null,
    budgetHint: formatOptionalAmount(row.budget_hint ?? null, "XLM"),
    successMetric: row.success_metric ?? "Success metric pending.",
    verificationMethod:
      row.verification_method ?? "Verification method will be defined by the reviewer.",
    evidenceRequirements:
      row.evidence_requirements ?? "Evidence requirements will be attached to this window."
  };
}

function mapEvidencePack(row: EvidencePackRow): GrantEvidencePack {
  return {
    id: row.id,
    windowLabel: row.window_label,
    status: humanizeEvidenceStatus(row.status),
    githubRepoUrl: row.github_repo_url ?? "",
    githubBranch: row.github_branch ?? "",
    githubCommitHash: row.github_commit_hash ?? "",
    docsUrl: row.docs_url ?? "",
    demoUrl: row.demo_url ?? "",
    testRunUrl: row.test_run_url ?? "",
    notes: row.notes ?? "",
    submittedAt: row.submitted_at ?? row.created_at
  };
}

function mapEvaluation(row: EvaluationRow): GrantEvaluation {
  return {
    id: row.id,
    evidencePackId: row.evidence_pack_id,
    score: parseNumericValue(row.score),
    progressScore: parseNumericValue(row.progress_score),
    deliveryScore: parseNumericValue(row.delivery_score),
    riskScore: parseNumericValue(row.risk_score),
    suggestedAmount: formatAssetAmount(parseNumericValue(row.suggested_amount), "XLM"),
    decision: humanizeEvaluationDecision(row.decision),
    reviewerNote: row.reviewer_note ?? "",
    overrideReason: row.override_reason ?? "",
    decisionHash: row.decision_hash ?? "",
    evaluatedAt: row.evaluated_at
  };
}

function mapAuditEventLabel(eventType: string) {
  const labels: Record<string, string> = {
    beneficiary_assigned: "Beneficiary assigned",
    evaluation_recorded: "Evaluation recorded",
    evidence_submitted: "Evidence submitted",
    grant_created: "Grant created",
    grant_funded: "Funds deposited",
    grant_paused: "Grant paused",
    grant_reclaimed: "Unused funds reclaimed",
    grant_resumed: "Grant resumed",
    milestone_added: "Milestone added",
    release_submitted: "Release submitted"
  };

  return labels[eventType] ?? eventType.replace(/_/g, " ");
}

function mapAuditEventDetail(row: AuditEventRow) {
  const payload = row.payload ?? {};

  switch (row.event_type) {
    case "grant_created":
      return String(payload.summary ?? payload.title ?? "Sponsor created the grant terms.");
    case "grant_funded":
      return "Funds were committed to the Stellar-based grant flow.";
    case "evidence_submitted":
      return "Evidence links and supporting files were attached for review.";
    case "evaluation_recorded":
      return "Reviewer decision and rationale were recorded for traceability.";
    case "release_submitted":
      return "A partial release moved into execution or confirmation.";
    case "grant_paused":
      return String(payload.reason ?? "Reviewer halted future releases due to risk.");
    case "grant_resumed":
      return "Grant flow resumed after the pause condition was resolved.";
    case "grant_reclaimed":
      return "Unused balance returned to the sponsor at the end of the grant.";
    default:
      return "Audit event captured in the Milestone timeline.";
  }
}

function mapGrantCard(
  row: GrantRow | PublicGrantRow,
  related: {
    beneficiaryName?: string | null;
    reviewerName?: string | null;
    sponsorName?: string | null;
  } = {}
): GrantCard {
  const totalAmount = parseNumericValue(row.total_amount);
  const releasedAmount = parseNumericValue(row.released_amount);
  const beneficiary =
    related.beneficiaryName ??
    ("beneficiary_name" in row ? row.beneficiary_name : null) ??
    "Beneficiary pending";
  const reviewer =
    related.reviewerName ??
    ("reviewer_name" in row ? row.reviewer_name : null) ??
    "Reviewer pending";
  const sponsor =
    related.sponsorName ??
    ("sponsor_name" in row ? row.sponsor_name : null) ??
    "Sponsor pending";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    beneficiary,
    sponsor,
    reviewer,
    amount: formatAssetAmount(totalAmount, row.asset_code),
    release: formatReleaseLabel(releasedAmount, totalAmount),
    note: buildGrantNote(row.summary, row.contract_address),
    status: humanizeGrantStatus(row.status),
    statusKey: row.status,
    visibility: row.visibility
  };
}

function getFallbackDashboardSnapshot(): DashboardSnapshot {
  const runtimeRecords = getRuntimeGrantRecords();
  const fallbackGrantCards = fallbackGrants.map((grant, index) => ({
    id: `mock-grant-${index + 1}`,
    slug: slugifyGrantTitle(grant.title),
    title: grant.title,
    beneficiary: grant.beneficiary,
    sponsor: "Milestone Foundation",
    reviewer: "Testnet Reviewer",
    amount: grant.amount,
    release: grant.release,
    note: grant.note,
    status: grant.status,
    statusKey: grant.status.toLowerCase().replace(/\s+/g, "_"),
    visibility: "public"
  }));
  const runtimeEscrowed = runtimeRecords.reduce(
    (sum, record) => sum + record.totalAmount,
    0
  );
  const runtimeReleased = runtimeRecords.reduce(
    (sum, record) => sum + record.releasedAmount,
    0
  );
  const runtimeActiveGrants = runtimeRecords.filter((record) =>
    ["active", "funding", "paused"].includes(record.snapshot.grant.statusKey)
  ).length;
  const runtimeFlags = runtimeRecords.reduce(
    (sum, record) => sum + countRuntimeFlags(record),
    0
  );

  return {
    grants: [
      ...runtimeRecords.map(buildGrantCardFromRuntimeRecord),
      ...fallbackGrantCards
    ],
    auditTrail: [
      ...buildRuntimeAuditTrail(),
      ...fallbackAuditTrail.map((item) => ({ ...item }))
    ].slice(0, 6),
    delegatedGithubWorkflow,
    stats: {
      activeGrants: String(fallbackDashboardBase.activeGrants + runtimeActiveGrants),
      escrowed: formatAssetAmount(
        fallbackDashboardBase.escrowed + runtimeEscrowed,
        "XLM"
      ),
      released: formatReleaseLabel(
        fallbackDashboardBase.released + runtimeReleased,
        fallbackDashboardBase.escrowed + runtimeEscrowed
      ),
      openFlags: String(fallbackDashboardBase.openFlags + runtimeFlags)
    },
    source: "mock",
    sourceLabel: runtimeRecords.length
      ? "Session demo data (Supabase write unavailable)"
      : hasPublicSupabaseConfig()
        ? "Fallback data (Supabase query failed)"
        : "Fallback data (Supabase not configured)"
  };
}

function getFallbackTransparencySnapshot(): TransparencySnapshot {
  const runtimeRecords = getRuntimeGrantRecords();

  return {
    grants: getFallbackDashboardSnapshot().grants,
    milestones: [
      ...buildRuntimeMilestones(),
      ...fallbackMilestones.map((item) => ({
        name: item.name,
        status: item.status,
        summary: item.summary
      }))
    ].slice(0, 6),
    auditTrail: [
      ...buildRuntimeAuditTrail(),
      ...fallbackAuditTrail.map((item) => ({ ...item }))
    ].slice(0, 6),
    delegatedGithubWorkflow,
    source: "mock",
    sourceLabel: runtimeRecords.length
      ? "Session demo data (Supabase write unavailable)"
      : hasPublicSupabaseConfig()
        ? "Fallback data (Supabase query failed)"
        : "Fallback data (Supabase not configured)"
  };
}

function getFallbackGrantDetailSnapshot(slug: string): GrantDetailSnapshot | null {
  const runtimeRecord = getRuntimeGrantRecord(slug);

  if (runtimeRecord) {
    return runtimeRecord.snapshot;
  }

  const grantCard = getFallbackDashboardSnapshot().grants.find((grant) => grant.slug === slug);
  const detail = fallbackGrantDetails[slug as keyof typeof fallbackGrantDetails];

  if (!grantCard || !detail) {
    return null;
  }

  return {
    grant: {
      ...grantCard,
      summary: detail.summary,
      capPerWindow: detail.capPerWindow,
      releasedAmount: detail.releasedAmount,
      contractAddress: null,
      contractGrantId: null
    },
    milestones: detail.milestones.map((milestone, index) => ({
      id: milestone.id,
      orderIndex: index,
      name: milestone.name,
      description: milestone.description,
      status: humanizeMilestoneStatus(milestone.status),
      targetDate: null,
      budgetHint: null,
      successMetric: milestone.successMetric,
      verificationMethod: milestone.verificationMethod,
      evidenceRequirements: milestone.evidenceRequirements
    })),
    evidencePacks: detail.evidencePacks.map((evidence) => ({
      id: evidence.id,
      windowLabel: evidence.windowLabel,
      status: humanizeEvidenceStatus(evidence.status),
      githubRepoUrl: evidence.githubRepoUrl,
      githubBranch: "",
      githubCommitHash: "",
      docsUrl: evidence.docsUrl,
      demoUrl: evidence.demoUrl,
      testRunUrl: evidence.testRunUrl,
      notes: evidence.notes,
      submittedAt: evidence.submittedAt
    })),
    evaluations: detail.evaluations.map((evaluation) => ({
      id: evaluation.id,
      evidencePackId: null,
      score: evaluation.score,
      progressScore: evaluation.progressScore,
      deliveryScore: evaluation.deliveryScore,
      riskScore: evaluation.riskScore,
      suggestedAmount: evaluation.suggestedAmount,
      decision: humanizeEvaluationDecision(evaluation.decision),
      reviewerNote: evaluation.reviewerNote,
      overrideReason: evaluation.overrideReason ?? "",
      decisionHash: "",
      evaluatedAt: evaluation.evaluatedAt
    })),
    timeline: detail.timeline.map((item) => ({ ...item })),
    delegatedGithubWorkflow,
    source: "mock",
    sourceLabel: hasPublicSupabaseConfig()
      ? "Fallback detail (Supabase query failed)"
      : "Fallback detail (Supabase not configured)"
  };
}

function createRuntimeGrantResult(value: ValidatedGrantPayload): CreateGrantResult {
  const createdAt = new Date().toISOString();
  const baseSlug = slugifyGrantTitle(value.title);
  let slug = baseSlug;
  let counter = 1;

  while (
    getRuntimeGrantRecords().some((record) => record.snapshot.grant.slug === slug) ||
    Boolean(fallbackGrantDetails[slug as keyof typeof fallbackGrantDetails])
  ) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  const grantId = `runtime-${randomUUID()}`;
  const milestoneId = `runtime-milestone-${randomUUID()}`;
  const reviewer = value.reviewerName || "Reviewer pending";
  const beneficiary = value.beneficiaryName || "Beneficiary pending";
  const snapshot: GrantDetailSnapshot = {
    grant: {
      id: grantId,
      slug,
      title: value.title,
      beneficiary,
      sponsor: "Milestone Sponsor Desk",
      reviewer,
      amount: formatAssetAmount(value.totalAmount, "XLM"),
      release: formatReleaseLabel(0, value.totalAmount),
      note: buildGrantNote(value.summary, null),
      status: humanizeGrantStatus("funding"),
      statusKey: "funding",
      visibility: value.visibility,
      summary: value.summary || "Grant summary pending.",
      capPerWindow: formatAssetAmount(value.capPerWindow, "XLM"),
      releasedAmount: formatAssetAmount(0, "XLM"),
      contractAddress: null,
      contractGrantId: null
    },
    milestones: [
      {
        id: milestoneId,
        orderIndex: 0,
        name: value.firstMilestoneName || "Initial review window",
        description:
          value.firstMilestoneDescription ||
          "First evidence and reviewer checkpoint for the grant.",
        status: humanizeMilestoneStatus("planned"),
        targetDate: value.firstMilestoneTargetDate,
        budgetHint: value.firstMilestoneBudgetHint
          ? formatAssetAmount(Number(value.firstMilestoneBudgetHint), "XLM")
          : null,
        successMetric:
          value.firstMilestoneSuccessMetric ||
          "Initial KPI defined and first evidence pack submitted.",
        verificationMethod:
          value.firstMilestoneVerificationMethod ||
          "Reviewer checks links, docs, and submitted artifacts.",
        evidenceRequirements:
          value.firstMilestoneEvidenceRequirements ||
          "At least one repository, docs, demo, or test run reference is attached."
      }
    ],
    evidencePacks: [],
    evaluations: [],
    timeline: [
      {
        label: "Grant created",
        detail:
          value.summary || "Sponsor created the grant terms for review.",
        createdAt
      },
      {
        label: "Milestone added",
        detail:
          value.firstMilestoneName || "Initial KPI window recorded for the grant.",
        createdAt
      }
    ],
    delegatedGithubWorkflow,
    source: "mock",
    sourceLabel: "Session demo data (Supabase write unavailable)"
  };

  setRuntimeGrantRecord({
    snapshot,
    totalAmount: value.totalAmount,
    releasedAmount: 0,
    createdAt
  });

  return {
    ok: true,
    grant: {
      id: grantId,
      slug
    },
    source: "mock"
  };
}

function createRuntimeMilestoneForGrant(
  slug: string,
  value: ValidatedMilestonePayload
): MutationResult {
  const record = getRuntimeGrantRecord(slug);

  if (!record) {
    return { ok: false, error: "Grant not found." };
  }

  const milestoneId = `runtime-milestone-${randomUUID()}`;
  const createdAt = new Date().toISOString();

  record.snapshot.milestones.push({
    id: milestoneId,
    orderIndex: record.snapshot.milestones.length,
    name: value.name,
    description: value.description || "Milestone description pending.",
    status: humanizeMilestoneStatus("planned"),
    targetDate: value.targetDate,
    budgetHint: value.budgetHint ? formatAssetAmount(Number(value.budgetHint), "XLM") : null,
    successMetric: value.successMetric || "Success metric pending.",
    verificationMethod:
      value.verificationMethod || "Verification method will be defined by the reviewer.",
    evidenceRequirements:
      value.evidenceRequirements || "Evidence requirements will be attached to this window."
  });
  record.snapshot.timeline.unshift({
    label: "Milestone added",
    detail: value.name,
    createdAt
  });

  setRuntimeGrantRecord({
    ...record,
    createdAt
  });

  return { ok: true, id: milestoneId };
}

function createRuntimeEvidenceForGrant(
  slug: string,
  value: ValidatedEvidencePayload
): MutationResult {
  const record = getRuntimeGrantRecord(slug);

  if (!record) {
    return { ok: false, error: "Grant not found." };
  }

  const evidenceId = `runtime-evidence-${randomUUID()}`;
  const createdAt = new Date().toISOString();

  record.snapshot.evidencePacks.unshift({
    id: evidenceId,
    windowLabel: value.windowLabel,
    status: humanizeEvidenceStatus("submitted"),
    githubRepoUrl: value.githubRepoUrl,
    githubBranch: value.githubBranch,
    githubCommitHash: value.githubCommitHash,
    docsUrl: value.docsUrl,
    demoUrl: value.demoUrl,
    testRunUrl: value.testRunUrl,
    notes: value.notes,
    submittedAt: createdAt
  });
  record.snapshot.timeline.unshift({
    label: "Evidence submitted",
    detail: value.windowLabel,
    createdAt
  });

  setRuntimeGrantRecord({
    ...record,
    createdAt
  });

  return { ok: true, id: evidenceId };
}

function createRuntimeEvaluationForGrant(
  slug: string,
  value: ValidatedEvaluationPayload
): MutationResult {
  const record = getRuntimeGrantRecord(slug);

  if (!record) {
    return { ok: false, error: "Grant not found." };
  }

  const evaluationId = `runtime-evaluation-${randomUUID()}`;
  const createdAt = new Date().toISOString();
  const decision = humanizeEvaluationDecision(value.decision);

  record.snapshot.evaluations.unshift({
    id: evaluationId,
    evidencePackId: value.evidencePackId,
    score: value.score,
    progressScore: value.progressScore,
    deliveryScore: value.deliveryScore,
    riskScore: value.riskScore,
    suggestedAmount: formatAssetAmount(value.suggestedAmount, "XLM"),
    decision,
    reviewerNote: value.reviewerNote,
    overrideReason: value.overrideReason,
    decisionHash: buildUniqueHash("runtime_evaluation", {
      slug,
      decision: value.decision,
      suggestedAmount: value.suggestedAmount
    }),
    evaluatedAt: createdAt
  });

  if (value.evidencePackId) {
    record.snapshot.evidencePacks = record.snapshot.evidencePacks.map((pack) =>
      pack.id === value.evidencePackId
        ? {
            ...pack,
            status:
              value.decision === "approve"
                ? humanizeEvidenceStatus("accepted")
                : value.decision === "reject"
                  ? humanizeEvidenceStatus("rejected")
                  : humanizeEvidenceStatus("under_review")
          }
        : pack
    );
  }

  if (value.decision === "pause") {
    record.snapshot.grant.status = humanizeGrantStatus("paused");
    record.snapshot.grant.statusKey = "paused";
    record.snapshot.timeline.unshift({
      label: "Grant paused",
      detail:
        value.overrideReason ||
        value.reviewerNote ||
        "Reviewer paused the grant pending stronger evidence.",
      createdAt
    });
  } else {
    record.snapshot.grant.status = humanizeGrantStatus("active");
    record.snapshot.grant.statusKey = "active";
    record.snapshot.timeline.unshift({
      label: "Evaluation recorded",
      detail: decision,
      createdAt
    });
  }

  setRuntimeGrantRecord({
    ...record,
    createdAt
  });

  return { ok: true, id: evaluationId };
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getFallbackDashboardSnapshot();
  }

  const [{ data: grantRows, error: grantsError }, { count: openFlagsCount, error: flagsError }] =
    await Promise.all([
      supabase
        .from("grants")
        .select(
          "id, slug, title, summary, sponsor_org_id, reviewer_user_id, beneficiary_user_id, asset_code, total_amount, cap_per_window, released_amount, status, visibility, contract_address, contract_grant_id, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("pause_events")
        .select("id", { count: "exact", head: true })
        .eq("state", "paused")
    ]);

  if (grantsError || flagsError) {
    return getFallbackDashboardSnapshot();
  }

  const grants = (grantRows ?? []) as GrantRow[];
  const grantIds = grants.map((grant) => grant.id);
  const { data: auditRows, error: auditError } = grantIds.length
    ? await supabase
        .from("grant_latest_activity")
        .select("grant_id, event_type, payload, created_at")
        .in("grant_id", grantIds)
        .order("created_at", { ascending: false })
        .limit(6)
    : { data: [], error: null };

  if (auditError) {
    return getFallbackDashboardSnapshot();
  }

  const auditTrail = ((auditRows ?? []) as AuditEventRow[]).map((row) => ({
    label: mapAuditEventLabel(row.event_type),
    detail: mapAuditEventDetail(row),
    createdAt: row.created_at
  }));

  const sponsorOrgIds = Array.from(
    new Set(grants.map((grant) => grant.sponsor_org_id).filter((value): value is string => Boolean(value)))
  );
  const userIds = Array.from(
    new Set(
      grants
        .flatMap((grant) => [grant.beneficiary_user_id, grant.reviewer_user_id])
        .filter((value): value is string => Boolean(value))
    )
  );

  const [{ data: organizationRows, error: organizationsError }, { data: userRows, error: usersError }] =
    await Promise.all([
      sponsorOrgIds.length
        ? supabase.from("organizations").select("id, name, slug").in("id", sponsorOrgIds)
        : Promise.resolve({ data: [], error: null }),
      userIds.length
        ? supabase.from("users").select("id, display_name").in("id", userIds)
        : Promise.resolve({ data: [], error: null })
    ]);

  if (organizationsError || usersError) {
    return getFallbackDashboardSnapshot();
  }

  const organizationMap = new Map(
    ((organizationRows ?? []) as OrganizationRow[]).map((organization) => [
      organization.id,
      organization.name
    ])
  );
  const userMap = new Map(
    ((userRows ?? []) as UserRow[]).map((user) => [user.id, user.display_name])
  );

  const grantCards = grants.map((grant) =>
    mapGrantCard(grant, {
      beneficiaryName: grant.beneficiary_user_id
        ? userMap.get(grant.beneficiary_user_id) ?? "Beneficiary pending"
        : "Beneficiary pending",
      reviewerName: grant.reviewer_user_id
        ? userMap.get(grant.reviewer_user_id) ?? "Reviewer pending"
        : "Reviewer pending",
      sponsorName: grant.sponsor_org_id
        ? organizationMap.get(grant.sponsor_org_id) ?? "Sponsor pending"
        : "Sponsor pending"
    })
  );

  const totalEscrowed = grants.reduce(
    (sum, grant) => sum + parseNumericValue(grant.total_amount),
    0
  );
  const totalReleased = grants.reduce(
    (sum, grant) => sum + parseNumericValue(grant.released_amount),
    0
  );
  const activeGrants = grants.filter((grant) =>
    ["active", "funding", "paused"].includes(grant.status)
  ).length;

  return {
    grants: grantCards,
    auditTrail:
      auditTrail.length > 0
        ? auditTrail
        : fallbackAuditTrail.map((item) => ({ ...item })),
    delegatedGithubWorkflow,
    stats: {
      activeGrants: String(activeGrants),
      escrowed: formatAssetAmount(totalEscrowed, "XLM"),
      released:
        totalEscrowed > 0
          ? `${Math.round((totalReleased / totalEscrowed) * 100)}% released`
          : "0% released",
      openFlags: String(openFlagsCount ?? 0)
    },
    source: "supabase",
    sourceLabel: "Supabase live data"
  };
}

export async function getTransparencySnapshot(): Promise<TransparencySnapshot> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return getFallbackTransparencySnapshot();
  }

  const { data: grantRows, error: grantsError } = await supabase
    .from("public_grants")
    .select(
      "id, slug, title, summary, asset_code, total_amount, cap_per_window, released_amount, status, visibility, contract_address, contract_grant_id, sponsor_name, sponsor_slug, beneficiary_name, reviewer_name, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(8);

  if (grantsError) {
    return getFallbackTransparencySnapshot();
  }

  const grants = (grantRows ?? []) as PublicGrantRow[];
  const grantIds = grants.map((grant) => grant.id);

  const [{ data: milestoneRows, error: milestonesError }, { data: auditRows, error: auditError }] =
    await Promise.all([
      grantIds.length
        ? supabase
            .from("milestones")
            .select("grant_id, name, description, status")
            .in("grant_id", grantIds)
            .order("created_at", { ascending: false })
            .limit(6)
        : Promise.resolve({ data: [], error: null }),
      grantIds.length
        ? supabase
            .from("grant_latest_activity")
            .select("grant_id, event_type, payload, created_at")
            .in("grant_id", grantIds)
            .order("created_at", { ascending: false })
            .limit(6)
        : Promise.resolve({ data: [], error: null })
    ]);

  if (milestonesError || auditError) {
    return getFallbackTransparencySnapshot();
  }

  return {
    grants: grants.map((grant) => mapGrantCard(grant)),
    milestones:
      ((milestoneRows ?? []) as MilestoneRow[]).map((milestone) => ({
        name: milestone.name,
        status: humanizeMilestoneStatus(milestone.status),
        summary:
          milestone.description ??
          "Milestone tracked in the shared review window."
      })) || [],
    auditTrail:
      ((auditRows ?? []) as AuditEventRow[]).map((row) => ({
        label: mapAuditEventLabel(row.event_type),
        detail: mapAuditEventDetail(row),
        createdAt: row.created_at
      })) || [],
    delegatedGithubWorkflow,
    source: "supabase",
    sourceLabel: "Supabase public data"
  };
}

type GrantMutationContext = {
  id: string;
  slug: string;
  title: string;
  asset_code: string;
  sponsor_org_id: string | null;
  reviewer_user_id: string | null;
  beneficiary_user_id: string | null;
  created_by_user_id: string | null;
  status: string;
};

async function getGrantMutationContext(slug: string): Promise<GrantMutationContext | null> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("grants")
    .select(
      "id, slug, title, asset_code, sponsor_org_id, reviewer_user_id, beneficiary_user_id, created_by_user_id, status"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as GrantMutationContext;
}

export async function getGrantDetailSnapshot(
  slug: string
): Promise<GrantDetailResult> {
  const fallback = getFallbackGrantDetailSnapshot(slug);
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return fallback
      ? { ok: true, snapshot: fallback }
      : { ok: false, error: "Grant not found.", status: 404 };
  }

  const { data: grantRow, error: grantError } = await supabase
    .from("grants")
    .select(
      "id, slug, title, summary, sponsor_org_id, reviewer_user_id, beneficiary_user_id, asset_code, total_amount, cap_per_window, released_amount, status, visibility, contract_address, contract_grant_id, created_at"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (grantError || !grantRow) {
    return fallback
      ? { ok: true, snapshot: fallback }
      : { ok: false, error: "Grant not found.", status: 404 };
  }

  const grant = grantRow as GrantRow;
  const userIds = [grant.beneficiary_user_id, grant.reviewer_user_id].filter(
    (value): value is string => Boolean(value)
  );
  const sponsorOrgIds = [grant.sponsor_org_id].filter(
    (value): value is string => Boolean(value)
  );

  const [
    { data: userRows, error: usersError },
    { data: organizationRows, error: organizationsError },
    { data: milestoneRows, error: milestonesError },
    { data: evidenceRows, error: evidenceError },
    { data: evaluationRows, error: evaluationsError },
    { data: auditRows, error: auditError }
  ] = await Promise.all([
    userIds.length
      ? supabase.from("users").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [], error: null }),
    sponsorOrgIds.length
      ? supabase
          .from("organizations")
          .select("id, name, slug")
          .in("id", sponsorOrgIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("milestones")
      .select(
        "id, grant_id, order_index, name, description, target_date, budget_hint, success_metric, verification_method, evidence_requirements, status, created_at"
      )
      .eq("grant_id", grant.id)
      .order("order_index", { ascending: true }),
    supabase
      .from("evidence_packs")
      .select(
        "id, grant_id, window_label, github_repo_url, github_branch, github_commit_hash, docs_url, demo_url, test_run_url, notes, status, submitted_at, created_at"
      )
      .eq("grant_id", grant.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("evaluations")
      .select(
        "id, grant_id, evidence_pack_id, score, progress_score, delivery_score, risk_score, suggested_amount, decision, reviewer_note, override_reason, decision_hash, evaluated_at"
      )
      .eq("grant_id", grant.id)
      .order("evaluated_at", { ascending: false }),
    supabase
      .from("audit_events")
      .select("grant_id, event_type, payload, created_at")
      .eq("grant_id", grant.id)
      .order("created_at", { ascending: false })
      .limit(12)
  ]);

  if (
    usersError ||
    organizationsError ||
    milestonesError ||
    evidenceError ||
    evaluationsError ||
    auditError
  ) {
    return fallback
      ? { ok: true, snapshot: fallback }
      : { ok: false, error: "Could not load grant detail." };
  }

  const userMap = new Map(
    ((userRows ?? []) as UserRow[]).map((user) => [user.id, user.display_name])
  );
  const organizationMap = new Map(
    ((organizationRows ?? []) as OrganizationRow[]).map((organization) => [
      organization.id,
      organization.name
    ])
  );

  const card = mapGrantCard(grant, {
    beneficiaryName: grant.beneficiary_user_id
      ? userMap.get(grant.beneficiary_user_id) ?? "Beneficiary pending"
      : "Beneficiary pending",
    reviewerName: grant.reviewer_user_id
      ? userMap.get(grant.reviewer_user_id) ?? "Reviewer pending"
      : "Reviewer pending",
    sponsorName: grant.sponsor_org_id
      ? organizationMap.get(grant.sponsor_org_id) ?? "Sponsor pending"
      : "Sponsor pending"
  });

  return {
    ok: true,
    snapshot: {
      grant: {
        ...card,
        summary: grant.summary ?? "Grant summary pending.",
        capPerWindow: formatAssetAmount(parseNumericValue(grant.cap_per_window), grant.asset_code),
        releasedAmount: formatAssetAmount(parseNumericValue(grant.released_amount), grant.asset_code),
        contractAddress: grant.contract_address,
        contractGrantId: grant.contract_grant_id
      },
      milestones: ((milestoneRows ?? []) as MilestoneRow[]).map(mapMilestone),
      evidencePacks: ((evidenceRows ?? []) as EvidencePackRow[]).map(mapEvidencePack),
      evaluations: ((evaluationRows ?? []) as EvaluationRow[]).map(mapEvaluation),
      timeline:
        ((auditRows ?? []) as AuditEventRow[]).map((row) => ({
          label: mapAuditEventLabel(row.event_type),
          detail: mapAuditEventDetail(row),
          createdAt: row.created_at
        })) || [],
      delegatedGithubWorkflow,
      source: "supabase",
      sourceLabel: "Supabase grant detail"
    }
  };
}

function validateCreateMilestonePayload(payload: CreateMilestonePayload) {
  const name = payload.name?.trim() ?? "";
  const description = payload.description?.trim() ?? "";
  const targetDate = payload.targetDate?.trim() || null;
  const budgetHint = payload.budgetHint?.trim() ?? "";
  const successMetric = payload.successMetric?.trim() ?? "";
  const verificationMethod = payload.verificationMethod?.trim() ?? "";
  const evidenceRequirements = payload.evidenceRequirements?.trim() ?? "";

  if (name.length < 3) {
    return { ok: false as const, error: "Milestone name must be at least 3 characters." };
  }

  if (budgetHint && (!Number.isFinite(Number(budgetHint)) || Number(budgetHint) < 0)) {
    return { ok: false as const, error: "Budget hint must be a valid positive number." };
  }

  return {
    ok: true as const,
    value: {
      name,
      description,
      targetDate,
      budgetHint,
      successMetric,
      verificationMethod,
      evidenceRequirements
    } satisfies ValidatedMilestonePayload
  };
}

function validateCreateEvidencePayload(payload: CreateEvidencePayload) {
  const windowLabel = payload.windowLabel?.trim() ?? "";

  if (windowLabel.length < 3) {
    return { ok: false as const, error: "Evidence window label must be at least 3 characters." };
  }

  return {
    ok: true as const,
    value: {
      windowLabel,
      githubRepoUrl: payload.githubRepoUrl?.trim() ?? "",
      githubBranch: payload.githubBranch?.trim() ?? "",
      githubCommitHash: payload.githubCommitHash?.trim() ?? "",
      docsUrl: payload.docsUrl?.trim() ?? "",
      demoUrl: payload.demoUrl?.trim() ?? "",
      testRunUrl: payload.testRunUrl?.trim() ?? "",
      notes: payload.notes?.trim() ?? ""
    } satisfies ValidatedEvidencePayload
  };
}

function validateCreateEvaluationPayload(payload: CreateEvaluationPayload) {
  const allowedDecisions = new Set(["approve", "adjust", "pause", "reject"]);
  const decision = payload.decision?.trim().toLowerCase() ?? "";

  if (!allowedDecisions.has(decision)) {
    return { ok: false as const, error: "Decision must be approve, adjust, pause, or reject." };
  }

  const score = Number(payload.score ?? "0");
  const progressScore = Number(payload.progressScore ?? "0");
  const deliveryScore = Number(payload.deliveryScore ?? "0");
  const riskScore = Number(payload.riskScore ?? "0");
  const suggestedAmount = Number(payload.suggestedAmount ?? "0");

  const scoreChecks: Array<[string, number]> = [
    ["score", score],
    ["progress score", progressScore],
    ["delivery score", deliveryScore],
    ["risk score", riskScore]
  ];

  for (const [label, value] of scoreChecks) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      return { ok: false as const, error: `${label} must be between 0 and 100.` };
    }
  }

  if (!Number.isFinite(suggestedAmount) || suggestedAmount < 0) {
    return { ok: false as const, error: "Suggested amount must be zero or greater." };
  }

  return {
    ok: true as const,
    value: {
      evidencePackId: payload.evidencePackId?.trim() || null,
      score,
      progressScore,
      deliveryScore,
      riskScore,
      suggestedAmount,
      decision,
      reviewerNote: payload.reviewerNote?.trim() ?? "",
      overrideReason: payload.overrideReason?.trim() ?? ""
    } satisfies ValidatedEvaluationPayload
  };
}

async function ensureUser(
  loginName: string,
  displayName: string,
  role: "admin" | "reviewer" | "beneficiary"
) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase server client is not configured.");
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        login_name: loginName,
        display_name: displayName,
        role,
        status: "active"
      },
      {
        onConflict: "login_name"
      }
    )
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not ensure user.");
  }

  return data.id as string;
}

async function ensureSponsorOrganization(createdByUserId: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase server client is not configured.");
  }

  const { data, error } = await supabase
    .from("organizations")
    .upsert(
      {
        slug: "milestone-sponsor-desk",
        name: "Milestone Sponsor Desk",
        organization_type: "foundation",
        created_by_user_id: createdByUserId
      },
      {
        onConflict: "slug"
      }
    )
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not ensure sponsor organization.");
  }

  return data.id as string;
}

async function findAvailableGrantSlug(baseTitle: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase server client is not configured.");
  }

  const baseSlug = slugifyGrantTitle(baseTitle);
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from("grants")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
}

function buildMetadataHash(payload: {
  title: string;
  summary: string;
  totalAmount: number;
  capPerWindow: number;
  visibility: string;
}) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function buildAuditHash(grantId: string, slug: string) {
  return createHash("sha256")
    .update(`${grantId}:${slug}:grant_created`)
    .digest("hex");
}

function validateCreateGrantPayload(payload: CreateGrantPayload) {
  const title = payload.title?.trim() ?? "";
  const summary = payload.summary?.trim() ?? "";
  const totalAmount = Number(payload.totalAmount);
  const capPerWindow = Number(payload.capPerWindow);
  const visibility: "private" | "public" =
    payload.visibility === "private" ? "private" : "public";
  const reviewerName = payload.reviewerName?.trim() ?? "";
  const beneficiaryName = payload.beneficiaryName?.trim() ?? "";
  const firstMilestoneName = payload.firstMilestoneName?.trim() ?? "";
  const firstMilestoneDescription = payload.firstMilestoneDescription?.trim() ?? "";
  const firstMilestoneSuccessMetric = payload.firstMilestoneSuccessMetric?.trim() ?? "";
  const firstMilestoneVerificationMethod =
    payload.firstMilestoneVerificationMethod?.trim() ?? "";
  const firstMilestoneEvidenceRequirements =
    payload.firstMilestoneEvidenceRequirements?.trim() ?? "";
  const firstMilestoneTargetDate = payload.firstMilestoneTargetDate?.trim() || null;
  const firstMilestoneBudgetHint = payload.firstMilestoneBudgetHint?.trim() ?? "";

  if (title.length < 4) {
    return { ok: false as const, error: "Grant title must be at least 4 characters." };
  }

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    return { ok: false as const, error: "Total amount must be greater than zero." };
  }

  if (!Number.isFinite(capPerWindow) || capPerWindow <= 0) {
    return { ok: false as const, error: "Cap per window must be greater than zero." };
  }

  if (capPerWindow > totalAmount) {
    return {
      ok: false as const,
      error: "Cap per window cannot be greater than the total amount."
    };
  }

  if (
    firstMilestoneBudgetHint &&
    (!Number.isFinite(Number(firstMilestoneBudgetHint)) ||
      Number(firstMilestoneBudgetHint) < 0)
  ) {
    return {
      ok: false as const,
      error: "Initial milestone budget hint must be zero or greater."
    };
  }

  return {
    ok: true as const,
    value: {
      title,
      summary,
      totalAmount,
      capPerWindow,
      reviewerName,
      beneficiaryName,
      visibility,
      firstMilestoneName,
      firstMilestoneDescription,
      firstMilestoneSuccessMetric,
      firstMilestoneVerificationMethod,
      firstMilestoneEvidenceRequirements,
      firstMilestoneTargetDate,
      firstMilestoneBudgetHint
    } satisfies ValidatedGrantPayload
  };
}

export async function createGrant(payload: CreateGrantPayload): Promise<CreateGrantResult> {
  const validated = validateCreateGrantPayload(payload);

  if (!validated.ok) {
    return {
      ok: false,
      error: validated.error
    };
  }

  if (!hasServiceRoleSupabaseConfig()) {
    return createRuntimeGrantResult(validated.value);
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return createRuntimeGrantResult(validated.value);
  }

  try {
    const adminDisplayName = "Milestone Operator";
    const adminLoginName = "milestone-admin";
    const adminUserId = await ensureUser(adminLoginName, adminDisplayName, "admin");
    const sponsorOrgId = await ensureSponsorOrganization(adminUserId);
    const reviewerUserId = validated.value.reviewerName
      ? await ensureUser(
          `${slugifyGrantTitle(validated.value.reviewerName)}-reviewer`,
          validated.value.reviewerName,
          "reviewer"
        )
      : null;
    const beneficiaryUserId = validated.value.beneficiaryName
      ? await ensureUser(
          `${slugifyGrantTitle(validated.value.beneficiaryName)}-beneficiary`,
          validated.value.beneficiaryName,
          "beneficiary"
        )
      : null;
    const slug = await findAvailableGrantSlug(validated.value.title);
    const metadataHash = buildMetadataHash({
      title: validated.value.title,
      summary: validated.value.summary,
      totalAmount: validated.value.totalAmount,
      capPerWindow: validated.value.capPerWindow,
      visibility: validated.value.visibility
    });

    const { data: grant, error: grantError } = await supabase
      .from("grants")
      .insert({
        slug,
        title: validated.value.title,
        summary: validated.value.summary || null,
        sponsor_org_id: sponsorOrgId,
        reviewer_user_id: reviewerUserId,
        beneficiary_user_id: beneficiaryUserId,
        asset_kind: "xlm",
        asset_code: "XLM",
        total_amount: validated.value.totalAmount,
        cap_per_window: validated.value.capPerWindow,
        status: "funding",
        visibility: validated.value.visibility,
        metadata_hash: metadataHash,
        created_by_user_id: adminUserId
      })
      .select("id, slug")
      .single();

    if (grantError || !grant) {
      return createRuntimeGrantResult(validated.value);
    }

    await supabase.from("milestones").insert({
      grant_id: grant.id,
      order_index: 0,
      name: validated.value.firstMilestoneName || "Initial review window",
      description:
        validated.value.firstMilestoneDescription ||
        "First evidence and reviewer checkpoint for the grant.",
      target_date: validated.value.firstMilestoneTargetDate,
      budget_hint: validated.value.firstMilestoneBudgetHint
        ? Number(validated.value.firstMilestoneBudgetHint)
        : null,
      success_metric:
        validated.value.firstMilestoneSuccessMetric ||
        "Initial KPI defined and first evidence pack submitted.",
      verification_method:
        validated.value.firstMilestoneVerificationMethod ||
        "Reviewer checks links, docs, and submitted artifacts.",
      evidence_requirements:
        validated.value.firstMilestoneEvidenceRequirements ||
        "At least one repository, docs, demo, or test run reference is attached.",
      status: "planned"
    });

    await supabase.from("audit_events").insert({
      grant_id: grant.id,
      event_type: "grant_created",
      entity_type: "grant",
      entity_id: grant.id,
      actor_user_id: adminUserId,
      payload: {
        title: validated.value.title,
        summary:
          validated.value.summary || "Sponsor created the grant terms for review.",
        visibility: validated.value.visibility
      },
      event_hash: buildAuditHash(grant.id, grant.slug)
    });

    return {
      ok: true,
      grant: {
        id: grant.id as string,
        slug: grant.slug as string
      },
      source: "supabase"
    };
  } catch {
    return createRuntimeGrantResult(validated.value);
  }
}

export async function createMilestoneForGrant(
  slug: string,
  payload: CreateMilestonePayload
): Promise<MutationResult> {
  const validated = validateCreateMilestonePayload(payload);

  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  if (!hasServiceRoleSupabaseConfig()) {
    return createRuntimeMilestoneForGrant(slug, validated.value);
  }

  const supabase = createServerSupabaseClient();
  const grant = await getGrantMutationContext(slug);

  if (!supabase || !grant) {
    return createRuntimeMilestoneForGrant(slug, validated.value);
  }

  const { count, error: countError } = await supabase
    .from("milestones")
    .select("id", { count: "exact", head: true })
    .eq("grant_id", grant.id);

  if (countError) {
    return createRuntimeMilestoneForGrant(slug, validated.value);
  }

  const { data: milestone, error: milestoneError } = await supabase
    .from("milestones")
    .insert({
      grant_id: grant.id,
      order_index: count ?? 0,
      name: validated.value.name,
      description: validated.value.description || null,
      target_date: validated.value.targetDate,
      budget_hint: validated.value.budgetHint ? Number(validated.value.budgetHint) : null,
      success_metric: validated.value.successMetric || null,
      verification_method: validated.value.verificationMethod || null,
      evidence_requirements: validated.value.evidenceRequirements || null,
      status: "planned"
    })
    .select("id")
    .single();

  if (milestoneError || !milestone) {
    return createRuntimeMilestoneForGrant(slug, validated.value);
  }

  await supabase.from("audit_events").insert({
    grant_id: grant.id,
    event_type: "milestone_added",
    entity_type: "milestone",
    entity_id: milestone.id,
    actor_user_id: grant.created_by_user_id,
    payload: {
      name: validated.value.name,
      success_metric: validated.value.successMetric,
      verification_method: validated.value.verificationMethod
    },
    event_hash: buildUniqueHash("milestone_added", {
      grantId: grant.id,
      milestoneId: milestone.id,
      slug
    })
  });

  return { ok: true, id: milestone.id as string };
}

export async function createEvidencePackForGrant(
  slug: string,
  payload: CreateEvidencePayload
): Promise<MutationResult> {
  const validated = validateCreateEvidencePayload(payload);

  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  if (!hasServiceRoleSupabaseConfig()) {
    return createRuntimeEvidenceForGrant(slug, validated.value);
  }

  const supabase = createServerSupabaseClient();
  const grant = await getGrantMutationContext(slug);

  if (!supabase || !grant) {
    return createRuntimeEvidenceForGrant(slug, validated.value);
  }

  const evidenceHash = buildUniqueHash("evidence_pack", {
    grantId: grant.id,
    windowLabel: validated.value.windowLabel,
    githubRepoUrl: validated.value.githubRepoUrl,
    docsUrl: validated.value.docsUrl,
    demoUrl: validated.value.demoUrl
  });

  const { data: evidence, error: evidenceError } = await supabase
    .from("evidence_packs")
    .insert({
      grant_id: grant.id,
      submitted_by_user_id: grant.beneficiary_user_id ?? grant.created_by_user_id,
      window_label: validated.value.windowLabel,
      github_repo_url: validated.value.githubRepoUrl || null,
      github_branch: validated.value.githubBranch || null,
      github_commit_hash: validated.value.githubCommitHash || null,
      docs_url: validated.value.docsUrl || null,
      demo_url: validated.value.demoUrl || null,
      test_run_url: validated.value.testRunUrl || null,
      notes: validated.value.notes || null,
      evidence_hash: evidenceHash,
      status: "submitted",
      submitted_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (evidenceError || !evidence) {
    return createRuntimeEvidenceForGrant(slug, validated.value);
  }

  await supabase.from("audit_events").insert({
    grant_id: grant.id,
    event_type: "evidence_submitted",
    entity_type: "evidence_pack",
    entity_id: evidence.id,
    actor_user_id: grant.beneficiary_user_id ?? grant.created_by_user_id,
    payload: {
      window_label: validated.value.windowLabel,
      github_repo_url: validated.value.githubRepoUrl,
      docs_url: validated.value.docsUrl,
      demo_url: validated.value.demoUrl
    },
    event_hash: buildUniqueHash("evidence_submitted", {
      grantId: grant.id,
      evidenceId: evidence.id
    })
  });

  return { ok: true, id: evidence.id as string };
}

export async function createEvaluationForGrant(
  slug: string,
  payload: CreateEvaluationPayload
): Promise<MutationResult> {
  const validated = validateCreateEvaluationPayload(payload);

  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  if (!hasServiceRoleSupabaseConfig()) {
    return createRuntimeEvaluationForGrant(slug, validated.value);
  }

  const supabase = createServerSupabaseClient();
  const grant = await getGrantMutationContext(slug);

  if (!supabase || !grant) {
    return createRuntimeEvaluationForGrant(slug, validated.value);
  }

  const decisionHash = buildUniqueHash("evaluation_recorded", {
    grantId: grant.id,
    decision: validated.value.decision,
    suggestedAmount: validated.value.suggestedAmount
  });

  const { data: evaluation, error: evaluationError } = await supabase
    .from("evaluations")
    .insert({
      grant_id: grant.id,
      evidence_pack_id: validated.value.evidencePackId,
      reviewed_by_user_id: grant.reviewer_user_id ?? grant.created_by_user_id,
      score: validated.value.score,
      progress_score: validated.value.progressScore,
      delivery_score: validated.value.deliveryScore,
      risk_score: validated.value.riskScore,
      suggested_amount: validated.value.suggestedAmount,
      decision: validated.value.decision,
      reviewer_note: validated.value.reviewerNote || null,
      override_reason: validated.value.overrideReason || null,
      decision_hash: decisionHash,
      evaluated_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (evaluationError || !evaluation) {
    return createRuntimeEvaluationForGrant(slug, validated.value);
  }

  if (validated.value.evidencePackId) {
    const evidenceStatus =
      validated.value.decision === "approve"
        ? "accepted"
        : validated.value.decision === "reject"
          ? "rejected"
          : "under_review";

    await supabase
      .from("evidence_packs")
      .update({
        status: evidenceStatus,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", validated.value.evidencePackId);
  }

  if (validated.value.decision === "pause") {
    await supabase.from("pause_events").insert({
      grant_id: grant.id,
      state: "paused",
      reason:
        validated.value.overrideReason ||
        validated.value.reviewerNote ||
        "Reviewer paused the grant pending stronger evidence.",
      raised_by_user_id: grant.reviewer_user_id ?? grant.created_by_user_id
    });

    await supabase.from("grants").update({ status: "paused" }).eq("id", grant.id);
  } else if (["approve", "adjust"].includes(validated.value.decision)) {
    await supabase
      .from("grants")
      .update({ status: grant.status === "draft" ? "funding" : "active" })
      .eq("id", grant.id);
  }

  await supabase.from("audit_events").insert({
    grant_id: grant.id,
    event_type: "evaluation_recorded",
    entity_type: "evaluation",
    entity_id: evaluation.id,
    actor_user_id: grant.reviewer_user_id ?? grant.created_by_user_id,
    payload: {
      decision: validated.value.decision,
      suggested_amount: validated.value.suggestedAmount,
      reviewer_note: validated.value.reviewerNote
    },
    event_hash: decisionHash
  });

  return { ok: true, id: evaluation.id as string };
}
