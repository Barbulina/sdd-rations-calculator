# Tasks: GitHub Pages Automated Deployment

**Input**: Design documents from `/specs/011-gh-pages-deploy/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/deploy.yml ✅, quickstart.md ✅

**Tests**: No new test tasks — the CI workflow runs the existing Vitest suite before deploying. No new domain logic requires TDD coverage.

**Organization**: Tasks are grouped by user story. US1 (auto-deploy) is the MVP. US4 (branch protection) is a manual GitHub Settings step documented as a task, not code.

---

## Phase 1: Setup

**Purpose**: Create the GitHub Actions workflow directory and wire GitHub Pages in repository settings.

- [ ] T001 Enable GitHub Pages in repository Settings → Pages → Source: GitHub Actions at `https://github.com/Barbulina/sdd-rations-calculator/settings/pages`
- [ ] T002 Create `.github/workflows/` directory at repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modify `next.config.ts` for static export — required by ALL user stories before any build can succeed.

**⚠️ CRITICAL**: The workflow build step (`npm run build`) will fail until this is in place.

- [ ] T003 Add `output: 'export'`, `basePath: '/sdd-rations-calculator'`, `trailingSlash: true`, `images: { unoptimized: true }` to `next.config.ts`
- [ ] T004 Add `export const dynamicParams = false` and `export function generateStaticParams() { return []; }` to `app/menu/[id]/page.tsx` (required for static export with dynamic routes)
- [ ] T005 Verify local build succeeds: `npm run build` — confirm `out/` directory is created with `index.html`, `aliment-browser/index.html`, `menu-builder/index.html`

**Checkpoint**: `out/` directory produced locally with no build errors → user story phases can proceed.

---

## Phase 3: User Story 1 — Automatic Deployment on Merge to Main (Priority: P1) 🎯 MVP

**Goal**: Every push to `main` triggers a GitHub Actions workflow that builds and deploys the app to GitHub Pages automatically.

**Independent Test**: Merge this branch's PR into `main` → verify GitHub Actions workflow runs → visit `https://barbulina.github.io/sdd-rations-calculator/` → app loads correctly.

- [ ] T006 [US1] Create `.github/workflows/deploy.yml` from the contract at `specs/011-gh-pages-deploy/contracts/deploy.yml`
- [ ] T007 [US1] Add `touch out/.nojekyll` step to the build job in `.github/workflows/deploy.yml` (prevents Jekyll from hiding `_next/` assets)
- [ ] T008 [US1] Commit all changes (`next.config.ts`, `app/menu/[id]/page.tsx`, `.github/workflows/deploy.yml`) and push branch to trigger a dry-run check via the PR
- [ ] T009 [US1] Open a Pull Request from `011-gh-pages-deploy` into `main` and verify the Actions workflow runs successfully on the PR
- [ ] T010 [US1] After workflow passes, merge the PR into `main` and confirm the deployment completes at the GitHub Pages URL

---

## Phase 4: User Story 2 — Failed Build Blocks Deployment (Priority: P2)

**Goal**: A build failure stops the deploy job — the previously published version remains live.

**Independent Test**: This is automatically satisfied by the two-job structure (`deploy: needs: build`) in the workflow — no additional code needed. Verify by inspecting the YAML: if `build` fails, `deploy` is skipped.

- [ ] T011 [P] [US2] Review `.github/workflows/deploy.yml` to confirm `deploy` job has `needs: build` — ensures failed build blocks deployment (no code change needed if already correct)
- [ ] T012 [US2] Verify `npm test -- --run` step is before `npm run build` in the build job — ensures test failures also block deployment

---

## Phase 5: User Story 3 — Deployment Status Visible in GitHub UI (Priority: P3)

**Goal**: The `github-pages` environment appears in the repo's Environments tab with live URL and timestamp.

**Independent Test**: After a successful deployment, visit `https://github.com/Barbulina/sdd-rations-calculator/deployments` — a `github-pages` entry with the live URL must exist.

- [ ] T013 [P] [US3] Confirm the `deploy` job in `.github/workflows/deploy.yml` has the `environment:` block with `name: github-pages` and `url: ${{ steps.deploy.outputs.page_url }}` (automatic via `actions/deploy-pages@v4`)
- [ ] T014 [US3] After first successful deployment, verify the Environments tab at `https://github.com/Barbulina/sdd-rations-calculator/deployments` shows the `github-pages` environment with the live URL

---

## Phase 6: User Story 4 — Direct Pushes to Main Are Blocked (Priority: P2)

**Goal**: Branch protection rules prevent any direct push to `main` — PRs with ≥1 approval are the only merge path.

**Independent Test**: Run `git push origin main` from a local commit → push is rejected with `GH006: Protected branch update failed`.

⚠️ **Manual step** — configured in GitHub Settings UI, not in code. Must be done **after** T010 (first successful workflow run) so the `build` status check is available to select.

- [ ] T015 [US4] Go to `https://github.com/Barbulina/sdd-rations-calculator/settings/branches` → Add rule for `main`
- [ ] T016 [US4] Enable: "Require a pull request before merging" with 1 required approval, "Dismiss stale reviews when new commits pushed"
- [ ] T017 [US4] Enable: "Require status checks to pass before merging" → select the `build` check
- [ ] T018 [US4] Enable: "Do not allow bypassing the above settings" (blocks admins too)
- [ ] T019 [US4] Verify protection: attempt `git push origin main` with a local commit → confirm rejection

---

## Phase 7: Polish & Verification

**Purpose**: End-to-end verification of all success criteria.

- [ ] T020 [P] Visit `https://barbulina.github.io/sdd-rations-calculator/` and verify full app navigation works (home → menu detail → aliment browser)
- [ ] T021 [P] Open DevTools → Network tab → confirm no 404s for JS/CSS/image assets (all load from `/sdd-rations-calculator/_next/`)
- [ ] T022 [P] Verify dark mode toggle still works on the deployed version (client-side `next-themes` behaviour)
- [ ] T023 Commit spec files (`specs/011-gh-pages-deploy/`) and merge branch per standard git workflow

---

## Dependencies

```
T001 (Pages enabled) ──────────────────────────────────────────────────────────┐
T002 (workflow dir)  ──┐                                                        │
T003 (next.config)   ──┤                                                        │
T004 (dynamic route) ──┤                                                        │
T005 (local build)   ──┘                                                        │
                        ↓                                                       │
                       T006 (create deploy.yml)                                 │
                       T007 (add .nojekyll)                                     │
                       T008 (commit + push)                                     │
                       T009 (open PR + verify CI)                               │
                       T010 (merge PR) ←───────────────────────────────────────┘
                          ↓
                    T011-T014 (verify US2/US3 — mostly inspection)
                          ↓
                    T015-T019 (branch protection — after first deploy)
                          ↓
                    T020-T023 (polish & verification)
```

**Parallel opportunities**:
- T003 + T004 can be done simultaneously (different files)
- T011 + T013 can be done simultaneously (inspection only, no file edits)
- T020 + T021 + T022 can be done simultaneously (browser verification)

---

## Implementation Strategy

**MVP scope (US1 only)**: T001 → T010. After T010, the app is live on GitHub Pages. Everything else is verification or hardening.

**Suggested sequence**:
1. T001–T005: local setup and build verification (can be done in ~15 min)
2. T006–T007: author the workflow YAML (copy from contract, ~5 min)
3. T008–T010: push, PR, merge (depends on reviewer availability)
4. T011–T014: verify US2/US3 (inspection only, ~10 min)
5. T015–T019: branch protection (manual UI steps, ~10 min, after first deploy)
6. T020–T023: polish verification (~10 min)

**Total estimated tasks**: 23 tasks across 7 phases  
**Code tasks**: 5 (T003, T004, T006, T007, T023)  
**Manual/verification tasks**: 18 (GitHub Settings, browser checks, CI observation)
