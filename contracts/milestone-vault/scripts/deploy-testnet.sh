#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTRACT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$CONTRACT_DIR"

: "${STELLAR_SOURCE_ACCOUNT:?Set STELLAR_SOURCE_ACCOUNT to a funded Stellar account.}"
NETWORK="${STELLAR_NETWORK:-testnet}"
WASM_PATH="${WASM_PATH:-target/wasm32v1-none/release/milestone_vault.wasm}"

stellar contract build
stellar contract deploy \
  --source "$STELLAR_SOURCE_ACCOUNT" \
  --network "$NETWORK" \
  --wasm "$WASM_PATH"
