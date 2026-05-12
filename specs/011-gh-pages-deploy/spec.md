# Feature Specification: GitHub Pages Automated Deployment

**Feature Branch**: `011-gh-pages-deploy`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "quiero crear un github action para que cuando cuando mergee en main una PR se haga un deploy de la app en una github page"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Deployment on Merge to Main (Priority: P1)

A developer merges a pull request into `main`. Without any manual steps, the latest version of the app is built and published to GitHub Pages, and the public URL reflects the new version within a few minutes.

**Why this priority**: This is the core of the feature — the entire value proposition is zero-touch deployment after a PR merge.

**Independent Test**: Merge any branch into `main` (even a trivial change) and verify the GitHub Pages URL shows the updated content within 5 minutes.

**Acceptance Scenarios**:

1. **Given** a PR has been approved and merged into `main`, **When** the merge commit lands on `main`, **Then** a deployment workflow starts automatically with no manual intervention.
2. **Given** the workflow has started, **When** the build completes successfully, **Then** the new version is live at the public GitHub Pages URL.
3. **Given** the workflow has completed, **When** a user visits the GitHub Pages URL, **Then** the app loads and is fully functional (navigation, menus, aliment browser all work).

---

### User Story 2 - Failed Build Blocks Deployment (Priority: P2)

A developer merges code that causes the build to fail. The existing deployed version remains untouched and the developer is notified of the failure through the GitHub Actions UI.

**Why this priority**: Protecting the published version from broken builds is a prerequisite for trusting automated deployment.

**Independent Test**: Introduce a deliberate build error in a branch, merge it, and verify the GitHub Pages URL still shows the previous good version.

**Acceptance Scenarios**:

1. **Given** a merged commit produces a build error, **When** the workflow runs, **Then** the deployment step is skipped and the job is marked as failed.
2. **Given** the build has failed, **When** a user visits the GitHub Pages URL, **Then** the previously deployed version is still accessible.
3. **Given** a failed workflow run, **When** a developer checks the GitHub Actions tab, **Then** the failure reason is visible in the workflow logs.

---

### User Story 3 - Deployment Status Visible in GitHub UI (Priority: P3)

A developer can see the current deployment status of the GitHub Pages environment directly in the GitHub repository without leaving the browser.

**Why this priority**: Observability into what is deployed and when is a quality-of-life requirement for teams, but the app still works without it.

**Independent Test**: After a successful merge, check the GitHub repository's "Environments" section and verify a `github-pages` environment entry shows the deployed URL and timestamp.

**Acceptance Scenarios**:

1. **Given** a successful deployment, **When** a developer visits the repo's "Environments" page on GitHub, **Then** a `github-pages` environment entry exists showing the live URL and last deployment timestamp.
2. **Given** a deployment is in progress, **When** a developer views the PR or commit that triggered it, **Then** a deployment status badge/check is visible.

---

### User Story 4 - Direct Pushes to Main Are Blocked (Priority: P2)

A developer attempts to push commits directly to `main` without opening a pull request. The push is rejected by the repository, and the developer must use the PR flow instead.

**Why this priority**: Enforces code review as the only path to production, reducing the risk of unreviewed or untested changes reaching the deployed app. Paired with P1 so that automated deployment is only triggered by reviewed code.

**Independent Test**: Clone the repo, make a commit locally on `main`, and attempt `git push origin main` — the push must be rejected with a clear error.

**Acceptance Scenarios**:

1. **Given** a developer has a commit on their local `main`, **When** they push directly to `origin/main`, **Then** the push is rejected with a permissions error.
2. **Given** branch protection is active, **When** a developer opens a PR from a feature branch into `main`, **Then** the PR can be merged normally and triggers the deployment workflow.
3. **Given** branch protection is active, **When** a repository administrator attempts a direct push, **Then** the push is also rejected (no bypass for admins).

---

### Edge Cases

- What happens if the workflow is triggered but GitHub Pages is not yet enabled in the repository settings? → Deployment step fails with a clear error message; the developer must enable Pages manually once.
- What happens if a developer tries to push directly to `main` after branch protection is enabled? → The push is rejected; they must create a branch, push to it, and open a PR.
- What happens if two PRs are merged in quick succession? → Both runs queue; the second run deploys after the first completes, resulting in the latest version being live.
- What happens if the app has client-side routing (e.g., `/menu/123`)? → Direct navigation to sub-paths may result in 404 from the static host; out of scope for this spec (can be addressed separately with a custom 404 page).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The deployment workflow MUST trigger automatically on every push to the `main` branch (which covers both direct pushes and PR merges).
- **FR-002**: The workflow MUST build the application as a fully static export before deploying.
- **FR-003**: The built output MUST be published to GitHub Pages using the repository's built-in Pages deployment mechanism.
- **FR-004**: The workflow MUST fail the deployment step if the build step exits with an error, leaving the previously published version intact.
- **FR-005**: The deployed application MUST be accessible at the public GitHub Pages URL for the repository (`https://barbulina.github.io/sdd-rations-calculator/`).
- **FR-006**: The application's internal links and assets MUST resolve correctly when served from the repository sub-path (`/sdd-rations-calculator/`).
- **FR-007**: The workflow MUST use Node.js and install dependencies before building.
- **FR-008**: The workflow MUST NOT require any secrets or environment variables beyond the standard `GITHUB_TOKEN` provided automatically by GitHub Actions.
- **FR-009**: The `main` branch MUST be protected so that direct pushes are rejected for all contributors, including repository administrators.
- **FR-010**: Merging into `main` MUST only be possible via a pull request; at least 1 approving review MUST be required before a PR can be merged.

### Assumptions

- The repository is `Barbulina/sdd-rations-calculator` and GitHub Pages is (or will be) configured to serve from GitHub Actions in the repository settings.
- The app is fully client-side (no server-side rendering at runtime), making a static export appropriate.
- No external API calls at build time that would require secrets.
- The `basePath` will be set to `/sdd-rations-calculator` to match the GitHub Pages sub-path URL.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After merging a PR to `main`, the updated app is live at the GitHub Pages URL within 5 minutes of the merge.
- **SC-002**: 100% of successful builds result in a live deployment with no manual steps required.
- **SC-003**: A broken build (build error) never overwrites a previously working deployment — 0 regressions from CI failures.
- **SC-004**: All app pages and assets load without errors (no 404s for JS/CSS/images) when accessed from the GitHub Pages URL.
- **SC-005**: The workflow run history in GitHub Actions provides a clear pass/fail signal for every deployment attempt.
- **SC-006**: Direct pushes to `main` are rejected 100% of the time — no commits can reach `main` without going through a PR.
