# Publishing (maintainers)

How a Evenkeel release goes out: the npm package, the Storybook site and the Figma Community file. All three share one version number.

## One-time setup

### GitHub

- [ ] **Fill in the placeholders** (GitHub username, contact email) with one command, then check none are left:
  ```sh
  node scripts/fill-placeholders.mjs --github <username>
  npm run release:check        # lists anything still left; also runs before every npm publish
  ```
  After the Figma Community file is live, run it again with `--figma <community-url>`. The Figma link is the only one left until then, so `release:check` will fail until you do; publish the Figma file before the npm package, or publish npm after adding the link.
- [ ] In Figma, replace `github.com/<you>/evenkeel` on the **Get started** page (Open source box) and the **Release card** on the Marketing page.
- [ ] **Settings → Pages → Build and deployment → Source: GitHub Actions.** The `pages.yml` workflow then deploys Storybook to `https://<you>.github.io/evenkeel/` on every push to `main`.
- [ ] **Settings → Environments → New environment `npm`.** Add a protection rule (required reviewer: you) so a tag cannot publish without approval. Add the secret `NPM_TOKEN` to this environment.
- [ ] **Settings → Branches:** protect `main` (require PR, require the `CI / Build, test and audit` check).
- [ ] **Settings → Security:** enable private vulnerability reporting (referenced by `SECURITY.md`) and Dependabot alerts. `SECURITY.md` and `CODE_OF_CONDUCT.md` both send reports there, so there is no public email.
- [ ] **Settings → General → Features:** enable **Discussions** (the issue chooser links to it).

### npm

- [ ] Create or sign in to an npm account with 2FA.
- [ ] Check the name is free: `npm view evenkeel-ui` should 404.
- [ ] Create a **granular access token** (Read and write, scoped to `evenkeel-ui`; for the very first publish, "all packages" is needed because the package does not exist yet; narrow it afterwards). Store it as `NPM_TOKEN` in the `npm` environment.
- [ ] Optional, recommended: after the first publish, set up **Trusted Publishing** for `evenkeel-ui` on npmjs.com (GitHub Actions, workflow `release.yml`, environment `npm`). Then the token is no longer needed and can be deleted.

Provenance is enabled twice: `publishConfig.provenance: true` in `package.json` and `--provenance` in the workflow. It needs the `id-token: write` permission the release workflow already has, and a public repository.

## Cutting a release

1. **Update the changelog.** Move entries from `[Unreleased]` into a new `## [x.y.z] - YYYY-MM-DD` section and update the compare links at the bottom.
2. **Bump the version** without creating a tag yet:
   ```sh
   npm version x.y.z --no-git-tag-version
   ```
3. **Run everything locally:**
   ```sh
   npm ci
   npm run typecheck && npm test && npm run build && npm run test:smoke
   npm pack --dry-run          # check the file list: dist/, README, LICENSE, CHANGELOG, THIRD_PARTY_NOTICES
   npm run build-storybook && npm run test:a11y
   ```
4. **Open a PR** `chore(release): x.y.z`, wait for CI, squash-merge.
5. **Tag `main`:**
   ```sh
   git switch main && git pull
   git tag -a vx.y.z -m "vx.y.z"
   git push origin vx.y.z
   ```
6. **Approve the deployment.** `release.yml` runs: checks the tag matches `package.json`, builds tokens, typechecks, tests, builds, smoke-tests, then `npm publish --provenance --access public`. Tags with a hyphen (`v1.1.0-beta.1`) publish to the `next` dist-tag and create a pre-release.
7. **Check the result:**
   - npmjs.com/package/evenkeel-ui shows the version and a **Provenance** badge.
   - The GitHub release exists with generated notes. Paste the changelog section in if the notes are thin.
   - In a scratch project: `npm i evenkeel-ui@x.y.z` and import `evenkeel-ui/css`.
8. **Storybook** redeploys from `main` automatically (`pages.yml`). Check `https://<you>.github.io/evenkeel/`.
9. **Figma:** publish the library update and Community update with the same version (below).

If a release is broken, publish a patch. Use `npm deprecate evenkeel-ui@x.y.z "reason"` rather than `npm unpublish`.

## Publishing the Figma Community file

Ready-to-paste listing copy is in [FIGMA_COMMUNITY.md](../FIGMA_COMMUNITY.md).

### Prepare the file

- [ ] Replace `<you>` links on the **Cover** and **Get started** pages with the real GitHub, npm and Storybook URLs.
- [ ] Set the Cover page's frame as the file thumbnail: right-click the frame → **Set as thumbnail**.
- [ ] Remove private or unfinished pages, comments, and any branch.
- [ ] Remove any font that is not free to redistribute. Evenkeel uses Inter and Bricolage Grotesque (both SIL OFL, available in Figma by default).
- [ ] Run the parity checklist in [figma.md](figma.md#parity-check-before-a-release).
- [ ] Add a version note: **File menu → Save to version history**, named `vx.y.z`.

### Publish

1. Click **Share → Publish to Community** (or the Figma menu → **File → Publish to Community**).
2. **Name:** `Evenkeel Design System`.
3. **Description:** paste from `FIGMA_COMMUNITY.md`.
4. **Cover image:** upload a **1920 × 960 px** PNG or JPG (2:1). Keep text and key visuals inside the centre 1600 × 800, since the gallery crops edges at small sizes. Source frame: Figma › Cover page. Export the same image to `docs/images/figma-cover.png`.
5. **Thumbnail:** the file thumbnail set above.
6. **Category and tags:** Design systems; tags from `FIGMA_COMMUNITY.md` (up to 10).
7. **Support contact / links:** the GitHub repository and issues page.
8. **Licence.** Figma Community files are published under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**; Figma does not offer a choice. This differs from the code, which is MIT. Both are permissive; CC BY asks for attribution. State both in the description, as `FIGMA_COMMUNITY.md` does.
9. **Allow duplicates / remixes:** on.
10. **Publish.** Copy the Community URL and replace `<figma-community-link>` in the repository.

### Updating the Community file

After each release: make the changes in the source file, add a version-history entry `vx.y.z`, then **Publish update** from the same Share dialog, with a short "What's new" note that mirrors the changelog. People who duplicated earlier versions keep their copy; only the listing updates.

## Repository settings checklist (after first release)

- [ ] Repository description: "A themeable design system for data-heavy web apps, in Figma and React."
- [ ] Website: the Storybook URL.
- [ ] Topics: `design-system`, `react`, `figma`, `design-tokens`, `storybook`, `dark-mode`, `accessibility`, `data-visualization`.
- [ ] Social preview image (Settings → General): 1280 × 640, `docs/images/social-preview.png`.
