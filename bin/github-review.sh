#!/usr/bin/env bash

set -euo pipefail
shopt -s nullglob

usage() {
    cat <<EOF
This script verifies the deployed contracts on a chain ID for a given PR.

USAGE
    bash ./bin/github-review.sh <PR> <CHAIN_ID> <RPC_URL> <VERSION>

ARGUMENTS
    PR          The GitHub PR number
    CHAIN_ID    The chain ID to verify
    RPC_URL     The RPC URL to use for the chain ID
    VERSION     The version of the contracts to verify

EXAMPLES
    bash ./bin/github-review.sh 123 1 https://rpc.ankr.com/eth 1.3.0
    bash ./bin/github-review.sh 123 1 https://rpc.ankr.com/eth 1.4.1
EOF
}

if [[ -n "$(git status --porcelain)" ]]; then
    echo "ERROR: Dirty Git index, please commit all changes before continuing" 1>&2
    exit 1
fi
if ! command -v gh &> /dev/null; then
    echo "ERROR: Please install the 'gh' GitHub CLI" 1>&2
    exit 1
fi
if ! command -v cast &> /dev/null; then
    echo "ERROR: Please install the 'cast' tool included in the Foundry toolset" 1>&2
    exit 1
fi

if [[ "$#" -ne 4 ]]; then
    usage
    exit 1
fi
if ! [[ $1 =~ ^[0-9]+$ ]]; then
    echo "ERROR: $1 is not a valid GitHub PR number" 1>&2
    usage
    exit 1
fi
pr=$1
if ! [[ $2 =~ ^[0-9]+$ ]]; then
    echo "ERROR: $2 is not a valid Chain ID number" 1>&2
    usage
    exit 1
fi
rpc=$3
chainid="$(cast chain-id --rpc-url $rpc)"
if [[ $chainid != $2 ]]; then
    echo "ERROR: RPC $rpc doesn't match chain ID $2" 1>&2
    usage
    exit 1
fi
version=$4
versionFiles=(src/assets/v$version/*.json)
if [[ ${#versionFiles[@]} -eq 0 ]]; then
    echo "ERROR: Version $version doesn't exist" 1>&2
    usage
    exit 1
fi

echo "Verifying Deployment Asset"
gh pr diff $pr --patch | git apply --include 'src/assets/**'

# Getting default addresses, address on the chain and checking code hash.
for file in "${versionFiles[@]}"; do
    defaultAddress=$(jq -r '.defaultAddress' "$file")
    networkAddress=$(jq -r --arg c "$chainid" '.networkAddresses[$c]' "$file")
    if [[ $defaultAddress != $networkAddress ]]; then
        echo "ERROR: "$file" default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    defaultCodeHash=$(jq -r '.codeHash' "$file")
    networkCodeHash=$(cast keccak $(cast code $networkAddress --rpc-url $rpc))
    if [[ $defaultCodeHash != $networkCodeHash ]]; then
        echo "ERROR: "$file" code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
done

echo "Network addresses & Code hashes are correct"

git restore --ignore-unmerged -- src/assets

# NOTE/TODO
# - We should still manually verify there is no extra code in the PR.
# - We could fetch the version, chain id and rpc from the PR (needs a standard format and possibly a tag in PR).
# - We can approve PR using Github CLI. Should only be added after all manual tasks can be automated.
# - Supporting zkSync and alternative deployment addresses for 1.3.0 contracts.
# - If there are changes in any other path other than src/assets, the script should show an error.
# - We should ensure there are not more than a single chain ID being added in a PR.
