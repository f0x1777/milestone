# Milestone

Milestone is a grant execution platform on Stellar testnet. The current repository is set up as a professional base that can keep moving in short iterations: Next.js web app, Soroban contract, Supabase schema, storage conventions, CI, and demo-friendly auth.

## Workspace

- `apps/web`: Next.js App Router UI and mock auth flow
- `contracts/milestone-vault`: Soroban contract base for grant state and releases
- `supabase`: schema, seed and storage notes
- `docs`: architecture and roadmap

## Quick Start

1. Copy `.env.example` to `.env` and `apps/web/.env.example` to `apps/web/.env.local`.
2. Install dependencies with `pnpm install`.
3. Start the web app with `pnpm web:dev`.
4. Run web checks with `pnpm lint`, `pnpm typecheck`.
5. Run the contract test suite with `pnpm contract:test`.

## Demo Auth

- Generic credentials:
  - email: `team@milestone.app`
  - password: `milestone-demo`
- Wallet placeholders:
  - `Freighter`
  - `Beexo`

## Current Scope

- Stellar testnet only
- wallet login placeholder plus hardcoded credentials
- public transparency route
- Supabase schema for grants, milestones, evidence, releases and audit
- Soroban contract for grant lifecycle state

## Important Notes

- GitHub evidence automation is not wired yet. The current workflow assumes delegated repository access to a Milestone-controlled service account and stores only metadata references.
- The contract tracks grant state and release accounting today; token movement is the next onchain step.
- Supabase Auth is intentionally deferred. The first iteration uses web-level sessions so the team can move fast without locking the final auth model too early.

## Key Docs

- [`/Users/nico/Projects-personal/milestone/docs/architecture.md`](/Users/nico/Projects-personal/milestone/docs/architecture.md)
- [`/Users/nico/Projects-personal/milestone/docs/roadmap.md`](/Users/nico/Projects-personal/milestone/docs/roadmap.md)
- [`/Users/nico/Projects-personal/milestone/supabase/README.md`](/Users/nico/Projects-personal/milestone/supabase/README.md)
- [`/Users/nico/Projects-personal/milestone/contracts/milestone-vault/README.md`](/Users/nico/Projects-personal/milestone/contracts/milestone-vault/README.md)
