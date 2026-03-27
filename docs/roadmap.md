# Milestone Roadmap

This roadmap is tuned for the Stellar Hackathon. The immediate goal is not feature breadth; it is a demo that shows wallet login, a Soroban-backed grant flow, a public audit trail, and the materials needed for submission.

## Next 2 Hours

1. Lock the narrative and labels across the repo: Stellar first, Soroban mandatory, wallet login plus fallback credentials.
2. Validate the schema and seed against the app flow so a grant can be created and rendered end to end.
3. Connect the UI to the public grant view model and make the transparency route submission-safe.
4. Draft or tighten the Soroban contract interface so the app and DB share the same nouns.
5. Prepare the demo dataset, validation notes, pitch outline, and deck skeleton.

## First Build Slice

- Create grant
- Register sponsor, reviewer, and beneficiary
- Store grant metadata in Postgres
- Show a public grant view
- Support private evidence uploads

## Second Build Slice

- Track evidence packs per milestone window
- Score evidence with a simple policy engine
- Record reviewer decisions and override reasons
- Persist release attempts and transaction hashes

## Third Build Slice

- Wire the Soroban vault contract
- Execute release and pause actions from the dashboard
- Reflect onchain state in the UI
- Add a timeline for grants, evidence, and releases

## Submission Slice

- Add delegated GitHub access for evidence collection
- Replace hardcoded auth with real auth later, not now
- Harden storage policies and public views
- Record the demo video and pitch

## Definition of Done

- A grant can be created and viewed.
- Evidence can be uploaded and tied to a milestone.
- The reviewer can approve, adjust, or pause.
- The public page can show safe transparency data.
- The repo contains the deck, video plan, validation evidence, and a clean submission story.
