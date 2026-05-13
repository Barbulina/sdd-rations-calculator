# Research: GitHub Pages Automated Deployment

**Branch**: `011-gh-pages-deploy` | **Date**: 2026-05-12

---

## Topic 1: Next.js Static Export for GitHub Pages

### Decision

Use `output: 'export'` in `next.config.ts` with `basePath: '/sdd-rations-calculator'`, `trailingSlash: true`, and `images.unoptimized: true`. The `.nojekyll` file must be present in the output directory to prevent GitHub Pages from hiding `_next/` assets.

### Rationale

- `output: 'export'` generates a fully static `out/` directory (HTML + JS + CSS) — no Node.js server required at runtime, perfect for GitHub Pages.
- `basePath` tells Next.js that the app is served from `/sdd-rations-calculator`, so internal links and asset references are correct.
- `trailingSlash: true` ensures each route generates an `index.html` file (e.g., `menu-builder/index.html`), which static hosts serve correctly.
- `.nojekyll` prevents Jekyll processing, which would ignore files starting with `_` (the `_next/` asset folder).

### Minimal `next.config.ts` changes

```typescript
const nextConfig = {
  output: "export",
  basePath: "/sdd-rations-calculator",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { turbo: {} }, // keep — compatible with static export
};
```

### Alternatives considered

- **`next start` on a server** — requires a running Node.js process; incompatible with GitHub Pages (static only).
- **Vercel / Netlify** — free tiers available but outside the stated requirement of GitHub Pages.

---

## Topic 2: Dynamic Route `/menu/[id]` — Critical Blocker

### Decision

Add `generateStaticParams()` to `app/menu/[id]/page.tsx` that returns all menu IDs stored in localStorage… **but this is impossible at build time**: localStorage is a browser API unavailable in Node.js during `next build`.

**Solution**: Use the `dynamicParams = false` export + return an empty array from `generateStaticParams`. This tells Next.js the page is statically parameterised with zero pre-built paths; on the client side, Next.js will still render the page via client-side navigation (`useParams` / `useSearchParams`). Since the app is fully client-rendered (`"use client"`), the page will hydrate correctly from the static shell.

```typescript
// app/menu/[id]/page.tsx — add at the top level (not inside component)
export const dynamicParams = false;
export function generateStaticParams() {
  return []; // IDs come from localStorage; pre-generation not applicable
}
```

> ⚠️ **Consequence**: A user who bookmarks `https://barbulina.github.io/sdd-rations-calculator/menu/abc123/` and navigates directly (hard refresh) will get a 404 from GitHub Pages because the static file `menu/abc123/index.html` does not exist. Navigation via the app's links works correctly (client-side routing). This is an accepted limitation documented in the spec's Edge Cases.

### Rationale

- The menu detail page is purely client-side (`"use client"`, reads from localStorage) — no server data is fetched at build time.
- Returning `[]` from `generateStaticParams` with `dynamicParams = false` satisfies the static export requirement without breaking client-side navigation.

### Alternatives considered

- **Migrate menu IDs to URL query params** (`/menu?id=abc123`) — avoids the dynamic route entirely; deferred as out of scope.
- **Custom 404.html redirect** — a `404.html` that redirects to the root, allowing the SPA to handle the route; adds complexity and is out of scope for this feature.

---

## Topic 3: GitHub Actions Workflow Structure

### Decision

Two-job workflow (`build` → `deploy`) using the official GitHub-maintained actions. `npm test -- --run` runs before the build to block deployment on failing tests.

### Rationale

- Two jobs are the official GitHub recommendation: `build` produces the artifact, `deploy` is a separate job with `pages: write` permission.
- Running tests before building ensures only verified code reaches production.
- `concurrency: cancel-in-progress: true` prevents a stale build from overwriting a newer one when multiple PRs are merged in quick succession.

### Recommended actions and versions (stable as of 2026-05)

| Action                          | Version | Purpose                    |
| ------------------------------- | ------- | -------------------------- |
| `actions/checkout`              | `v4`    | Check out source           |
| `actions/setup-node`            | `v4`    | Install Node.js 20         |
| `actions/upload-pages-artifact` | `v3`    | Package `out/` as artifact |
| `actions/deploy-pages`          | `v4`    | Deploy artifact to Pages   |

> `actions/configure-pages` is **not needed** when `basePath`/`assetPrefix` are set in `next.config.ts`.

### Complete workflow YAML (reference — final file in contracts/)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

concurrency:
  group: pages
  cancel-in-progress: true

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deploy
```

### Alternatives considered

- **Single job** — simpler but mixes build and deploy permissions in one job, which is a security concern (principle of least privilege).
- **`peaceiris/actions-gh-pages`** — popular community action that pushes to a `gh-pages` branch; the official `actions/deploy-pages` is preferred as it uses OIDC (no personal access token needed).

---

## Topic 4: Branch Protection Rules

### Decision

Use **Branch Protection Rules** (not Rulesets) via GitHub Settings UI. Rulesets are not needed for a single-branch, single-repository setup and require a paid plan for some features.

### Settings to enable (Settings → Branches → Add rule for `main`)

| Setting                                       | Value                                                |
| --------------------------------------------- | ---------------------------------------------------- |
| Require a pull request before merging         | ✅ enabled                                           |
| Required number of approvals                  | 1                                                    |
| Dismiss stale reviews when new commits pushed | ✅ recommended                                       |
| Require status checks to pass                 | ✅ enabled (select `build` job once workflow exists) |
| Do not allow bypassing the above settings     | ✅ (blocks admins too)                               |
| Allow force pushes                            | ❌ disabled                                          |
| Allow deletions                               | ❌ disabled                                          |

> ⚠️ "Require status checks" lists available checks only after the workflow has run at least once. Configure it after the first successful deployment.

### GitHub CLI equivalent (for automation / documentation)

```bash
gh api repos/Barbulina/sdd-rations-calculator/branches/main/protection \
  -X PUT \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field enforce_admins=true \
  --field restrictions=null \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=build
```

### Alternatives considered

- **Rulesets** — more powerful, but requires GitHub Team plan for cross-repo enforcement; overkill for a single personal repo.
- **No protection** — rejected; the entire point of this feature is to enforce the PR-only flow.

---

## All NEEDS CLARIFICATION — Resolved

| Item                                        | Resolution                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Static export compatibility with App Router | ✅ Confirmed compatible; `use client` pages export cleanly                                   |
| Dynamic route `/menu/[id]`                  | ✅ `generateStaticParams` returning `[]` + `dynamicParams = false`                           |
| `experimental: { turbo: {} }` compat        | ✅ Compatible; keep in config                                                                |
| `next/image` in static export               | ✅ `images.unoptimized: true` required; project uses no `<Image>` components (SVG/text only) |
| `.nojekyll` requirement                     | ✅ Must be created in `out/` directory post-build                                            |
| GitHub Actions action versions              | ✅ checkout@v4, setup-node@v4, upload-pages-artifact@v3, deploy-pages@v4                     |
| Branch protection plan requirement          | ✅ Free tier supports all needed settings                                                    |
