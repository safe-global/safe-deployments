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
gh pr diff $pr --patch | git apply --include 'src/assets/**'

# Getting default addresses

# v1.3.0 & v1.4.1
cfh=$(jq -r .defaultAddress src/assets/v$version/compatibility_fallback_handler.json)
cc=$(jq -r .defaultAddress src/assets/v$version/create_call.json)
msco=$(jq -r .defaultAddress src/assets/v$version/multi_send_call_only.json)
ms=$(jq -r .defaultAddress src/assets/v$version/multi_send.json)
sml=$(jq -r .defaultAddress src/assets/v$version/sign_message_lib.json)
sta=$(jq -r .defaultAddress src/assets/v$version/simulate_tx_accessor.json)

# v1.3.0
gsl2=0
gs=0
pf=0
if [[ $version == "1.3.0" ]]; then
    gsl2=$(jq -r .defaultAddress src/assets/v$version/gnosis_safe_l2.json)
    gs=$(jq -r .defaultAddress src/assets/v$version/gnosis_safe.json)
    pf=$(jq -r .defaultAddress src/assets/v$version/proxy_factory.json)
fi

# v1.4.1
sl2=0
spf=0
s=0
if [[ $version == "1.4.1" ]]; then
    sl2=$(jq -r .defaultAddress src/assets/v$version/safe_l2.json)
    spf=$(jq -r .defaultAddress src/assets/v$version/safe_proxy_factory.json)
    s=$(jq -r .defaultAddress src/assets/v$version/safe.json)
fi

# Getting default address based on the chain id

# v1.3.0 & v1.4.1
cfhCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/compatibility_fallback_handler.json)
ccCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/create_call.json)
mscoCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/multi_send_call_only.json)
msCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/multi_send.json)
smlCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/sign_message_lib.json)
staCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/simulate_tx_accessor.json)

# v1.3.0
gsl2CI=0
gsCI=0
pfCI=0
if [[ $version == "1.3.0" ]]; then
    gsl2CI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/gnosis_safe_l2.json)
    gsCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/gnosis_safe.json)
    pfCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/proxy_factory.json)
fi

# v1.4.1
sl2CI=0
spfCI=0
sCI=0
if [[ $version == "1.4.1" ]]; then
    sl2CI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/safe_l2.json)
    spfCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/safe_proxy_factory.json)
    sCI=$(jq -r '.networkAddresses["'$chainid'"]' src/assets/v$version/safe.json)
fi

# Checking default addresses and the addresses created for that chain id

if [[ $cfh != $cfhCI ]]; then
    echo "ERROR: CompatibilityFallbackHandler default address is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $cc != $ccCI ]]; then
    echo "ERROR: CreateCall default address is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $msco != $mscoCI ]]; then
    echo "ERROR: MultiSendCallOnly default address is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $ms != $msCI ]]; then
    echo "ERROR: MultiSend default address is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $sml != $smlCI ]]; then
    echo "ERROR: SignMessageLib default address is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $sta != $staCI ]]; then
    echo "ERROR: SimulateTxAccessor default address is not the same as the one created for the chain id" 1>&2
    exit 1
fi

if [[ $version == "1.3.0" ]]; then
    if [[ $gsl2 != $gsl2CI ]]; then
        echo "ERROR: GnosisSafeL2 default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $gs != $gsCI ]]; then
        echo "ERROR: GnosisSafe default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $pf != $pfCI ]]; then
        echo "ERROR: ProxyFactory default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
fi

if [[ $version == "1.4.1" ]]; then
    if [[ $sl2 != $sl2CI ]]; then
        echo "ERROR: SafeL2 default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $spf != $spfCI ]]; then
        echo "ERROR: SafeProxyFactory default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $s != $sCI ]]; then
        echo "ERROR: Safe default address is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
fi

echo "Default addresses are correct"

# Code Hash of the default addresses (Chain ID: 1)
# cast keccak $(cast code contractAddress --rpc-url https://rpc.ankr.com/eth)

# v1.3.0
if [[ $version == "1.3.0" ]]; then
    cfhCH=$(jq -r '.["'$version'"].["CompatibilityFallbackHandler"]' src/assets/code-hashes.json)
    ccCH=$(jq -r '.["'$version'"].["CreateCall"]' src/assets/code-hashes.json)
    gsl2CH=$(jq -r '.["'$version'"].["GnosisSafeL2"]' src/assets/code-hashes.json)
    gsCH=$(jq -r '.["'$version'"].["GnosisSafe"]' src/assets/code-hashes.json)
    mscoCH=$(jq -r '.["'$version'"].["MultiSendCallOnly"]' src/assets/code-hashes.json)
    msCH=$(jq -r '.["'$version'"].["MultiSend"]' src/assets/code-hashes.json)
    pfCH=$(jq -r '.["'$version'"].["ProxyFactory"]' src/assets/code-hashes.json)
    smlCH=$(jq -r '.["'$version'"].["SignMessageLib"]' src/assets/code-hashes.json)
    staCH=$(jq -r '.["'$version'"].["SimulateTxAccessor"]' src/assets/code-hashes.json)
fi

# v1.4.1
if [[ $version == "1.4.1" ]]; then
    cfhCH=$(jq -r '.["'$version'"].["CompatibilityFallbackHandler"]' src/assets/code-hashes.json)
    ccCH=$(jq -r '.["'$version'"].["CreateCall"]' src/assets/code-hashes.json)
    mscoCH=$(jq -r '.["'$version'"].["MultiSendCallOnly"]' src/assets/code-hashes.json)
    msCH=$(jq -r '.["'$version'"].["MultiSend"]' src/assets/code-hashes.json)
    sl2CH=$(jq -r '.["'$version'"].["SafeL2"]' src/assets/code-hashes.json)
    spfCH=$(jq -r '.["'$version'"].["SafeProxyFactory"]' src/assets/code-hashes.json)
    sCH=$(jq -r '.["'$version'"].["Safe"]' src/assets/code-hashes.json)
    smlCH=$(jq -r '.["'$version'"].["SignMessageLib"]' src/assets/code-hashes.json)
    staCH=$(jq -r '.["'$version'"].["SimulateTxAccessor"]' src/assets/code-hashes.json)
fi

# Now getting the codehash (keccak of bytecode) for the default addresses created for that chain id
echo "Fetching codehashes from the chain"

cfhCICH=$(cast keccak $(cast code $cfhCI --rpc-url $rpc))
ccCICH=$(cast keccak $(cast code $ccCI --rpc-url $rpc))
mscoCICH=$(cast keccak $(cast code $mscoCI --rpc-url $rpc))
msCICH=$(cast keccak $(cast code $msCI --rpc-url $rpc))
smlCICH=$(cast keccak $(cast code $smlCI --rpc-url $rpc))
staCICH=$(cast keccak $(cast code $staCI --rpc-url $rpc))

if [[ $version == "1.3.0" ]]; then
    gsl2CICH=$(cast keccak $(cast code $gsl2CI --rpc-url $rpc))
    gsCICH=$(cast keccak $(cast code $gsCI --rpc-url $rpc))
    pfCICH=$(cast keccak $(cast code $pfCI --rpc-url $rpc))
fi

# v1.4.1
if [[ $version == "1.4.1" ]]; then
    sl2CICH=$(cast keccak $(cast code $sl2CI --rpc-url $rpc))
    spfCICH=$(cast keccak $(cast code $spfCI --rpc-url $rpc))
    sCICH=$(cast keccak $(cast code $sCI --rpc-url $rpc))
fi

# Checking codehashes
if [[ $cfhCH != $cfhCICH ]]; then
    echo "ERROR: CompatibilityFallbackHandler code hash is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $ccCH != $ccCICH ]]; then
    echo "ERROR: CreateCall code hash is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $mscoCH != $mscoCICH ]]; then
    echo "ERROR: MultiSendCallOnly code hash is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $msCH != $msCICH ]]; then
    echo "ERROR: MultiSend code hash is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $smlCH != $smlCICH ]]; then
    echo "ERROR: SignMessageLib code hash is not the same as the one created for the chain id" 1>&2
    exit 1
fi
if [[ $staCH != $staCICH ]]; then
    echo "ERROR: SimulateTxAccessor code hash is not the same as the one created for the chain id" 1>&2
    exit 1
fi

if [[ $version == "1.3.0" ]]; then
    if [[ $gsl2CH != $gsl2CICH ]]; then
        echo "ERROR: GnosisSafeL2 code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $gsCH != $gsCICH ]]; then
        echo "ERROR: GnosisSafe code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $pfCH != $pfCICH ]]; then
        echo "ERROR: ProxyFactory code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
fi

if [[ $version == "1.4.1" ]]; then
    if [[ $sl2CH != $sl2CICH ]]; then
        echo "ERROR: SafeL2 code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $spfCH != $spfCICH ]]; then
        echo "ERROR: SafeProxyFactory code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
    if [[ $sCH != $sCICH ]]; then
        echo "ERROR: Safe code hash is not the same as the one created for the chain id" 1>&2
        exit 1
    fi
fi

echo "Code hashes are correct"

git restore --ignore-unmerged -- src/assets

# NOTE/TODO
# - We should still manually verify there is no extra code in the PR.
# - We could fetch the version, chain id and rpc from the PR (needs a standard format and possibly a tag in PR).
# - We can approve PR using Github CLI. Should only be added after all manual tasks can be automated.
