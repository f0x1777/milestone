import { NextResponse } from "next/server";
import {
  createPasswordSession,
  createWalletSession,
  encodeMockSession,
  isSupportedWalletProvider,
  mockCredentials,
  mockSessionCookie
} from "@/lib/mock-auth";

type LoginBody = {
  mode?: "password" | "wallet";
  email?: string;
  password?: string;
  walletLabel?: string;
  nextPath?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const defaultEmail = process.env.MILESTONE_ADMIN_EMAIL ?? mockCredentials.email;
  const defaultPassword =
    process.env.MILESTONE_ADMIN_PASSWORD ?? mockCredentials.password;

  if (body.mode === "password") {
    if (body.email !== defaultEmail || body.password !== defaultPassword) {
      return NextResponse.json({ error: "Invalid mock credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(mockSessionCookie, encodeMockSession(createPasswordSession(defaultEmail)), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8
    });
    return response;
  }

  if (body.mode === "wallet") {
    if (!body.walletLabel || !isSupportedWalletProvider(body.walletLabel)) {
      return NextResponse.json({ error: "Unsupported wallet provider." }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(mockSessionCookie, encodeMockSession(createWalletSession(body.walletLabel)), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8
    });
    return response;
  }

  return NextResponse.json({ error: "Unsupported auth mode." }, { status: 400 });
}
