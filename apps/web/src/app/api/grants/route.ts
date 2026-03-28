import { NextResponse } from "next/server";
import { createGrant, getDashboardSnapshot } from "@/lib/grants";

export async function GET() {
  const snapshot = await getDashboardSnapshot();

  return NextResponse.json({
    items: snapshot.grants,
    stats: snapshot.stats,
    source: snapshot.source,
    sourceLabel: snapshot.sourceLabel
  });
}

type JsonGrantBody = {
  title?: string;
  summary?: string;
  totalAmount?: string;
  capPerWindow?: string;
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

function isJsonRequest(request: Request) {
  return request.headers.get("content-type")?.includes("application/json") ?? false;
}

export async function POST(request: Request) {
  const jsonMode = isJsonRequest(request);
  const payload: JsonGrantBody = jsonMode
    ? ((await request.json()) as JsonGrantBody)
    : Object.fromEntries(await request.formData());

  const result = await createGrant({
    title: payload.title ?? "",
    summary: payload.summary ?? "",
    totalAmount: payload.totalAmount ?? "",
    capPerWindow: payload.capPerWindow ?? "",
    reviewerName: payload.reviewerName ?? "",
    beneficiaryName: payload.beneficiaryName ?? "",
    visibility: payload.visibility ?? "public",
    firstMilestoneName: payload.firstMilestoneName ?? "",
    firstMilestoneDescription: payload.firstMilestoneDescription ?? "",
    firstMilestoneSuccessMetric: payload.firstMilestoneSuccessMetric ?? "",
    firstMilestoneVerificationMethod:
      payload.firstMilestoneVerificationMethod ?? "",
    firstMilestoneEvidenceRequirements:
      payload.firstMilestoneEvidenceRequirements ?? "",
    firstMilestoneTargetDate: payload.firstMilestoneTargetDate ?? "",
    firstMilestoneBudgetHint: payload.firstMilestoneBudgetHint ?? ""
  });

  if (!result.ok) {
    if (jsonMode) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const redirectUrl = new URL("/dashboard", request.url);
    redirectUrl.searchParams.set("grantError", result.error);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (jsonMode) {
    return NextResponse.json({
      ok: true,
      grant: result.grant,
      source: result.source
    });
  }

  const redirectUrl = new URL(`/dashboard/grants/${result.grant.slug}`, request.url);
  redirectUrl.searchParams.set("actionSuccess", "grant");
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
