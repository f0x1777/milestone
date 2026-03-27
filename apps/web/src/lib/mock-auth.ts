export const mockCredentials = {
  email: "team@milestone.app",
  password: "milestone-demo",
  walletLabel: "Freighter",
  walletAddress: "GBMILESTONEFREIGHTERDEMOXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
};

export type MockSession = {
  name: string;
  role: "admin" | "sponsor" | "reviewer" | "beneficiary";
  authMethod: "password" | "wallet";
  walletAddress?: string;
  email?: string;
};

export const mockSessionCookie = "milestone_session";
export const supportedWalletProviders = ["Freighter", "Beexo"] as const;

export function isSupportedWalletProvider(
  walletLabel: string
): walletLabel is (typeof supportedWalletProviders)[number] {
  return supportedWalletProviders.includes(
    walletLabel as (typeof supportedWalletProviders)[number]
  );
}

export function parseMockSession(raw?: string): MockSession | null {
  if (!raw) return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as MockSession;
  } catch {
    return null;
  }
}

export function encodeMockSession(session: MockSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function createPasswordSession(email: string): MockSession {
  return {
    name: "Milestone Operator",
    role: "admin",
    authMethod: "password",
    email
  };
}

export function createWalletSession(
  walletLabel: (typeof supportedWalletProviders)[number]
): MockSession {
  const walletAddress =
    walletLabel === "Freighter"
      ? "GBMILESTONEFREIGHTERDEMOXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      : "GBMILESTONEBEEXODEMOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

  return {
    name: `${walletLabel} Reviewer`,
    role: "reviewer",
    authMethod: "wallet",
    walletAddress
  };
}
