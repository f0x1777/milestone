import { NextResponse } from "next/server";
import {
  auditTrail,
  delegatedGithubWorkflow,
  grants,
  milestones
} from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    grants,
    milestones,
    auditTrail,
    delegatedGithubWorkflow
  });
}
