#!/usr/bin/env bash

set -euo pipefail
shopt -s nullglob

tempfile=.temp-github-review.diff
trap "rm -f $tempfile" EXIT

usage() {
    cat <<EOF
This script verifies the deployed contracts on a chain ID for a given PR.

USAGE
    bash ./bin/github-review.sh <PR>

ARGUMENTS
    PR          The GitHub PR number

EXAMPLES
    bash ./bin/github-review.sh 123
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

if [[ "$#" -ne 1 ]]; then
    echo "ERROR: Invalid number of arguments" 1>&2
    usage
    exit 1
fi
if ! [[ $1 =~ ^[0-9]+$ ]]; then
    echo "ERROR: $1 is not a valid GitHub PR number" 1>&2
    exit 1
fi
pr=$1
chainid="$(gh pr view $pr | sed -nE 's/^- Chain_ID: ([0-9]+).*$/\1/p')"
if [[ -z $chainid ]]; then
    echo "ERROR: Chain ID not specified as per the PR Template" 1>&2
    exit 1
fi
rpc="$(gh pr view $pr | sed -nE 's|^- RPC_URL: (https?://[^ ]+).*$|\1|p')"
if [[ -z $rpc ]]; then
    echo "ERROR: RPC not specified as per the PR Template" 1>&2
    exit 1
fi
version="$(gh pr diff $pr --name-only | sed -nE 's|^src/assets/v([0-9\.]*)/.*$|\1|p' | sort -u)"
if [[ "$(echo "$version" | wc -w)" -ne 1 ]]; then
    echo "ERROR: Exactly one version must be added per PR" 1>&2
    exit 1
fi
versionFiles=(src/assets/v$version/*.json)
if [[ ${#versionFiles[@]} -eq 0 ]]; then
    echo "ERROR: Version $version doesn't exist" 1>&2
    exit 1
fi

# Fetching PR and checking if other files are changed or not.
echo "Checking changes to other files"
if [[ -n "$(gh pr diff $pr --name-only | grep -v -e 'src/assets/v'$version'/.*\.json')" ]]; then
    echo "ERROR: PR contains changes in files other than src/assets/v$version/*.json" 1>&2
    echo "Changed files:"
    echo "$(gh pr diff $pr --name-only | grep -v -e 'src/assets/v'$version'/.*\.json')" 1>&2
    exit 1
fi

echo "Checking changes to assets files"
gh pr diff $pr > .temp-github-review.diff # This line fetches the diff output of the PR
npm run review:diff -s -- --diffPatchFileName .temp-github-review.diff --verbose

# Assume that if `GITHUB_HEAD_REF` is set, then we are running in CI and have already checked out
# the deployment files, otherwise apply the patch on top of the current branch.
if [[ -z "$GITHUB_HEAD_REF" ]]; then
    gh pr diff $pr --patch | git apply --include 'src/assets/v'$version'/**' --verbose
fi

echo "Verifying Deployment Asset"
npm run review:verify-deployment -s -- --version "v$version" --chainId "$chainid" --rpc "$rpc" --verbose
echo "Network addresses & Code hashes are correct"

git restore --ignore-unmerged -- src/assets

# NOTE/TODO
# - We should still manually verify there is no removal of deployment types for a single chain.
# - Getting the RPC from the Chainlist website instead of looking based on the provided RPC: https://github.com/safe-global/safe-deployments/pull/683#discussion_r1668555849
