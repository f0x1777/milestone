# Storage and Evidence Notes

Milestone should treat evidence as a first-class operational artifact, not as a loose upload bucket.

## Buckets

- `milestone-evidence-private`
  - Private bucket for screenshots, PDFs, logs, exported reports, and supporting files.
  - Access should be limited to authenticated app users and service-role workflows.
- `milestone-public-assets`
  - Public bucket for deck screenshots, static transparency images, and marketing material.
  - Keep this bucket intentionally narrow.

## Path Convention

Use deterministic paths so every evidence item can be traced from the UI and audit log.

- `grants/{grant_id}/milestones/{milestone_id}/packs/{evidence_pack_id}/{filename}`
- `grants/{grant_id}/audit/{event_hash}/{filename}`
- `public/{asset_name}/{filename}`

## Evidence Workflow

1. A beneficiary creates or updates an `evidence_pack`.
2. Files are uploaded to the private bucket and linked through `evidence_files`.
3. The pack stores URLs for GitHub, docs, demo, and optional test execution references.
4. The evaluation step generates a score, suggested release amount, and decision hash.
5. The release record is written only after the reviewer approves or adjusts the amount.
6. The UI should present the evidence pack, its files, the evaluation outcome, and the onchain transaction in one timeline.

## Delegated GitHub Access

Milestone should not require the beneficiary to grant direct repository write access to the platform.

- Use a delegated service account or bot account with read access to the repository.
- Test execution can be run from that delegated account or from a CI workflow connected to the repository later.
- Store only the reference metadata in Milestone: repo URL, branch, commit hash, run URL, and resulting evidence hash.

## Future Auth Alignment

When Supabase Auth is introduced later:

- map wallet ownership to `wallet_accounts`
- map email/password users to `users`
- keep file access policy tied to grant membership and role, not to public visibility alone

