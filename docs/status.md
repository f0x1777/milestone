# Milestone Status

This document separates what is already implemented from what still needs work before Milestone becomes a complete Stellar testnet demo.

## Implemented

- Monorepo workspace with `pnpm`, `turbo`, CI, and local validation scripts.
- Next.js web shell with landing, dashboard, transparency route, auth entry, and API route stubs.
- Freighter-first wallet connection path through Stellar Wallets Kit.
- Generic fallback login for demo continuity while full auth is still deferred.
- Soroban contract model for grant creation, funding, beneficiary assignment, decision anchoring, partial release, pause, resume, and reclaim.
- Rust tests covering the main lifecycle and critical guardrails.
- Supabase schema for users, organizations, wallet accounts, grants, milestones, evidence, evaluations, releases, pause events, and audit events.
- Storage conventions for private evidence and public-safe transparency assets.

## Partially Implemented

- The web app structure exists, but the main screens still read from mock data instead of the database.
- Wallet connection exists, but real signed grant actions are not yet wired through the UI.
- The Soroban contract lifecycle exists, but a deployed testnet contract ID is not yet connected back into the app.
- The public transparency story exists, but it is still driven by seeded or mock data rather than live contract-backed grants.

## Not Implemented Yet

- Real `create_grant`, `fund_grant`, `release_partial`, and `pause_grant` flows from the web app.
- Supabase-backed grant CRUD and evidence submission from the UI.
- Testnet deployment automation with real environment values.
- Delegated GitHub repository access and evidence capture execution.
- Hosted staging/demo URL, deck, video, and validation evidence package.

## Highest-Impact Next Steps

1. Wire the web app to the existing Supabase schema.
2. Deploy the contract to Stellar testnet and store the contract ID in app env.
3. Replace mock dashboard actions with real wallet-backed calls.
4. Connect transparency views to live grant state.
5. Package the demo story and submission assets.
