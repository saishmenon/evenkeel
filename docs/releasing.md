# Releasing

Notes for maintainers.

## npm

1. Add the release to `CHANGELOG.md` and bump the version: `npm version 1.2.0 --no-git-tag-version`.
2. Run `npm run typecheck && npm test && npm run build && npm run test:smoke`, and check `npm pack --dry-run`.
3. Commit, push, then tag: `git tag -a v1.2.0 -m v1.2.0 && git push origin v1.2.0`.
4. Approve the deployment in GitHub Actions. The release workflow tests, builds, publishes to npm with provenance and creates a GitHub release.

The workflow needs an `npm` environment with an `NPM_TOKEN` secret. If a release is broken, publish a patch and deprecate the bad version with `npm deprecate`. Don't unpublish.

## Storybook

Storybook deploys to GitHub Pages on every push to `main`. Pages must be set to deploy from GitHub Actions.

## Figma

Save a version in the file's version history with the same number, then publish the update from the Community page.
