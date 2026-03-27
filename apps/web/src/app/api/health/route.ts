import { NextResponse } from "next/server";
import { appConfig } from "@/lib/runtime-config";
import {
  hasPublicSupabaseConfig,
  hasServiceRoleSupabaseConfig
} from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "milestone-web",
    network: appConfig.stellarNetwork,
    contractId: appConfig.contractId || null,
    supabaseConfigured: hasPublicSupabaseConfig(),
    supabaseWriteEnabled: hasServiceRoleSupabaseConfig()
  });
}
