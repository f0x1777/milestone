import { NextResponse } from "next/server";
import { grants } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    items: grants
  });
}
