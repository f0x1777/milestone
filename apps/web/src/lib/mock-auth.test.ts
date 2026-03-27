import assert from "node:assert/strict";
import test from "node:test";
import {
  createPasswordSession,
  createWalletSession,
  encodeMockSession,
  isSupportedWalletProvider,
  parseMockSession
} from "./mock-auth";

test("encodes and decodes a password session", () => {
  const encoded = encodeMockSession(createPasswordSession("team@milestone.app"));
  const decoded = parseMockSession(encoded);

  assert.deepEqual(decoded, {
    name: "Milestone Operator",
    role: "admin",
    authMethod: "password",
    email: "team@milestone.app"
  });
});

test("only approved wallet providers are accepted", () => {
  assert.equal(isSupportedWalletProvider("Freighter"), true);
  assert.equal(isSupportedWalletProvider("Beexo"), true);
  assert.equal(isSupportedWalletProvider("WalletConnect SDK"), false);
});

test("wallet sessions are shaped for reviewer access", () => {
  const session = createWalletSession("Freighter");

  assert.equal(session.role, "reviewer");
  assert.equal(session.authMethod, "wallet");
  assert.match(session.walletAddress ?? "", /^GBMILESTONE/);
});
