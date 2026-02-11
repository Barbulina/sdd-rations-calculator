# Rations Calculator PWA

Offline-first Progressive Web App for calculating food rations following Material Design 3 principles.

## Project Status

**Current Feature**: Design Token System (Branch: `001-design-token-system`)  
**Phase**: Implementation complete - Polish phase in progress  
**Completed**: Setup, Foundational infrastructure, Token definitions, Specimen page, Theme toggle

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Build Design Tokens

Transform design tokens from `tokens.json` to Tailwind CSS configuration:

```bash
npm run tokens:build
```

This will:
1. Validate token schema
2. Check WCAG AA contrast ratios
3. Generate `tailwind-tokens.js` and `css-variables.css`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

Visit [http://localhost:3000/design-tokens](http://localhost:3000/design-tokens) to view the design token specimen page.

## Design Token System

### Features Implemented

- ✅ **Category Colors** (7 aliment categories)
  - Lacteal, Cereals/Flours/Pulses/Legumes/Tubers, Fruits, Vegetables, Oily/Dry Fruits, Drinks, Others
  - Material Design 3 color roles with light/dark theme support
  
- ✅ **State Indicators** (4 states)
  - Offline, Syncing, Sync Error, Online
  
- ✅ **Feedback States** (4 types)
  - Success, Warning, Error, Info
  
- ✅ **Typography Scale** (12 tokens)
  - Headings 1-6, Body Large/Medium/Small, Label Large/Medium/Small
  - Material Design 3 type scale
  
- ✅ **Spacing Scale** (10 tokens)
  - 8px grid system (0px to 96px)
  - Touch target compliant (44px minimum)

### Token Infrastructure

- **Schema Validation**: Ensures all required tokens exist with correct structure
- **Contrast Validation**: WCAG AA compliance (4.5:1 for normal text, 3.0:1 for large text)
- **Style Dictionary**: Automated transformation to Tailwind CSS
- **Theme Switching**: next-themes for light/dark mode with persistent user preference
- **Theme Toggle**: Click the sun/moon button in the top-right corner to switch themes

## Project Structure

```
sdd-rations-calculator/
├── app/                          # Next.js App Router
│   ├── design-tokens/           # Token specimen page
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page
│   ├── providers.tsx            # Client-side providers
│   └── globals.css              # Global styles
├── src/
│   └── infrastructure/
│       └── design-tokens/       # Design token system
│           ├── tokens.json      # Source of truth (50 tokens)
│           ├── validate-schema.ts
│           ├── validate-contrast.ts
│           ├── build-tokens.ts
│           └── style-dictionary.config.js
├── specs/
│   └── 001-design-token-system/ # Feature specification
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       └── contracts/
└── tests/
    └── integration/
        └── design-tokens/       # Integration tests (to be added)
```

## Constitutional Principles

This project follows strict architectural principles:

1. **Architectural Integrity**: Hexagonal architecture with domain isolation
2. **Testing Strategy**: Builder pattern for entities
3. **Test-First Methodology**: TDD with Red-Green-Refactor
4. **Design & Implementation**: All UI values from design tokens, M3 guidelines, Tailwind CSS
5. **Availability & Resilience**: Offline-first PWA with local persistence
6. **Quality Assurance**: Integration tests for contracts, E2E for critical flows

## Next Steps

1. Run `npm run tokens:build` to generate Tailwind configuration
2. Verify WCAG AA contrast compliance
3. Implement integration tests
4. Add theme toggle component
5. Create documentation

## Documentation

- [Feature Specification](./specs/001-design-token-system/spec.md)
- [Implementation Plan](./specs/001-design-token-system/plan.md)
- [Task Breakdown](./specs/001-design-token-system/tasks.md)
- [Quickstart Guide](./specs/001-design-token-system/quickstart.md)
- [Constitution](./.specify/memory/constitution.md)

## License

Private project
