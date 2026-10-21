#!/usr/bin/env bash
# Deploy the full Stoneale reward stack to a Stellar network:
#   1. STONE classic asset + its Stellar Asset Contract (SAC)
#   2. stone-rewards contract (made the only STONE minter)
#   3. wellness-badges contract (reporter registered as badge minter)
# Writes deployments/<network>.json.
#
# Usage:  scripts/deploy.sh                  # testnet, identity "stoneale-admin"
#         NETWORK=testnet SOURCE=my-key WASM_DIR=path/to/wasm scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

NETWORK=${NETWORK:-testnet}
SOURCE=${SOURCE:-stoneale-admin}                 # stellar CLI identity: admin + STONE issuer
WASM_DIR=${WASM_DIR:-../stoneale-contracts/target/wasm32v1-none/release}
DAILY_CAP=${DAILY_CAP:-10000000000}              # 1,000 STONE per player per day (stroops)
BADGE_BASE_URI=${BADGE_BASE_URI:-https://stoneale.com/badges/}
OUT=${OUT:-deployments/$NETWORK.json}

net=(--network "$NETWORK")
log() { printf '\n\033[1;35m▶ %s\033[0m\n' "$*"; }

for wasm in stone_rewards wellness_badges; do
  [[ -f "$WASM_DIR/$wasm.wasm" ]] || { echo "Missing $WASM_DIR/$wasm.wasm. Build stoneale-contracts first (stellar contract build)." >&2; exit 1; }
done

log "Admin identity: $SOURCE"
if ! stellar keys address "$SOURCE" >/dev/null 2>&1; then
  if [[ "$NETWORK" == "testnet" ]]; then
    stellar keys generate "$SOURCE" "${net[@]}" --fund
  else
    echo "Identity $SOURCE not found. Create it with: stellar keys add $SOURCE" >&2; exit 1
  fi
fi
ADMIN=$(stellar keys address "$SOURCE")
REPORTER=${REPORTER:-$ADMIN}                    # game server key that signs award()
echo "admin/issuer: $ADMIN"
echo "reporter:     $REPORTER"

log "STONE asset contract"
stellar contract asset deploy --asset "STONE:$ADMIN" --source "$SOURCE" "${net[@]}" >/dev/null 2>&1 || echo "(already deployed)"
STONE=$(stellar contract id asset --asset "STONE:$ADMIN" "${net[@]}")
echo "STONE SAC: $STONE"

log "stone-rewards"
REWARDS=$(stellar contract deploy --wasm "$WASM_DIR/stone_rewards.wasm" --source "$SOURCE" "${net[@]}" -- \
  --admin "$ADMIN" --reporter "$REPORTER" --token "$STONE" --daily_cap "$DAILY_CAP" | tail -1)
echo "rewards: $REWARDS"

log "Make stone-rewards the only STONE minter"
stellar contract invoke --id "$STONE" --source "$SOURCE" "${net[@]}" -- set_admin --new_admin "$REWARDS" >/dev/null

log "wellness-badges"
BADGES=$(stellar contract deploy --wasm "$WASM_DIR/wellness_badges.wasm" --source "$SOURCE" "${net[@]}" -- \
  --admin "$ADMIN" --name "Stoneale Wellness Badges" --symbol STNB --base_uri "$BADGE_BASE_URI" | tail -1)
echo "badges: $BADGES"
stellar contract invoke --id "$BADGES" --source "$SOURCE" "${net[@]}" -- set_minter --minter "$REPORTER" --enabled true >/dev/null

mkdir -p "$(dirname "$OUT")"
cat > "$OUT" <<EOF
{
  "network": "$NETWORK",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "admin": "$ADMIN",
  "reporter": "$REPORTER",
  "stone": { "code": "STONE", "issuer": "$ADMIN", "contractId": "$STONE" },
  "rewardsContractId": "$REWARDS",
  "badgesContractId": "$BADGES",
  "dailyCapStroops": "$DAILY_CAP",
  "badgeBaseUri": "$BADGE_BASE_URI"
}
EOF
log "Done → $OUT"
cat "$OUT"
