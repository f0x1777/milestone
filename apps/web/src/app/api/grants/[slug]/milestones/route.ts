import { NextResponse } from "next/server";
import {
  createMilestoneForGrant,
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
    items: result.snapshot.milestones,
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

  const result = await createMilestoneForGrant(slug, {
    name: String(payload.name ?? ""),
    description: String(payload.description ?? ""),
    targetDate: String(payload.targetDate ?? ""),
    budgetHint: String(payload.budgetHint ?? ""),
    successMetric: String(payload.successMetric ?? ""),
    verificationMethod: String(payload.verificationMethod ?? ""),
    evidenceRequirements: String(payload.evidenceRequirements ?? "")
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
  redirectUrl.searchParams.set("actionSuccess", "milestone");
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
