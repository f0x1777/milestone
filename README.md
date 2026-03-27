# Milestone

Milestone is a conditional grant disbursement platform built on the Stellar network. Instead of releasing sponsorship funds as a single transfer, Milestone turns each grant into a controlled flow of deposit, evidence, review, partial release, pause, and audit.

The goal is simple: sponsors should be able to fund outcomes, not promises. Beneficiaries should know what they need to deliver. Reviewers should be able to justify every release. The public should be able to inspect a safe transparency trail without exposing private evidence.

This repository already contains the product foundation: the web application, the Soroban contract boundary, the Supabase schema, and the documentation needed to evaluate the design and keep building quickly.

## What Milestone Does

- Creates grants with a sponsor, reviewer, beneficiary, amount, and operating rules.
- Stores milestone evidence, notes, and supporting files offchain.
- Records reviewer decisions and release rationale with an auditable trail.
- Uses Soroban to model grant custody, release control, pause/resume, and reclaim flows.
- Exposes a public transparency view with safe grant metadata and release progress.

## Business Logic

Milestone follows a role-based flow:

1. A sponsor creates a grant and commits funds.
2. A beneficiary submits an evidence pack for a milestone or review window.
3. A reviewer evaluates the evidence and either approves a partial release, pauses the grant, or requests changes.
4. Milestone records the decision offchain and anchors the critical state transition onchain.
5. The sponsor and public can inspect the timeline of funding, evidence, decisions, and releases.

Core business rules:

- Funds should not be released in full up front.
- Every release should be tied to evidence and a reviewer decision.
- A risky or incomplete delivery should be pausable without losing auditability.
- Unused funds should remain recoverable by the sponsor at the end of the grant.

## Why Stellar

- `Soroban` is used to model the grant vault lifecycle and the release controls.
- `Stellar wallets` provide a direct signature path for sponsor and reviewer actions.
- `Stellar testnet` is the current execution environment while the product flow is being finalized.

Milestone is based on Stellar because the product needs transparent, low-friction financial state transitions rather than a generic CRUD-only backend.

## Current Product Status

Already implemented:

- Next.js product shell with landing page, dashboard, auth entry, and transparency view.
- Freighter-first wallet entry plus a generic fallback demo login.
- Soroban contract scaffold with grant lifecycle rules and automated Rust tests.
- Supabase schema for grants, milestones, evidence, evaluations, releases, pauses, and audit events.
- Documentation for storage conventions, delegated GitHub evidence workflow, and technical roadmap.

Still pending for the full demo:

- Replace mock app data with real Supabase reads and writes.
- Deploy the Soroban contract to Stellar testnet and wire the UI to it.
- Execute real wallet-backed grant creation, funding, release, and pause flows.
- Add the delegated GitHub evidence ingestion path beyond documentation.
- Publish the hosted demo, video, deck, and validation artifacts.

## Quick Review Path

If you are evaluating the project, the fastest order is:

1. Read this file for the product story and the honest implementation status.
2. Review the contract scope in [`/Users/nico/Projects-personal/milestone/contracts/milestone-vault/README.md`](/Users/nico/Projects-personal/milestone/contracts/milestone-vault/README.md).
3. Review current architecture and pending work in [`/Users/nico/Projects-personal/milestone/docs/architecture.md`](/Users/nico/Projects-personal/milestone/docs/architecture.md), [`/Users/nico/Projects-personal/milestone/docs/status.md`](/Users/nico/Projects-personal/milestone/docs/status.md), and [`/Users/nico/Projects-personal/milestone/docs/roadmap.md`](/Users/nico/Projects-personal/milestone/docs/roadmap.md).
4. Inspect the current web shell in [`/Users/nico/Projects-personal/milestone/apps/web`](/Users/nico/Projects-personal/milestone/apps/web) and the database model in [`/Users/nico/Projects-personal/milestone/supabase`](/Users/nico/Projects-personal/milestone/supabase).

## Workspace

- `apps/web`: Next.js App Router UI, wallet entry point, generic fallback login, and transparency views
- `contracts/milestone-vault`: Soroban contract for grant custody and release state
- `supabase`: Postgres schema, seed, storage conventions, and evidence workflow
- `docs`: architecture, status, and execution plan

## How To Run

Prerequisites:

- Node.js `22.18.0` or newer
- `pnpm 10.32.1` or newer

1. Copy `.env.example` to `.env` and `apps/web/.env.example` to `apps/web/.env.local`.
2. Install dependencies with `pnpm install`.
3. Run the web app with `pnpm web:dev`.
4. Validate the repo with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm contract:test`.

## What Is Real Today

- Stellar testnet only.
- The contract logic and tests are real Rust/Soroban code.
- The database schema and storage model are real and ready to wire.
- The web experience currently mixes real structure with mock data to keep iteration speed high.
- Wallet connection is the primary access path, with a generic fallback login still present for demo continuity.

## Evaluation Notes

- GitHub evidence ingestion is designed, but not automated yet.
- Supabase Auth is intentionally deferred. The current iteration uses web-level sessions to keep the flow moving.
- The public page should only expose grant-safe fields through views and APIs.
- The cleanest next demo slice is: create grant, attach evidence, reviewer decision, partial release, and transparency update.

## Docs

- [`/Users/nico/Projects-personal/milestone/docs/architecture.md`](/Users/nico/Projects-personal/milestone/docs/architecture.md)
- [`/Users/nico/Projects-personal/milestone/docs/status.md`](/Users/nico/Projects-personal/milestone/docs/status.md)
- [`/Users/nico/Projects-personal/milestone/docs/roadmap.md`](/Users/nico/Projects-personal/milestone/docs/roadmap.md)
- [`/Users/nico/Projects-personal/milestone/supabase/README.md`](/Users/nico/Projects-personal/milestone/supabase/README.md)
- [`/Users/nico/Projects-personal/milestone/supabase/storage.md`](/Users/nico/Projects-personal/milestone/supabase/storage.md)
