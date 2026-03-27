# Supabase Base for Milestone

This folder defines the database and storage contract for the Stellar Hackathon iteration of Milestone.

## Structure

- `migrations/` contains the initial Postgres schema.
- `seed.sql` provides demo data for the public transparency view.
- `storage.md` documents bucket usage, naming conventions, and evidence workflow.

## Assumptions

- Milestone starts on Stellar testnet only.
- Authentication is intentionally lightweight in the first iteration.
- Wallet-based login and a generic hardcoded user/password flow live in the web app first, not in Supabase Auth.
- GitHub integration is deferred, but the evidence model already accepts delegated repository access and test outputs later.

## Operational Notes

- The schema is optimized for a demo that needs public transparency and private evidence handling.
- Do not treat the current schema as final auth architecture.
- Keep onchain identity and offchain identity separate. The contract should remain the source of truth for funds and release state.
- The next DB step is not redesign; it is wiring the web app to the existing tables and views.
