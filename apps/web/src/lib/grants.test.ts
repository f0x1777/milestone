import test from "node:test";
import assert from "node:assert/strict";
import {
  formatReleaseLabel,
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
