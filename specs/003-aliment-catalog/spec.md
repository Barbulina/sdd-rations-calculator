# Feature Specification: Custom Aliment Creation

**Feature ID**: 003-aliment-catalog  
**Created**: 2026-02-12  
**Status**: Planning

## Overview

Enable users to create custom aliment entries to supplement the pre-defined catalog of 365+ food items. Custom aliments will be stored locally and merged with the catalog for a complete browsing experience.

## Problem Statement

Currently, the aliment catalog contains 365+ pre-defined food items, but users cannot add custom aliments that aren't in the catalog. When searching for a specific food item that doesn't exist in the catalog, users have no way to add it.

## User Stories

### US-1: Create Custom Aliment from Browser (Priority: HIGH)

**As a** nutrition tracker  
**I want to** create a custom aliment when it's not found in the catalog  
**So that** I can track all my food items, even those not pre-defined

**Acceptance Criteria**:
- Given I'm on the aliment browser page `/aliment-browser`
- When I click a "Create Custom Aliment" button
- Then I'm navigated to `/aliment-browser/create` with a form

**Acceptance Criteria**:
- Given I'm on the aliment browser page
- When I search for an aliment that doesn't exist (0 results)
- Then I see a "Create '[search term]'" button in the empty state
- When I click it, I'm navigated to `/aliment-browser/create` with the search term pre-filled

### US-2: Custom Aliment Form (Priority: HIGH)

**As a** nutrition tracker  
**I want to** fill out aliment details  
**So that** I can save accurate nutritional information

**Acceptance Criteria**:
- Form includes fields:
  - Name (required, max 200 chars)
  - Category/Type (required, dropdown with 7 options)
  - Grams to Carbohydrate (required, number > 0)
  - Blood Glucose Index (optional, 0-100)
- Form validates all required fields
- Form shows field-level errors
- Form has Cancel and Save buttons

### US-3: Browse Combined Catalog (Priority: MEDIUM)

**As a** nutrition tracker  
**I want to** see custom aliments mixed with pre-defined catalog  
**So that** I have a complete view of all available aliments

**Acceptance Criteria**:
- Custom aliments display with a visual indicator (badge or icon)
- Search function includes custom aliments
- Category filter includes custom aliments
- Custom aliments can be edited/deleted

### US-4: Use Custom Aliment in Rations (Priority: MEDIUM)

**As a** nutrition tracker  
**I want to** use custom aliments when creating rations  
**So that** I can create complete meal plans

**Acceptance Criteria**:
- Custom aliments appear in aliment browser
- When creating a ration from a custom aliment, all fields populate correctly
- Custom aliment data persists across sessions

## Technical Requirements

### Data Model

**CustomAliment** (extends AlimentInfo):
```typescript
interface CustomAliment extends AlimentInfo {
  id: string;              // UUID for custom aliments
  createdAt: Date;         // Timestamp
  isCustom: true;          // Flag to differentiate from catalog
}
```

### Storage

- **Repository**: CustomAlimentRepository (follows existing pattern)
- **Implementation**: LocalStorageCustomAlimentRepository
- **Key**: `sdd-rations-calculator:custom-aliments`
- **Format**: JSON array of CustomAliment objects

### UI Components

- `/aliment-browser/create` - Create custom aliment page
- Empty state with "Create" CTA in `/aliment-browser`
- "Create Custom Aliment" button in browser header
- Custom badge/indicator in aliment cards

## Non-Functional Requirements

### Performance
- Form validation must be instant (<50ms)
- Custom aliments merged with catalog in <100ms
- No impact on existing 365+ catalog load time

### Accessibility
- Form must be keyboard navigable
- ARIA labels for all form fields
- Error messages must be announced to screen readers

### Offline Support
- Custom aliments stored in localStorage
- Form works offline
- No dependency on network for CRUD operations

## Constraints

- Must follow hexagonal architecture (domain isolation)
- Must use existing design tokens (no hardcoded styles)
- Must follow TDD methodology
- Must maintain existing catalog immutability
- Storage quota: ~5-10MB limit for localStorage

## Success Metrics

- Users can create custom aliments in <30 seconds
- Form validation prevents invalid data
- Custom aliments persist across sessions
- No regression in catalog browser performance

## Dependencies

- Feature 001: Design token system (colors, spacing, typography)
- Feature 002: Ration management repository pattern

## Future Enhancements

- Export/import custom aliments
- Share custom aliments with other users
- Sync custom aliments across devices
- Suggest similar catalog items when creating custom aliment
- Bulk import from CSV/Excel
