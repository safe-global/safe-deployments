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
    echo "ERROR: Please install the 'cast' Foundry (forge)" 1>&2
    exit 1
fi

pr=0
chainid=0
rpc=0
version=""
# TODO: "1.0.0" "1.1.1" "1.2.0"
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
    cfhCH="0x03e69f7ce809e81687c69b19a7d7cca45b6d551ffdec73d9bb87178476de1abf"
    ccCH="0x8155d988823a4f6f1bcbc76a64af8e510c4ce68819290d43cf24956bd24dee82"
    gsl2CH="0x21842597390c4c6e3c1239e434a682b054bd9548eee5e9b1d6a4482731023c0f"
    gsCH="0xbba688fbdb21ad2bb58bc320638b43d94e7d100f6f3ebaab0a4e4de6304b1c2e"
    mscoCH="0xa9865ac2d9c7a1591619b188c4d88167b50df6cc0c5327fcbd1c8c75f7c066ad"
    msCH="0x0208282bd262360d0320862c5ac70f375f5ed3b9d89a83a615b4d398415bdc83"
    pfCH="0x337d7f54be11b6ed55fef7b667ea5488db53db8320a05d1146aa4bd169a39a9b"
    smlCH="0x3ac65dea3cc9dd0d7b7b800f834e3d73415b4e944bb94555c3e4a08fb137e918"
    staCH="0xb3fb9763869f2c09a2ac5a425d2dd6060bf7ef46b3899049d71a711e71e00f04"
fi

# v1.4.1
if [[ $version == "1.4.1" ]]; then
    cfhCH="0x7c6007a5d711cea8dfd5d91f5940ec29c7f200fe511eb1fc1397b367af3c42f9"
    ccCH="0x2b3060c55fcb8275653e99ad511a71f67ba76934ed66a7d74d6e68b52afff889"
    mscoCH="0xecd5bd14a08c5d2122379900b2f272bdf107a7e92423c10dd5fe3254386c9939"
    msCH="0x0e4f7fc66550a322d1e7688e181b75e217e662a4f3f4d6a29b22bc61217c4b77"
    sl2CH="0xb1f926978a0f44a2c0ec8fe822418ae969bd8c3f18d61e5103100339894f81ff"
    spfCH="0x50c3cdc4074750a7a974204a716c999edd37482f907608d960b2b025ee0b3317"
    sCH="0x1fe2df852ba3299d6534ef416eefa406e56ced995bca886ab7a553e6d0c5e1c4"
    smlCH="0x525c754a46b79e05543a59bb61e8de3c9eee0d955a59352409cbe67ea1077528"
    staCH="0x91f82615581fc73b190b83d72e883608b25e392f72322035df1b13d51766cf8d"
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
