# Contributing to Stoneale Contract Deployment

Thanks for helping build Stoneale on Stellar!

## Picking an issue

Issues are labelled `complexity: trivial`, `complexity: medium` or `complexity: high`. Comment on an issue to have it assigned to you before you start. If you've had no activity on an assigned issue for 7 days, it may be reassigned.

## Before opening a PR

```bash
shellcheck scripts/*.sh
node scripts/validate-badges.mjs
```

If you change `deploy.sh` or `smoke-test.sh`, also run them against testnet with a throwaway identity:

```bash
SOURCE=my-test-admin OUT=deployments/local.json scripts/deploy.sh
SOURCE=my-test-admin scripts/smoke-test.sh deployments/local.json
```

CI does the same on every PR, with a fresh deployment each time.

## Guidelines

- Scripts must be **idempotent where possible** and **fail loudly** (`set -euo pipefail`, with clear error messages).
- **Never commit secret keys** or `.env` files. Use Stellar CLI identities (`--source <name>`).
- Badge metadata must never contain personal or health data.
- Don't change `legacy-evm/`: it's archived.
- Use [Conventional Commits](https://www.conventionalcommits.org), with one issue per PR (`Closes #N`).

## Security

Report vulnerabilities privately to **security@stoneale.com**.
