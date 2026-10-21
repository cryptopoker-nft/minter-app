# Stoneale Contract Deployment

**Deployment and operations tooling for [Stoneale](https://github.com/stoneale-games)'s Soroban contracts on Stellar.**

[![CI](https://github.com/stoneale-games/Contract-Deployment/actions/workflows/ci.yml/badge.svg)](https://github.com/stoneale-games/Contract-Deployment/actions/workflows/ci.yml)
[![Built on Stellar](https://img.shields.io/badge/built%20on-Stellar-7D00FF)](https://stellar.org)

With one command this repo stands up Stoneale's whole reward stack on a Stellar network, then verifies it end to end. **CI deploys a brand-new copy to testnet on every PR** and smoke-tests it.

| What | Where |
|---|---|
| Deploy everything | [`scripts/deploy.sh`](scripts/deploy.sh) |
| End-to-end check | [`scripts/smoke-test.sh`](scripts/smoke-test.sh) |
| Rotate the game-server key | [`scripts/set-reporter.sh`](scripts/set-reporter.sh) |
| Badge definitions and art | [`badges/`](badges) |
| Live addresses | [`deployments/testnet.json`](deployments/testnet.json) |

## What gets deployed

```
deploy.sh
 ├─ STONE classic asset + Stellar Asset Contract (issuer = admin)
 ├─ stone-rewards  (admin, reporter, STONE SAC, daily cap)
 │     └─ becomes the SAC admin, so it is the ONLY way to mint STONE
 └─ wellness-badges (admin, name, symbol, base URI)
       └─ reporter registered as badge minter
```

Contract source: [stoneale-contracts](https://github.com/stoneale-games/stoneale-contracts).

## Usage

Prerequisites: the [Stellar CLI](https://developers.stellar.org/docs/tools/cli) (v28+), Node 20+, and built contract WASM.

```bash
# 1. Build the contracts
git clone https://github.com/stoneale-games/stoneale-contracts ../stoneale-contracts
(cd ../stoneale-contracts && stellar contract build)

# 2. Deploy to testnet (creates and funds the "stoneale-admin" identity if missing)
scripts/deploy.sh

# 3. Verify: a fresh player gets 5 STONE and a badge, and duplicates are rejected
scripts/smoke-test.sh deployments/testnet.json
```

Configuration (environment variables):

| Variable | Default | |
|---|---|---|
| `NETWORK` | `testnet` | Stellar CLI network |
| `SOURCE` | `stoneale-admin` | CLI identity used as admin and STONE issuer |
| `REPORTER` | admin address | Game-server key allowed to call `award` and mint badges |
| `DAILY_CAP` | `10000000000` | Maximum stroops per player per day (1,000 STONE) |
| `BADGE_BASE_URI` | `https://stoneale.com/badges/` | Badge metadata location |
| `WASM_DIR` | `../stoneale-contracts/target/wasm32v1-none/release` | Built contracts |
| `OUT` | `deployments/<network>.json` | Output file |

### Rotate the reporter key

The reporter key lives on the game server ([stoneale_backend](https://github.com/stoneale-games/stoneale_backend)). Rotate it if it's exposed, and before mainnet:

```bash
stellar keys generate stoneale-reporter --network testnet --fund
scripts/set-reporter.sh "$(stellar keys address stoneale-reporter)"
```

## Badges

`badges/metadata/<badge_type>.json` follows the common NFT metadata shape (`name`, `description`, `image`, `attributes`), and `badges/img/<badge_type>.svg` is the artwork. Publish the `badges/` folder at the contract's `base_uri`.

| Type | Badge |
|---|---|
| 1 | 30-Day Mood Streak |
| 2 | First Breath |
| 3 | Journal Starter |
| 4 | Calm Week |
| 5 | Kind Words |

`node scripts/validate-badges.mjs` checks every definition. It also rejects attributes that look like personal or health data: badges are public and permanent.

## Legacy

`legacy-evm/` holds the original Ethereum/Polygon "Cryptopoker NFT minter" (2023). It's kept for reference only and is no longer maintained. Stoneale now runs on Stellar.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Report security issues to **security@stoneale.com**.

## License

[MIT](LICENSE)
