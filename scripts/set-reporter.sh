#!/usr/bin/env bash
# Rotate the game-server key that may sign award() and mint badges.
# Usage: scripts/set-reporter.sh <NEW_REPORTER_G_ADDRESS> [deployments/testnet.json]
set -euo pipefail
cd "$(dirname "$0")/.."

NEW=${1:?usage: set-reporter.sh <G...> [deployment.json]}
FILE=${2:-deployments/testnet.json}
SOURCE=${SOURCE:-stoneale-admin}
field() { node -e "const d=require('./$FILE'); console.log($1)"; }
net=(--network "$(field d.network)")
REWARDS=$(field d.rewardsContractId)
BADGES=$(field d.badgesContractId)
OLD=$(field d.reporter)

stellar contract invoke --id "$REWARDS" --source "$SOURCE" "${net[@]}" -- set_reporter --reporter "$NEW" >/dev/null
stellar contract invoke --id "$BADGES" --source "$SOURCE" "${net[@]}" -- set_minter --minter "$NEW" --enabled true >/dev/null
if [[ "$OLD" != "$NEW" ]]; then
  stellar contract invoke --id "$BADGES" --source "$SOURCE" "${net[@]}" -- set_minter --minter "$OLD" --enabled false >/dev/null
fi
node -e "const f='./$FILE',d=require(f);d.reporter='$NEW';require('fs').writeFileSync(f,JSON.stringify(d,null,2)+'\n')"
echo "Reporter rotated: $OLD → $NEW"
