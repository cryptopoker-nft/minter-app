#!/usr/bin/env bash
# End-to-end check of a deployment: a fresh player gets STONE and a badge,
# and duplicate claims are rejected. Testnet only (uses Friendbot).
#
# Usage: scripts/smoke-test.sh [deployments/testnet.json]
set -euo pipefail
cd "$(dirname "$0")/.."

FILE=${1:-deployments/testnet.json}
SOURCE=${SOURCE:-stoneale-admin}   # must be the reporter (and badge minter)
field() { node -e "const d=require('./$FILE'); console.log($1)"; }

NETWORK=$(field d.network)
[[ "$NETWORK" == "testnet" ]] || { echo "smoke test only runs on testnet" >&2; exit 1; }
net=(--network testnet)
ISSUER=$(field d.stone.issuer)
STONE=$(field d.stone.contractId)
REWARDS=$(field d.rewardsContractId)
BADGES=$(field d.badgesContractId)
REPORTER=$(stellar keys address "$SOURCE")
fail() { echo "❌ $*" >&2; exit 1; }

PLAYER_ID="smoke-player-$RANDOM"
stellar keys generate "$PLAYER_ID" "${net[@]}" --fund >/dev/null
PLAYER=$(stellar keys address "$PLAYER_ID")
echo "player: $PLAYER"

echo "1. trustline to STONE"
stellar tx new change-trust --line "STONE:$ISSUER" --source "$PLAYER_ID" "${net[@]}" >/dev/null

echo "2. award 5 STONE"
stellar contract invoke --id "$REWARDS" --source "$SOURCE" "${net[@]}" -- \
  award --player "$PLAYER" --achievement smoke_test --amount 50000000 >/dev/null
BAL=$(stellar contract invoke --id "$STONE" --source "$SOURCE" "${net[@]}" --send=no -- balance --id "$PLAYER" | tr -d '"')
[[ "$BAL" == "50000000" ]] || fail "balance $BAL, expected 50000000"
EARNED=$(stellar contract invoke --id "$REWARDS" --source "$SOURCE" "${net[@]}" --send=no -- total_earned --player "$PLAYER" | tr -d '"')
[[ "$EARNED" == "50000000" ]] || fail "total_earned $EARNED"

echo "3. duplicate claim is rejected"
if stellar contract invoke --id "$REWARDS" --source "$SOURCE" "${net[@]}" -- \
     award --player "$PLAYER" --achievement smoke_test --amount 1 >/dev/null 2>&1; then
  fail "duplicate award succeeded"
fi

echo "4. mint badge"
TOKEN=$(stellar contract invoke --id "$BADGES" --source "$SOURCE" "${net[@]}" -- \
  mint --minter "$REPORTER" --to "$PLAYER" --badge_type 1 | tail -1)
OWNED=$(stellar contract invoke --id "$BADGES" --source "$SOURCE" "${net[@]}" --send=no -- badges_of --owner "$PLAYER" | tr -d ' ')
[[ "$OWNED" == "[$TOKEN]" ]] || fail "badges_of $OWNED, expected [$TOKEN]"

stellar keys rm "$PLAYER_ID" >/dev/null 2>&1 || true
echo "✅ smoke test passed: 5 STONE + badge #$TOKEN to $PLAYER"
