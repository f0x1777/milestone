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

## Model

- `sponsor` funds and can reclaim unused balance.
- `reviewer` records decisions and executes partial releases.
- `beneficiary` is the target of releases once assigned.
- `GrantStatus` tracks `Draft`, `Active`, `Paused`, and `Closed`.

## Notes

- This crate is intentionally minimal and does not move tokens yet.
- Amounts are tracked in contract state to keep the MVP fast to iterate.
- The contract is ready to be extended with token transfers and richer policy logic.

## Test

```bash
cargo test
```
