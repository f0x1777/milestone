import { NextResponse } from "next/server";
import { getTransparencySnapshot } from "@/lib/grants";

export async function GET() {
  const snapshot = await getTransparencySnapshot();

  return NextResponse.json({
    grants: snapshot.grants,
    milestones: snapshot.milestones,
    auditTrail: snapshot.auditTrail,
    delegatedGithubWorkflow: snapshot.delegatedGithubWorkflow,
    source: snapshot.source,
    sourceLabel: snapshot.sourceLabel
  });
}
