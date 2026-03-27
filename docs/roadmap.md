# Milestone Roadmap

This roadmap is optimized for a fast iteration loop. The immediate target is a solid base that can be expanded in small steps.

## Next 3 Hours

1. Validate the schema against the intended app flow.
2. Build the Next.js shell with wallet login and generic credentials login.
3. Connect the UI to the public grant view model.
4. Draft the Soroban contract interface so the app and DB share the same nouns.
5. Prepare a minimal demo dataset for public transparency.

## Phase 1

- Create grant
- Register sponsor, reviewer, and beneficiary
- Store grant metadata in Postgres
- Show a public grant view
- Support private evidence uploads

## Phase 2

- Track evidence packs per milestone window
- Score evidence with a simple policy engine
- Record reviewer decisions and override reasons
- Persist release attempts and transaction hashes

## Phase 3

- Wire the Soroban vault contract
- Execute release and pause actions from the dashboard
- Reflect onchain state in the UI
- Add a timeline for grants, evidence, and releases

## Phase 4

- Add delegated GitHub access for evidence collection
- Replace hardcoded auth with real Supabase auth
- Expand wallet provider support if needed
- Harden RLS and storage policies

## Definition of Done for the First Iteration

- A grant can be created and viewed.
- Evidence can be uploaded and tied to a milestone.
- The reviewer can approve, adjust, or pause.
- The public page can show safe transparency data.
- The schema is clean enough to support the Soroban contract without renaming core entities.

