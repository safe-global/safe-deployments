#!/usr/bin/env bash

set -euo pipefail

usage() {
    cat <<EOF
Script for managing the GitHub release process.

It provides functionality for automatically:
 • Creating GitHub pull requests for bumping version numbers
 • Drafting new GitHub releases
 • Publishing GitHub releases once the version lands on NPM

USAGE
    bash bin/github-release.sh [-v|--verbose] [-n|--dry-run] [bump|draft|publish]

OPTIONS
    -v | --verbose      Verbose output
    -n | --dry-run      Dry run; don't create any commits, tags, or draft a new
                        release GitHub.

EXAMPLES
    bash bin/github-release.sh bump
    bash bin/github-release.sh draft
    bash bin/github-release.sh publish
EOF
}

verbose="n"
dryrun="n"
command=""

while [[ $# -gt 0 ]]; do
	case "$1" in
	-v|--verbose)
		verbose="y"
		;;
	-n|--dry-run)
		dryrun="y"
		;;
	bump|draft|publish)
		if [[ -n "$command" ]]; then
			usage
			exit 1
		fi
		command="$1"
		;;
	*)
		usage
		exit 1
		;;
	esac
	shift
done

if [[ -z "$command" ]]; then
    usage
    exit 1
fi

log() {
	if [[ "$verbose" == "y" ]]; then
		echo "$@"
	fi
}

if [[ -n "$(git status --porcelain)" ]]; then
	echo "ERROR: Dirty Git index, please commit all changes before continuing" 1>&2
	if [[ "$dryrun" == "n" ]]; then
		exit 1
	fi
fi
if ! command -v gh &> /dev/null; then
	echo "ERROR: Please install the 'gh' GitHub CLI" 1>&2
	exit 1
fi

name="$(jq -r '.name' package.json)"
current="$(jq -r '.version' package.json)"
latest="$(npm view "$name" version)"

log "current: v$current"
log "latest:  v$latest"

if ! printf "%s\n" "$latest" "$current" | sort -C -V; then
	echo "ERROR: Latest NPM version is newer than current version" 1>&2
	exit 1
fi

tag="v$current"
commit="$(git rev-parse HEAD)"
draft="$(gh release view "$tag" --json isDraft,targetCommitish --jq 'if(.isDraft) then .targetCommitish else "" end' 2>/dev/null || true)"

log "commit:  ${commit}"
log "draft:   ${draft:-none}"

command_bump () {
	log "==> Bumping Version"

	if [[ -n "$draft" ]] || [[ "$current" != "$latest" ]]; then
		log "already on unreleased version"
		exit 0
	fi

	git fetch --tags --force --quiet
	if [[ -n "$(git tag -l --points-at HEAD | awk '$1 == "'$tag'"')" ]]; then
		log "no changes since latest release"
		exit 0
	fi

	newtag="$(npm version patch --no-git-tag-version)"
	log "bumping to $newtag"

	branch="bump/$newtag"
	if git ls-remote --heads origin | grep "refs/heads/$branch\$" >/dev/null; then
		log "version bump PR already exists"
		exit 0
	fi

	if [[ "$dryrun" == "n" ]]; then
		log "creating PR bumping version"
		git checkout -b "$branch"
		git commit -am "Bump Version to $newtag"
		git push -u origin "$branch"
		gh pr create --fill
	fi
}

command_draft() {
	log "==> Drafting Release"

	if [[ "$current" == "$latest" ]]; then
		log "no new version to draft release for"
		exit 0
	fi

	if [[ "$commit" == "$draft" ]]; then
		log "draft is already at latest commit"
		exit 0
	fi

	log "generating NPM package"
	npm pack
	package="${name#@}-$current.tgz"
	package="${package//\//-}"

	if [[ "$dryrun" == "n" ]]; then
		log "drafting release with NPM tarball"
		if [[ -n "$draft" ]]; then
			log "cleaning up existing draft"
			gh release delete "$tag" --yes
		fi
		gh release create "$tag" --draft --generate-notes --target "$commit" --title "$tag" "$package"
	fi
}

command_publish() {
	log "==> Publishing Release"

	if [[ -z "$draft" ]] || [[ "$current" != "$latest" ]]; then
		log "nothing to publish"
		exit 0
	fi

	if [[ "$dryrun" == "n" ]]; then
		log "publishing draft release"
		gh release edit "$tag" --draft=false
	fi
}

case $command in
	bump) command_bump ;;
	draft) command_draft ;;
	publish) command_publish ;;
esac
