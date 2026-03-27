import { NextResponse } from "next/server";
import { appConfig } from "@/lib/runtime-config";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "milestone-web",
    network: appConfig.stellarNetwork,
    contractId: appConfig.contractId || null
  });
}
