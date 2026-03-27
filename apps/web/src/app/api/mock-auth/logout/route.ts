import { NextResponse } from "next/server";
import { mockSessionCookie } from "@/lib/mock-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/auth", request.url));
  response.cookies.set(mockSessionCookie, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0)
  });
  return response;
}
