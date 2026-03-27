# Milestone

Milestone is a Stellar Hackathon project for controlled grant distribution. The product turns sponsorship funding into a visible flow of deposit, evidence, reviewer decision, partial release, pause, and audit. The repo already contains the base app, Soroban contract, and Supabase schema needed to keep iterating fast.

## Workspace

- `apps/web`: Next.js App Router UI, wallet entry point, generic fallback login, and transparency views
- `contracts/milestone-vault`: Soroban contract for grant custody and release state
- `supabase`: Postgres schema, seed, storage conventions, and evidence workflow
- `docs`: architecture and execution plan for the hackathon

## How To Run

Prerequisites:

- Node.js `22.18.0` or newer
- `pnpm 10.32.1` or newer

1. Copy `.env.example` to `.env` and `apps/web/.env.example` to `apps/web/.env.local`.
2. Install dependencies with `pnpm install`.
3. Run the web app with `pnpm web:dev`.
4. Validate the repo with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm contract:test`.

## Hackathon Scope

- Stellar testnet only.
- Soroban is mandatory for the onchain proof.
- Wallet connection is the primary login path, with a generic hardcoded user/password fallback for demo speed.
- The deliverable set is repo, demo link, video pitch, deck, and validation evidence.

## What Is Important

- GitHub evidence is not automated yet; the workflow is defined so delegated repository access can be added later without redesigning the data model.
- Supabase Auth is intentionally deferred. The first iteration uses web-level sessions so the team can move quickly.
- The public page should only expose grant-safe fields through views and APIs.

## Docs

- [`/Users/nico/Projects-personal/milestone/docs/architecture.md`](/Users/nico/Projects-personal/milestone/docs/architecture.md)
- [`/Users/nico/Projects-personal/milestone/docs/roadmap.md`](/Users/nico/Projects-personal/milestone/docs/roadmap.md)
- [`/Users/nico/Projects-personal/milestone/supabase/README.md`](/Users/nico/Projects-personal/milestone/supabase/README.md)
- [`/Users/nico/Projects-personal/milestone/supabase/storage.md`](/Users/nico/Projects-personal/milestone/supabase/storage.md)
