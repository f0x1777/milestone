import { createHash } from "crypto";
import {
  auditTrail as fallbackAuditTrail,
  delegatedGithubWorkflow,
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
  grant_id: string;
  name: string;
  description: string | null;
  status: string;
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

export type CreateGrantResult =
  | {
      ok: true;
      grant: {
        id: string;
        slug: string;
      };
      source: "supabase";
    }
  | {
      ok: false;
      error: string;
    };

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

function buildGrantNote(summary: string | null, contractAddress: string | null) {
  if (summary) {
    return summary;
  }

  if (contractAddress) {
    return `Contract-linked grant at ${contractAddress}.`;
  }

  return "Grant ready for funding, evidence, and reviewer actions.";
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
  return {
    grants: fallbackGrants.map((grant, index) => ({
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
    })),
    auditTrail: fallbackAuditTrail.map((item) => ({ ...item })),
    delegatedGithubWorkflow,
    stats: {
      activeGrants: "2",
      escrowed: "19,300 XLM",
      released: "28% released",
      openFlags: "1"
    },
    source: "mock",
    sourceLabel: hasPublicSupabaseConfig()
      ? "Fallback data (Supabase query failed)"
      : "Fallback data (Supabase not configured)"
  };
}

function getFallbackTransparencySnapshot(): TransparencySnapshot {
  return {
    grants: getFallbackDashboardSnapshot().grants,
    milestones: fallbackMilestones.map((item) => ({
      name: item.name,
      status: item.status,
      summary: item.summary
    })),
    auditTrail: fallbackAuditTrail.map((item) => ({ ...item })),
    delegatedGithubWorkflow,
    source: "mock",
    sourceLabel: hasPublicSupabaseConfig()
      ? "Fallback data (Supabase query failed)"
      : "Fallback data (Supabase not configured)"
  };
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
  const visibility = payload.visibility === "private" ? "private" : "public";
  const reviewerName = payload.reviewerName?.trim() ?? "";
  const beneficiaryName = payload.beneficiaryName?.trim() ?? "";

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

  return {
    ok: true as const,
    value: {
      title,
      summary,
      totalAmount,
      capPerWindow,
      reviewerName,
      beneficiaryName,
      visibility
    }
  };
}

export async function createGrant(payload: CreateGrantPayload): Promise<CreateGrantResult> {
  if (!hasServiceRoleSupabaseConfig()) {
    return {
      ok: false,
      error:
        "Supabase write access is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY."
    };
  }

  const validated = validateCreateGrantPayload(payload);

  if (!validated.ok) {
    return {
      ok: false,
      error: validated.error
    };
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      error: "Supabase server client is not configured."
    };
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
      return {
        ok: false,
        error: grantError?.message ?? "Could not create grant."
      };
    }

    await supabase.from("milestones").insert({
      grant_id: grant.id,
      order_index: 0,
      name: "Initial review window",
      description: "First evidence and reviewer checkpoint for the grant.",
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
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error while creating grant."
    };
  }
}
