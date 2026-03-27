# milestone-vault

Soroban contract base for Milestone.

## Scope

- `create_grant`
- `fund_grant`
- `assign_beneficiary`
- `record_decision_hash`
- `release_partial`
- `pause_grant`
- `resume_grant`
- `reclaim_unused`
- `get_grant`
- `get_grant_summary`

## Model

- `sponsor` funds and can reclaim unused balance.
- `reviewer` records decisions and executes partial releases.
- `beneficiary` is the target of releases once assigned.
- `GrantStatus` tracks `Draft`, `Active`, `Paused`, and `Closed`.
- `GrantSummary` is the lighter read model for dashboards and auditors.

## Notes

- This crate is intentionally minimal and does not move tokens yet.
- Amounts are tracked in contract state to keep the MVP fast to iterate.
- The contract is ready to be extended with token transfers and richer policy logic.
- The current version adds a basic guard against sponsor and reviewer being the same account.

## Testnet Flow

The recommended path is:

1. Build and test locally with `cargo test`.
2. Build the contract Wasm with `stellar contract build`.
3. Deploy to testnet with `stellar contract deploy`.
4. Copy the returned contract ID into the app env when wiring the UI.

Example environment:

```bash
cp .env.example .env
export STELLAR_SOURCE_ACCOUNT=GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
./scripts/build.sh
./scripts/deploy-testnet.sh
```

## Test

```bash
cargo test
```

## Scripts

- `scripts/build.sh`: runs tests and builds the Wasm artifact.
- `scripts/deploy-testnet.sh`: builds and deploys to Stellar testnet.
- `scripts/check.sh`: quick local verification entrypoint.
