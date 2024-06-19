#!/usr/bin/env bash

set -euo pipefail

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

pr=0
chainid=0
rpc=0
version=""
availableVersion=("1.3.0" "1.4.1")
case $# in
    4)
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
        chainid="$(cast chain-id --rpc-url $3)"
        if [[ $chainid != $2 ]]; then
            echo "ERROR: RPC $3 doesn't match chain ID $2" 1>&2
            usage
            exit 1
        fi
        rpc=$3
        if [[ ! " ${availableVersion[@]} " =~ " ${4} " ]]; then
            echo "ERROR: $4 is not a valid version" 1>&2
            usage
            exit 1
        fi
        version=$4
        ;;
    *)
        usage
        exit 1
        ;;
esac

echo "Verifying Deployment Asset"
gh checkout $pr --detach
commitHash=$(git rev-parse HEAD)
git checkout -q main
git checkout -q $commitHash -- src/assets/v$version

# Getting default addresses
versionFiles=()

if [[ $version == "1.3.0" ]]; then
    versionFiles=("compatibility_fallback_handler"
        "create_call" "gnosis_safe_l2" "gnosis_safe" "multi_send_call_only" "multi_send" "proxy_factory" "sign_message_lib" "simulate_tx_accessor")
elif [[ $version == "1.4.1" ]]; then
    versionFiles=("compatibility_fallback_handler" "create_call" "multi_send_call_only" "multi_send" "safe_l2" "safe_proxy_factory" "safe" "sign_message_lib" "simulate_tx_accessor")
fi

# Getting default addresses, address on the chain and comparing the values.
versionAddressesCI=()
for file in "${versionFiles[@]}"; do
    address=$(jq -r '.defaultAddress' "src/assets/v$version/$file.json")
    addressCI=$(jq -r --arg c "$chainid" '.networkAddresses[$c]' "src/assets/v$version/$file.json")
    if [[ $address != $addressCI ]]; then
        echo "ERROR: "$file" default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    versionAddressesCI+=($addressCI)
done

echo "Network addresses are correct"

# Code Hash of the default addresses (Chain ID: 1)
# cast keccak $(cast code contractAddress --rpc-url https://rpc.ankr.com/eth)

oneThreeZeroContracts=("CompatibilityFallbackHandler" "CreateCall" "GnosisSafeL2" "GnosisSafe" "MultiSendCallOnly" "MultiSend" "ProxyFactory" "SignMessageLib" "SimulateTxAccessor")
oneFourOneContracts=("CompatibilityFallbackHandler" "CreateCall" "MultiSendCallOnly" "MultiSend" "SafeL2" "SafeProxyFactory" "Safe" "SignMessageLib" "SimulateTxAccessor")
versionContracts=()
if [[ $version == "1.3.0" ]]; then
    versionContracts=("${oneThreeZeroContracts[@]}")
elif [[ $version == "1.4.1" ]]; then
    versionContracts=("${oneFourOneContracts[@]}")
fi

versionCodeHashes=()
for contract in "${versionContracts[@]}"; do
    versionCodeHashes+=($(jq -r --arg v "$version" --arg c "$contract" '.[$v].[$c]' src/assets/code-hashes.json))
done

# Now getting the codehash (keccak of bytecode) for the default addresses created for that chain id
echo "Fetching codehashes from the chain"

versionCodeHashesCI=()
for i in {0..8}; do
    versionCodeHashesCI+=($(cast keccak $(cast code ${versionAddressesCI[$i]} --rpc-url $rpc)))
done

# Checking codehashes
for i in {0..8}; do
    if [[ ${versionCodeHashes[$i]} != ${versionCodeHashesCI[$i]} ]]; then
        echo "ERROR: "${versionContracts[$i]}" code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
done

echo "Code hashes are correct"

git restore --ignore-unmerged -- src/assets

# NOTE/TODO
# - We should still manually verify there is no extra code in the PR.
# - We could fetch the version, chain id and rpc from the PR (needs a standard format and possibly a tag in PR).
# - We can approve PR using Github CLI. Should only be added after all manual tasks can be automated.
