# Data Model: GitHub Pages Automated Deployment

**Feature**: 011-gh-pages-deploy  
**Date**: 2026-05-12

## Overview

This feature introduces no new domain entities, application models, or database schema changes.

All data in the app continues to be stored in **browser localStorage** at runtime. The static export process does not read or write any application data.

## Infrastructure Artifacts (not domain entities)

The following configuration artifacts are created/modified:

| Artifact                 | Type                    | Location                        | Purpose                                                         |
| ------------------------ | ----------------------- | ------------------------------- | --------------------------------------------------------------- |
| `deploy.yml`             | GitHub Actions workflow | `.github/workflows/deploy.yml`  | CI/CD pipeline definition                                       |
| `next.config.ts`         | Build configuration     | `next.config.ts` (project root) | Static export settings                                          |
| `page.tsx` (menu detail) | Next.js page            | `app/menu/[id]/page.tsx`        | `generateStaticParams` addition for static export compatibility |

## `next.config.ts` Configuration Delta

```typescript
// Before
const nextConfig = {
  experimental: { turbo: {} },
};

// After
const nextConfig = {
  output: "export", // NEW: static export mode
  basePath: "/sdd-rations-calculator", // NEW: GitHub Pages sub-path
  trailingSlash: true, // NEW: /route/ → route/index.html
  images: { unoptimized: true }, // NEW: disable server-side image optimization
  experimental: { turbo: {} }, // UNCHANGED
};
```

## `app/menu/[id]/page.tsx` Delta

```typescript
// Add at module level (outside the component function):
export const dynamicParams = false;
export function generateStaticParams() {
  // IDs come from localStorage at runtime; pre-generation is not applicable.
  // Returning [] satisfies Next.js static export requirement.
  // Client-side navigation works correctly; direct URL access will 404 on GitHub Pages.
  return [];
}
```

## State Transitions (deployment pipeline)

```
PR merged to main
      ↓
[build job] checkout → install → test → next build → upload artifact
      ↓ (build fails → deploy blocked, previous version remains live)
[deploy job] download artifact → deploy to GitHub Pages
      ↓
App live at https://barbulina.github.io/sdd-rations-calculator/
```
