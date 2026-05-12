# Quickstart: GitHub Pages Automated Deployment

**Feature**: 011-gh-pages-deploy | **Branch**: `011-gh-pages-deploy`

---

## Prerequisites

- Repository on GitHub: `Barbulina/sdd-rations-calculator`
- Maintainer/admin access to the repository settings
- All existing tests passing locally (`npm test -- --run`)

---

## Step 1: Enable GitHub Pages in Repository Settings

> Do this **once** before the workflow runs for the first time.

1. Go to `https://github.com/Barbulina/sdd-rations-calculator/settings/pages`
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

---

## Step 2: Apply Code Changes (via PR on this branch)

The following files are changed in this feature branch:

### `next.config.ts` — add static export configuration
```typescript
const nextConfig = {
  output: 'export',
  basePath: '/sdd-rations-calculator',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { turbo: {} },
};
export default nextConfig;
```

### `app/menu/[id]/page.tsx` — add static export params
```typescript
export const dynamicParams = false;
export function generateStaticParams() {
  return [];
}
```
(Add at the top of the file, outside the component function)

### `.github/workflows/deploy.yml` — create the workflow
Copy the contents from `specs/011-gh-pages-deploy/contracts/deploy.yml`.

---

## Step 3: Merge the PR

After the PR is approved and merged, GitHub Actions runs automatically:

1. **Build job**: installs deps → runs tests → `next build` → uploads `out/` artifact
2. **Deploy job**: publishes the artifact to GitHub Pages

Track progress at: `https://github.com/Barbulina/sdd-rations-calculator/actions`

---

## Step 4: Verify the Deployment

Once the workflow completes:

- Visit `https://barbulina.github.io/sdd-rations-calculator/`
- Verify the app loads (home page / menu list visible)
- Navigate to `/aliment-browser/` — should load correctly
- Check browser DevTools Network tab: no 404s for JS/CSS assets

---

## Step 5: Configure Branch Protection Rules

> Do this **after** the first successful workflow run, so the `build` status check appears in the list.

1. Go to `https://github.com/Barbulina/sdd-rations-calculator/settings/branches`
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable the following:

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ |
| Required approvals | 1 |
| Dismiss stale reviews when new commits pushed | ✅ |
| Require status checks to pass before merging | ✅ |
| Status checks: | select `build` |
| Do not allow bypassing the above settings | ✅ |

5. Click **Create**

### Verify branch protection
```bash
# This push should now be rejected:
git checkout main
echo "test" >> README.md
git add README.md && git commit -m "direct push test"
git push origin main
# Expected: error: GH006: Protected branch update failed
```

---

## Known Limitations

- **Direct URL access to `/menu/[id]/`** will return a 404 from GitHub Pages (no static file pre-generated). Navigation via the app's links works correctly.
- **Branch protection "Require status checks"** requires the workflow to have run at least once before the check appears in the settings UI.
- If you ever use a **custom domain**, remove `basePath` and `assetPrefix` from `next.config.ts` and update accordingly.

---

## Useful Links

- Deployment URL: `https://barbulina.github.io/sdd-rations-calculator/`
- Actions tab: `https://github.com/Barbulina/sdd-rations-calculator/actions`
- Environments tab: `https://github.com/Barbulina/sdd-rations-calculator/deployments`
- Pages settings: `https://github.com/Barbulina/sdd-rations-calculator/settings/pages`
- Branch rules settings: `https://github.com/Barbulina/sdd-rations-calculator/settings/branches`
