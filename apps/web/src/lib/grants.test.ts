import test from "node:test";
import assert from "node:assert/strict";
import {
  createEvaluationForGrant,
  createEvidencePackForGrant,
  createGrant,
  createMilestoneForGrant,
  formatReleaseLabel,
  getGrantDetailSnapshot,
  humanizeGrantStatus,
  slugifyGrantTitle
} from "@/lib/grants";

test("slugifyGrantTitle creates URL-safe slugs", () => {
  assert.equal(slugifyGrantTitle("Milestone Builders Fund"), "milestone-builders-fund");
  assert.equal(slugifyGrantTitle("  ###  "), "grant");
});

test("formatReleaseLabel reflects release progress", () => {
  assert.equal(formatReleaseLabel(0, 12500), "No releases yet");
  assert.equal(formatReleaseLabel(3500, 12500), "28% released");
});

test("humanizeGrantStatus maps known workflow labels", () => {
  assert.equal(humanizeGrantStatus("active"), "Live");
  assert.equal(humanizeGrantStatus("funding"), "Funding");
  assert.equal(humanizeGrantStatus("paused"), "Paused");
});

test("getGrantDetailSnapshot returns the enriched fallback detail for known slugs", async () => {
  const result = await getGrantDetailSnapshot("milestone-builders-fund");

  assert.equal(result.ok, true);

  if (!result.ok) {
    throw new Error("Expected fallback grant detail snapshot.");
  }

  assert.equal(result.snapshot.grant.slug, "milestone-builders-fund");
  assert.equal(result.snapshot.milestones.length > 0, true);
  assert.equal(result.snapshot.evidencePacks.length > 0, true);
  assert.equal(result.snapshot.evaluations.length > 0, true);
});

test("getGrantDetailSnapshot returns not found for unknown slugs", async () => {
  const result = await getGrantDetailSnapshot("does-not-exist");

  assert.equal(result.ok, false);

  if (result.ok) {
    throw new Error("Expected missing grant detail result.");
  }

  assert.equal(result.status, 404);
});

test("runtime fallback supports the local grant detail workflow", async () => {
  const created = await createGrant({
    title: "Runtime Demo Grant",
    summary: "Used to prove the local demo flow works without Supabase.",
    totalAmount: "1500",
    capPerWindow: "500",
    reviewerName: "Runtime Reviewer",
    beneficiaryName: "Runtime Beneficiary",
    visibility: "public",
    firstMilestoneName: "Initial KPI window",
    firstMilestoneSuccessMetric: "Specs shipped and evidence requested"
  });

  assert.equal(created.ok, true);

  if (!created.ok) {
    throw new Error("Expected runtime grant creation to succeed.");
  }

  assert.equal(created.source, "mock");

  const milestoneResult = await createMilestoneForGrant(created.grant.slug, {
    name: "Second checkpoint",
    successMetric: "Demo URL and CI attached"
  });
  assert.equal(milestoneResult.ok, true);

  const evidenceResult = await createEvidencePackForGrant(created.grant.slug, {
    windowLabel: "Window 01",
    githubRepoUrl: "https://github.com/f0x1777/milestone",
    testRunUrl: "https://github.com/f0x1777/milestone/actions/runs/1"
  });
  assert.equal(evidenceResult.ok, true);

  if (!evidenceResult.ok) {
    throw new Error("Expected runtime evidence pack creation to succeed.");
  }

  const evaluationResult = await createEvaluationForGrant(created.grant.slug, {
    evidencePackId: evidenceResult.id,
    score: "88",
    progressScore: "90",
    deliveryScore: "84",
    riskScore: "18",
    suggestedAmount: "500",
    decision: "approve",
    reviewerNote: "Runtime flow is ready for the next step."
  });
  assert.equal(evaluationResult.ok, true);

  const detail = await getGrantDetailSnapshot(created.grant.slug);
  assert.equal(detail.ok, true);

  if (!detail.ok) {
    throw new Error("Expected runtime grant detail snapshot.");
  }

  assert.equal(detail.snapshot.milestones.length >= 2, true);
  assert.equal(detail.snapshot.evidencePacks.length, 1);
  assert.equal(detail.snapshot.evaluations.length, 1);
  assert.equal(detail.snapshot.grant.statusKey, "active");
});
