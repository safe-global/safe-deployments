#!/usr/bin/env bash

set -euo pipefail
shopt -s nullglob

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
if ! command -v cast &> /dev/null; then
    echo "ERROR: Please install the 'cast' tool included in the Foundry toolset" 1>&2
    exit 1
fi

if [[ "$#" -ne 1 ]]; then
    usage
    exit 1
fi
if ! [[ $1 =~ ^[0-9]+$ ]]; then
    echo "ERROR: $1 is not a valid GitHub PR number" 1>&2
    usage
    exit 1
fi
pr=$1
prChainID="$(gh pr view $pr | sed -nE 's/^- Chain_ID: ([0-9]+).*$/\1/p')"
if ! [[ $prChainID =~ ^[0-9]+$ ]]; then
    echo "ERROR: $prChainID is not a valid Chain ID number" 1>&2
    usage
    exit 1
fi
chainlistURL="https://chainlist.org/chain/$prChainID"
if ! curl --fail -s -o /dev/null "$chainlistURL"; then
    echo "ERROR: Chainlist URL $chainlistURL doesn't exist" 1>&2
    usage
    exit 1
fi
rpc="$(gh pr view $pr | sed -nE 's/^- RPC_URL: (https?:\/\/[^ ]+).*$/\1/p')"
chainid="$(cast chain-id --rpc-url "$rpc")"
if [[ $chainid != $prChainID ]]; then
    echo "ERROR: RPC $rpc doesn't match chain ID $prChainID" 1>&2
    usage
    exit 1
fi
version="$(gh pr view $pr | sed -nE 's/^- Contract_Version: (1\.[3-4]\.[0-1]).*$/\1/p')"
versionFiles=(src/assets/v$version/*.json)
if [[ ${#versionFiles[@]} -eq 0 ]]; then
    echo "ERROR: Version $version doesn't exist" 1>&2
    usage
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
fileLineChangeJSON=$(gh pr view $pr --json files) # This line fetches the JSON output of the files changed in the PR
isHighestChainID=0
echo "$fileLineChangeJSON" | jq -r '.files[] | "\(.path) \(.additions) \(.deletions)"' | while read -r line; do
    path=$(echo $line | cut -d ' ' -f1)
    additions=$(echo $line | cut -d ' ' -f2)
    deletions=$(echo $line | cut -d ' ' -f3)

    # Now you can perform checks on $additions and $deletions as per your requirements
    if [[ ("$additions" == 2 && "$deletions" == 1) ]]; then
        isHighestChainID=1
    elif [[ ("$additions" != 1 || "$deletions" != 0) ]]; then
        echo "ERROR: $path has invalid changes" 1>&2
        exit 1
    fi
done

if [[ $isHighestChainID == 1 ]]; then
    echo "Edge case when adding chain with the highest chain id number"
    diffPatchSeparated=($(gh pr diff $pr | grep -E '^[+-] '))
    # Adding three elements at a time together to compare from the output array
    diffPatch=()
    for ((i=0; i<${#diffPatchSeparated[@]}; i+=3)); do
        diffPatch+=("${diffPatchSeparated[i]} ${diffPatchSeparated[i+1]} ${diffPatchSeparated[i+2]}")
    done

    # Initialize a counter
    counter=1
    # Initialize a flag to indicate if the previous pattern was correct
    pattern_correct=true
    # Read input line by line from the array
    for line in "${diffPatch[@]}"; do
        # Determine the line type based on the counter
        case $((counter % 3)) in
            1) # First line should start with '-'
                if [[ $line != -* ]]; then
                    pattern_correct=false
                fi
                # Store the first line to compare with the second line
                first_line="$line"
                ;;
            2) # Second line should be the first line with a comma
                expected_line="+${first_line:1},"
                if [[ $line != $expected_line ]]; then
                    pattern_correct=false
                fi
                ;;
            0) # Third line should start with '+'
                if [[ $line != +* ]]; then
                    pattern_correct=false
                fi
                # Check the pattern for the set of three lines
                if [ "$pattern_correct" = false ]; then
                    echo "Unknown lines added or removed" 1>&2
                    exit 1
                fi
                # Reset the pattern_correct flag for the next set of lines
                pattern_correct=true
                ;;
        esac
        # Increment the counter
        ((counter++))
    done
fi

echo "Verifying Deployment Asset"
gh pr diff $pr --patch | git apply --include 'src/assets/v'$version'/**'

# Getting default addresses, address on the chain and checking code hash.
deploymentTypes=($(jq -r --arg c "$chainid" '[.networkAddresses[$c]] | flatten | .[]' "$versionFiles"))
for file in "${versionFiles[@]}"; do
    for deploymentType in "${deploymentTypes[@]}"; do
        defaultAddress=$(jq -r --arg t "$deploymentType" '.deployments[$t].address' "$file")
        defaultCodeHash=$(jq -r --arg t "$deploymentType" '.deployments[$t].codeHash' "$file")
        networkCodeHash=$(cast code "$defaultAddress" --rpc-url "$rpc" | tr -d '\n' | cast keccak)
        if [[ $defaultCodeHash != $networkCodeHash ]]; then
            echo "ERROR: "$file" ("$defaultAddress") code hash ("$defaultCodeHash") is not the same as the one created for the chain id ("$networkCodeHash")" 1>&2
            exit 1
        fi
    done
done

echo "Network addresses & Code hashes are correct"

git restore --ignore-unmerged -- src/assets

# NOTE/TODO
# - We should still manually verify there is no removal of deployment types for a single chain.
