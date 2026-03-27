# Milestone Roadmap

This roadmap is focused on getting Milestone from scaffold to a convincing product demo on Stellar testnet. The priority is not feature breadth; it is an end-to-end story that judges, sponsors, and technical reviewers can all understand quickly.

## Immediate Priorities

1. Wire the existing schema into the web app so grants can be read from Supabase.
2. Implement a real `create_grant` slice that persists data and renders in the dashboard and transparency view.
3. Deploy the Soroban contract to Stellar testnet and connect the contract ID to the app.
4. Replace mock dashboard actions with wallet-backed release and pause flows.
5. Prepare the demo dataset, validation notes, and pitch support materials.

## Immediate Build Slice

- Create grant
- Register sponsor, reviewer, and beneficiary
- Store grant metadata in Postgres
- Show a public grant view
- Support private evidence uploads

## Next Build Slice

- Track evidence packs per milestone window
- Score evidence with a simple policy engine
- Record reviewer decisions and override reasons
- Persist release attempts and transaction hashes

## Testnet Integration Slice

The contract rules already exist locally. This slice is about deploying them to Stellar testnet and wiring the app to the real contract state and actions.

- Wire the Soroban vault contract
- Execute release and pause actions from the dashboard
- Reflect onchain state in the UI
- Add a timeline for grants, evidence, and releases

## Later Product Slice

- Add delegated GitHub access for evidence collection
- Replace hardcoded auth with real auth later
- Harden storage policies and public views
- Add scoring automation once the manual review flow is stable

## Submission Slice

- Publish the hosted demo
- Record the video and pitch
- Package the deck and validation evidence
- Dry-run the live flow against seeded or real testnet data

## Definition of Done For The Current Iteration

- A grant can be created and viewed.
- Evidence can be uploaded and tied to a milestone.
- The reviewer can approve, adjust, or pause.
- The public page can show safe transparency data.
- The repo and demo explain clearly what is real today and what remains stubbed.
