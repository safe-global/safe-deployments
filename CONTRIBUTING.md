# Contributing to Safe Deployments

This repository is the canonical registry of Safe smart contract deployments across blockchain networks. Contributing means adding a new chain or deployment type to one of the supported Safe versions.

## Before you open a PR

- **Contracts must already be deployed** on the target chain. If not, follow the deployment instructions in [safe-smart-account](https://github.com/safe-fndn/safe-smart-account) first.
- **Your chain must be listed on [ChainList](https://chainlist.org/).** CI fetches the RPC from there automatically.
- **One chain ID, one Safe version, and one deployment type per PR.** PRs that touch multiple will fail the automated check.
- **Commits must be signed.** Unsigned commits will be blocked at merge time. See [GitHub's guide on signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) if you haven't set this up.

## Adding a new chain

Use the `update-registry` script — it handles JSON structure and chain ID ordering automatically:

```bash
pnpm update-registry --version v1.5.0 --chainId <CHAIN_ID> --deploymentType canonical
```

Valid versions: `v1.0.0`, `v1.1.1`, `v1.2.0`, `v1.3.0`, `v1.4.1`, `v1.5.0`  
Valid deployment types: `canonical`, `eip155`, `zksync`

For `v1.3.0` chains that support both `eip155` and `canonical`, run `eip155` first:

```bash
pnpm update-registry --version v1.3.0-eip155 --chainId <CHAIN_ID>
pnpm update-registry --version v1.3.0-canonical --chainId <CHAIN_ID>
```

This ensures the deployment type order is `["eip155", "canonical"]`. The exception is chains that were already registered with only `canonical` — in that case, `canonical` stays first to preserve backwards compatibility.

## Before pushing

```bash
pnpm install --frozen-lockfile  # Node 22+, pnpm >=10.16.0
pnpm lint:fix                   # Auto-format JSON files
pnpm test                       # Run the full test suite
```

CI will also verify on-chain that every contract address and code hash match the deployed bytecode.

## PR description

Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md) with the chain ID and any relevant notes (block explorer URL, testnet caveats, etc.).

## Release cadence

Merged PRs are batched into a monthly npm release. The `@safe-global/platform` team reviews all PRs.
