<!--
SYNC IMPACT REPORT
==================
Version Change: 1.4.0 → 1.5.0 (MINOR)
Rationale: Clarified and consolidated principles, removed placeholder tokens, enhanced governance clarity

Modified Principles:
- I. Architectural Integrity: Consolidated description, removed placeholder
- II. Testing Strategy: Consolidated description, removed placeholder
- III. Methodology (Test-First): Consolidated description, removed placeholder
- IV. Design & Implementation: Merged design tokens principle, removed placeholders
- V. Availability & Resilience: Consolidated description, removed placeholder
- VI. Quality Assurance: Merged integration testing and E2E principles

Added Sections:
- None (restructured existing content)

Removed Sections:
- Duplicate principle descriptions (consolidated into primary principles)

Templates Status:
- ✅ plan-template.md: Constitution Check section aligns with principles
- ✅ spec-template.md: User story structure supports TDD workflow
- ✅ tasks-template.md: Task organization supports hexagonal boundaries

Follow-up TODOs:
- None
-->

# Rations Calculator Constitution

## Core Principles

### I. Architectural Integrity
Next.js framework with Simplified Hexagonal Architecture following the flow: **UI/View → Hook → Use Case → Repository → Entity**. Uses TypeScript, ESLint, server-side rendering first, and App Router. API endpoints will also be implemented in Next.js. The Domain layer (`src/core/domain`) MUST remain isolated from infrastructure concerns—no framework imports, no UI logic, no direct database access.

**Rationale**: Hexagonal architecture ensures domain logic remains testable, portable, and independent of external dependencies. This enables true unit testing of business rules and facilitates future migrations or refactoring.

### II. Testing Strategy
Use the **Builder Pattern** to construct entities in tests, decoupling test suites from entity constructor changes. Builders provide fluent APIs for test data creation and enable easy fixture customization.

**Rationale**: Direct entity instantiation in tests creates brittle coupling. When entity constructors change (new required fields, validation rules), hundreds of test files break. Builders centralize this knowledge and provide default valid states.

### III. Methodology (Test-First)
TDD is mandatory: Tests written → User approved → Tests fail → Then implement. Follow the Red-Green-Refactor cycle strictly. No implementation code may be written before a failing test exists for that behavior.

**Rationale**: Test-first development ensures requirements are understood before implementation begins, prevents scope creep, and guarantees test coverage. It also serves as executable documentation of intended behavior.

### IV. Design & Implementation
All UI values MUST come from **Specify** via `tokens.json` following **Google's Material Design 3 (M3)** guidelines (color roles, elevation, type scales). These tokens are injected into `tailwind.config.ts`. Hardcoding hex values or pixel dimensions is forbidden. All UI will be built mobile-first and responsive, prioritizing touch interaction and Material M3 motion/spacing principles.

**Rationale**: Design tokens ensure visual consistency, enable theme switching, support accessibility (e.g., color contrast ratios), and allow designers to update the entire system without touching code. Mobile-first ensures optimal experience on the primary use case device.

### V. Availability & Resilience
The application MUST be **Offline First**. It must remain fully functional without internet access by caching assets and utilizing local persistence (IndexedDB/LocalStorage) via the Repository Pattern. Data synchronization must occur transparently when connectivity is restored.

**Rationale**: Users in areas with unreliable connectivity or on mobile devices frequently experience network interruptions. Offline-first architecture ensures uninterrupted workflows and better user experience. The Repository Pattern abstracts persistence, allowing seamless switching between local and remote data sources.

### VI. Quality Assurance
**Integration Testing**: Focus on contract tests for new libraries, contract changes, inter-service communication, and shared schemas. Use integration tests to verify repository implementations against actual storage mechanisms (IndexedDB, API contracts).

**E2E Testing**: Use Playwright to cover critical user flows with end-to-end tests, including offline capability verification. Focus on happy paths and essential user journeys rather than exhaustive scenario coverage.

**Rationale**: Integration tests catch interface mismatches that unit tests miss. E2E tests validate the full stack in realistic conditions, especially critical for PWA offline behavior which cannot be validated through unit tests alone.

## Technical Constraints

**Technology Stack**:
- **Framework**: Next.js with App Router (React Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS using Material Design 3 design tokens from Specify
- **Data Access**: Repository Pattern is mandatory for all data operations
- **Offline Storage**: IndexedDB (primary) and LocalStorage (configuration)
- **Testing**: Vitest (unit/integration), Playwright (E2E)

**Architecture Rules**:
- Domain layer (`src/core/domain`) contains only pure TypeScript—no framework dependencies
- Use Cases orchestrate domain logic and coordinate repositories
- Repositories handle data persistence and caching for offline support
- Infrastructure hooks (`src/infrastructure/hooks`) connect UI to Use Cases
- No business logic in UI components—components only render and delegate to hooks

**Performance Requirements**:
- First Contentful Paint (FCP) < 1.5s on 3G
- Time to Interactive (TTI) < 3.5s on 3G
- Lighthouse PWA score ≥ 90
- Offline functionality must work on first visit after initial load

## Development Workflow

**Feature Development Process**:
1. Specification created via `/speckit.specify` command with prioritized user stories
2. Implementation plan generated via `/speckit.plan` (research, data model, contracts)
3. Tasks broken down via `/speckit.tasks` organized by user story for independent delivery
4. Implementation proceeds via `/speckit.implement` following TDD cycle
5. Quality verification via `/speckit.checklist` before PR submission

**Code Review Requirements**:
- All PRs must verify Hexagonal boundary compliance (no domain → infrastructure imports)
- All PRs must confirm design token usage (no hardcoded colors/spacing)
- All PRs must include tests written before implementation
- Complexity introductions must be justified in the PR description

**Quality Gates**:
- Unit tests pass (domain and use case layers)
- Integration tests pass (repository contracts)
- E2E tests pass (critical user flows including offline)
- Linting passes (ESLint + TypeScript strict mode)
- No accessibility violations (automated checks)

## Governance

This constitution supersedes all other development practices and conventions. All pull requests and code reviews MUST verify compliance with these principles. Any deviation or complexity introduction MUST be explicitly justified with documented rationale.

**Amendment Process**: Constitution changes require:
1. Documented proposal with rationale
2. Impact analysis on existing codebase
3. Migration plan for affected code
4. Update to all dependent templates and documentation
5. Version bump following semantic versioning

**Versioning Policy**:
- MAJOR: Backward-incompatible governance changes or principle removals
- MINOR: New principles added or material expansions to existing principles
- PATCH: Clarifications, wording improvements, non-semantic refinements

**Compliance Review**: The constitution is reviewed during:
- Feature specification phase (via Constitution Check in plan.md)
- Pull request reviews (mandatory verification)
- Quarterly architecture reviews
- Before any major refactoring initiatives

**AI Agent Guidance**: This file serves as the primary context for AI Agent (GitHub Copilot) guidance. All AI-assisted development must align with these principles. Use `.github/agents/` files for agent-specific workflow instructions.

**Version**: 1.5.0 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11
