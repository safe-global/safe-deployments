#!/usr/bin/env bash

set -euo pipefail

usage() {
    cat <<EOF
This script creates a draft GitHub release on the current commit.

USAGE
    bash bin/github-release.sh [-v|--verbose] [--no-push]

OPTIONS
    -v | --verbose      Verbose output
    -n | --dry-run      Dry run; don't create any commits, tags, or draft a new
                        release GitHub.

EXAMPLES
    bash bin/github-release.sh
EOF
}

verbose=n
dryrun=n
while [[ $# -gt 0 ]]; do
	case "$1" in
	-v|--verbose)
		verbose=y
		;;
	-n|--dry-run)
		dryrun=y
		;;
	*)
		usage
		exit 1
		;;
	esac
	shift
done

log() {
	if [[ "$verbose" == "y" ]]; then
		echo "$@"
	fi
}

if [[ -n "$(git status --porcelain)" ]]; then
	echo "ERROR: Dirty Git index, please commit all changes before continuing" 1>&2
	#exit 1
fi
if ! command -v gh &> /dev/null; then
	echo "ERROR: Please install the 'gh' GitHub CLI" 1>&2
	exit 1
fi

name=$(jq -r '.name' package.json)
current=$(jq -r '.version' package.json)
latest=$(npm view "$name" version)

if [[ -n "$(git tag -l --points-at HEAD | awk '$1 == "v'$latest'"')" ]]; then
	log "no changes since latest release"
	exit 0
elif [[ "$current" == "$latest" ]]; then
	log "bumping version"
	bump="patch"
else
	log "reusing current version"
	bump="$current"
fi
tag=$(npm version "$bump" --allow-same-version --no-git-tag-version)

if [[ "$dryrun" == "n" ]]; then
	log "updating repository to $tag"
	if [[ -n "$(git status --porcelain)" ]]; then
		git commit -am "$tag"
		git push origin
	fi
fi

log "generating NPM packaging"
npm pack
package="${name#@}-${tag#v}.tgz"
package="${package//\//-}"

if [[ "$dryrun" == "n" ]]; then
	log "creating draft release"
	gh release delete "$tag" --yes &>/dev/null || true
	gh release create "$tag" --draft --generate-notes --target "$(git rev-parse HEAD)" --title "$tag"

	log "uploading ${package}"
	gh release upload "$tag" "${package}"
fi
