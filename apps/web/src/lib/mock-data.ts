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

export const grantDetails = {
  "milestone-builders-fund": {
    summary:
      "Seed walkthrough grant for Milestone's public transparency and reviewer flow.",
    sponsor: "Milestone Foundation",
    reviewer: "Testnet Reviewer",
    beneficiary: "Latam open-source cohort",
    amount: "12,500 XLM",
    releasedAmount: "3,500 XLM",
    capPerWindow: "3,500 XLM",
    status: "Live",
    visibility: "public",
    milestones: [
      {
        id: "mock-m1",
        name: "Developer onboarding playbook",
        status: "completed",
        description: "Publish onboarding docs, contributor checklist, and maintainers guide.",
        successMetric: "Three contributors complete the onboarding flow successfully.",
        verificationMethod: "Reviewer checks docs repository, changelog, and contributor confirmations.",
        evidenceRequirements: "Docs URL, demo recording, and pull request references."
      },
      {
        id: "mock-m2",
        name: "Reference implementation shipped",
        status: "submitted",
        description: "Ship the reference repo with CI, deployment notes, and test runs.",
        successMetric: "Main branch stays green and deployment guide is reproducible.",
        verificationMethod: "Reviewer checks CI run URL, commit hash, and deployment walkthrough.",
        evidenceRequirements: "GitHub repo URL, commit hash, test run URL, docs link, demo URL."
      }
    ],
    evidencePacks: [
      {
        id: "mock-e1",
        windowLabel: "Window 01",
        status: "submitted",
        githubRepoUrl: "https://github.com/f0x1777/milestone",
        docsUrl: "https://milestone.app/docs/onboarding",
        demoUrl: "https://milestone.app/demo",
        testRunUrl: "https://github.com/f0x1777/milestone/actions/runs/1001",
        notes: "Repository delegated and first delivery pack submitted.",
        submittedAt: "2026-03-27T14:00:00.000Z"
      }
    ],
    evaluations: [
      {
        id: "mock-v1",
        decision: "approve",
        score: 89,
        progressScore: 92,
        deliveryScore: 86,
        riskScore: 18,
        suggestedAmount: "3,500 XLM",
        reviewerNote: "Evidence is complete and the first release can move forward.",
        overrideReason: null,
        evaluatedAt: "2026-03-27T15:10:00.000Z"
      }
    ],
    timeline: [
      {
        label: "Grant created",
        detail: "Sponsor created the grant terms and assigned the reviewer.",
        createdAt: "2026-03-26T12:00:00.000Z"
      },
      {
        label: "Milestone added",
        detail: "The initial KPI window and evidence requirements were recorded.",
        createdAt: "2026-03-26T12:10:00.000Z"
      },
      {
        label: "Evidence submitted",
        detail: "The beneficiary attached repo, docs, demo, and CI references.",
        createdAt: "2026-03-27T14:00:00.000Z"
      },
      {
        label: "Evaluation recorded",
        detail: "Reviewer approved the release recommendation for the first window.",
        createdAt: "2026-03-27T15:10:00.000Z"
      }
    ]
  },
  "university-prototype-sprint": {
    summary:
      "University prototype grant that demonstrates pause conditions and milestone-based review.",
    sponsor: "Milestone Foundation",
    reviewer: "Testnet Reviewer",
    beneficiary: "Engineering lab",
    amount: "6,800 XLM",
    releasedAmount: "0 XLM",
    capPerWindow: "1,800 XLM",
    status: "Under review",
    visibility: "public",
    milestones: [
      {
        id: "mock-m3",
        name: "Prototype scope agreed",
        status: "planned",
        description: "Finalize scope, technical approach, and acceptance criteria.",
        successMetric: "Scope document approved by reviewer and sponsor.",
        verificationMethod: "Reviewer checks scope doc and milestone plan.",
        evidenceRequirements: "Scope doc URL and acceptance criteria checklist."
      },
      {
        id: "mock-m4",
        name: "First demo build",
        status: "in_progress",
        description: "Produce the first working demo build and evidence pack.",
        successMetric: "Usable demo plus reproducible local test run.",
        verificationMethod: "Reviewer checks demo build and CI output.",
        evidenceRequirements: "Demo URL, repo URL, test run URL, and release notes."
      }
    ],
    evidencePacks: [
      {
        id: "mock-e2",
        windowLabel: "Window 01",
        status: "under_review",
        githubRepoUrl: "https://github.com/f0x1777/milestone-lab",
        docsUrl: "https://example.com/spec",
        demoUrl: "",
        testRunUrl: "https://github.com/f0x1777/milestone-lab/actions/runs/2001",
        notes: "Missing demo URL and reproducibility details, currently flagged.",
        submittedAt: "2026-03-27T13:00:00.000Z"
      }
    ],
    evaluations: [
      {
        id: "mock-v2",
        decision: "pause",
        score: 61,
        progressScore: 70,
        deliveryScore: 58,
        riskScore: 64,
        suggestedAmount: "0 XLM",
        reviewerNote: "The milestone needs a reproducible demo before any release.",
        overrideReason: "Pause requested until missing evidence is attached.",
        evaluatedAt: "2026-03-27T15:40:00.000Z"
      }
    ],
    timeline: [
      {
        label: "Grant created",
        detail: "Grant terms captured for the university prototype sprint.",
        createdAt: "2026-03-26T13:00:00.000Z"
      },
      {
        label: "Evidence submitted",
        detail: "First repo and CI references arrived, but the demo evidence is incomplete.",
        createdAt: "2026-03-27T13:00:00.000Z"
      },
      {
        label: "Grant paused",
        detail: "Reviewer paused the release until stronger evidence is provided.",
        createdAt: "2026-03-27T15:40:00.000Z"
      }
    ]
  }
} as const;
