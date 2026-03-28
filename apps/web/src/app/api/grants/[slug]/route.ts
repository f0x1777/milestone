import { NextResponse } from "next/server";
import { getGrantDetailSnapshot } from "@/lib/grants";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getGrantDetailSnapshot(slug);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 400 }
    );
  }

  return NextResponse.json(result.snapshot);
}
