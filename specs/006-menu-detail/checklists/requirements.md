# Checklist: Requirements — Menu Detail

**Feature**: 006-menu-detail

## Functional Requirements

- [x] FR-001: MenuCard en home es un enlace a `/menu/[id]`
- [x] FR-002: Ruta `/menu/[id]` existe como página dinámica Next.js
- [x] FR-003: Página carga menú por ID desde `MenuRepository.getById()`
- [x] FR-004: Loading state mientras se carga
- [x] FR-005: "Menu not found" si el ID no existe
- [x] FR-006: Lista de alimentos con nombre, peso (g), raciones (2 decimales)
- [x] FR-007: Resumen con total de raciones y peso
- [x] FR-008: Nombre editable via `<input>` (maxLength 200)
- [x] FR-009: Tipo editable via `<select>` con las 4 opciones
- [x] FR-010: "Save changes" llama a `MenuRepository.update()`
- [x] FR-011: Validación: nombre no puede estar vacío
- [x] FR-012: Cada alimento tiene botón de eliminar
- [x] FR-013: No se puede eliminar el último alimento
- [x] FR-014: Buscador reutiliza `AutocompleteSearch` + `WeightInputDialog`
- [x] FR-015: Añadir/eliminar recalcula totales y guarda automáticamente
- [x] FR-016: Enlace "← My Menus" lleva a `/`

## User Stories Coverage

- [x] US1 (P1): View Menu Detail — all FR-001–FR-007, FR-016 covered
- [x] US2 (P2): Edit Name and Type — FR-008–FR-011 covered
- [x] US3 (P3): Remove Aliment — FR-012, FR-013, FR-015 covered
- [x] US4 (P4): Add Aliment — FR-014, FR-015 covered
