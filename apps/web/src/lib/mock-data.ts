export const milestones = [
  {
    name: "Deposit locked",
    status: "complete",
    summary: "Grant deposited into the vault and visible on testnet."
  },
  {
    name: "Evidence synced",
    status: "active",
    summary: "GitHub, docs and demo links attached to the evidence pack."
  },
  {
    name: "Partial release",
    status: "pending",
    summary: "Reviewer approves a controlled unlock after scoring."
  },
  {
    name: "Pause and reclaim",
    status: "pending",
    summary: "Risk flag freezes future releases and preserves the trail."
  }
] as const;

export const grants = [
  {
    title: "Milestone Builders Fund",
    beneficiary: "Latam open-source cohort",
    amount: "12,500 XLM",
    status: "Live",
    release: "28% unlocked",
    note: "Stellar testnet vault with reviewer override."
  },
  {
    title: "University Prototype Sprint",
    beneficiary: "Engineering lab",
    amount: "6,800 XLM",
    status: "Under review",
    release: "Evidence pending",
    note: "Waiting for GitHub delegation and CI signals."
  }
] as const;

export const auditTrail = [
  {
    label: "Grant created",
    detail: "Sponsor defined terms, reviewer and beneficiary."
  },
  {
    label: "Funds deposited",
    detail: "Stellar vault funded on testnet."
  },
  {
    label: "Evidence pack submitted",
    detail: "GitHub, docs and demo references attached."
  },
  {
    label: "Decision hash recorded",
    detail: "Reviewer action is anchored for traceability."
  }
] as const;

export const delegatedGithubWorkflow = [
  {
    title: "Repository delegation",
    detail:
      "The beneficiary shares repository access with a delegated Milestone service account."
  },
  {
    title: "Delegated test execution",
    detail:
      "Tests run from the delegated account or CI context, and Milestone stores only references."
  },
  {
    title: "Evidence capture",
    detail:
      "Repo URL, branch, commit, run URL and evidence hash are attached to the evaluation window."
  }
] as const;
