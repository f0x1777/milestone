import { NextResponse } from "next/server";
import {
  createEvaluationForGrant,
  getGrantDetailSnapshot
} from "@/lib/grants";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function isJsonRequest(request: Request) {
  return request.headers.get("content-type")?.includes("application/json") ?? false;
}

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getGrantDetailSnapshot(slug);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 400 }
    );
  }

  return NextResponse.json({
    items: result.snapshot.evaluations,
    source: result.snapshot.source,
    sourceLabel: result.snapshot.sourceLabel
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const jsonMode = isJsonRequest(request);
  const payload = jsonMode
    ? ((await request.json()) as Record<string, FormDataEntryValue>)
    : Object.fromEntries(await request.formData());

  const result = await createEvaluationForGrant(slug, {
    evidencePackId: String(payload.evidencePackId ?? ""),
    score: String(payload.score ?? ""),
    progressScore: String(payload.progressScore ?? ""),
    deliveryScore: String(payload.deliveryScore ?? ""),
    riskScore: String(payload.riskScore ?? ""),
    suggestedAmount: String(payload.suggestedAmount ?? ""),
    decision: String(payload.decision ?? ""),
    reviewerNote: String(payload.reviewerNote ?? ""),
    overrideReason: String(payload.overrideReason ?? "")
  });

  if (!result.ok) {
    if (jsonMode) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const redirectUrl = new URL(`/dashboard/grants/${slug}`, request.url);
    redirectUrl.searchParams.set("actionError", result.error);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (jsonMode) {
    return NextResponse.json({ ok: true, id: result.id });
  }

  const redirectUrl = new URL(`/dashboard/grants/${slug}`, request.url);
  redirectUrl.searchParams.set("actionSuccess", "evaluation");
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
