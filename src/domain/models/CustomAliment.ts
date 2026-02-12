/**
 * CustomAliment Domain Model
 *
 * Represents a user-created aliment with persistence fields.
 * Extends AlimentInfo from the catalog with ID and timestamps.
 *
 * @see specs/003-aliment-catalog/data-model.md
 * @see Constitution Principle I: Domain layer remains isolated from infrastructure
 */

import type { AlimentInfo } from "./AlimentInfo";
import type { RationsType } from "./RationsType";

/**
 * CustomAliment interface
 *
 * User-created aliment with auto-generated fields for persistence.
 */
export interface CustomAliment extends AlimentInfo {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Creation timestamp */
  createdAt: Date;

  /** Type discriminator - always true for custom aliments */
  isCustom: true;

  /** Last modification timestamp (optional) */
  updatedAt?: Date;
}

/**
 * CreateCustomAlimentDTO
 *
 * Data transfer object for creating new custom aliments.
 * Omits auto-generated fields (id, createdAt, isCustom, updatedAt).
 */
export type CreateCustomAlimentDTO = Omit<
  CustomAliment,
  "id" | "createdAt" | "isCustom" | "updatedAt"
>;

/**
 * UpdateCustomAlimentDTO
 *
 * Data transfer object for updating existing custom aliments.
 * All fields optional except ID.
 */
export interface UpdateCustomAlimentDTO {
  /** ID of aliment to update (required) */
  id: string;

  /** Optional: New name */
  name?: string;

  /** Optional: New category */
  type?: RationsType;

  /** Optional: New grams to carbohydrate value */
  gramsToCarbohydrate?: number;

  /** Optional: New blood glucose index */
  bloodGlucoseIndex?: number;
}

/**
 * ValidationResult
 *
 * Result of validation with errors keyed by field name.
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate CreateCustomAlimentDTO
 *
 * Validates all fields according to business rules.
 * Pure function with no side effects.
 *
 * @param dto - Data transfer object to validate
 * @returns ValidationResult with valid flag and errors
 */
export function validateCustomAliment(
  dto: CreateCustomAlimentDTO,
): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  const trimmedName = dto.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required";
  } else if (trimmedName.length > 200) {
    errors.name = "Name must be 200 characters or less";
  }

  // Grams to carbohydrate validation
  if (dto.gramsToCarbohydrate <= 0) {
    errors.gramsToCarbohydrate = "Must be greater than 0";
  }

  // Blood glucose index validation (optional field)
  if (dto.bloodGlucoseIndex !== undefined) {
    if (dto.bloodGlucoseIndex < 0 || dto.bloodGlucoseIndex > 100) {
      errors.bloodGlucoseIndex = "Blood glucose index must be between 0-100";
    }
  }

  // Type validation - TypeScript ensures it's a valid RationsType at compile time
  // No runtime validation needed for enum

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate UpdateCustomAlimentDTO
 *
 * Validates update data with at least one field to update.
 *
 * @param dto - Update data transfer object
 * @returns ValidationResult with valid flag and errors
 */
export function validateCustomAlimentUpdate(
  dto: UpdateCustomAlimentDTO,
): ValidationResult {
  const errors: Record<string, string> = {};

  // Ensure at least one field to update
  const hasUpdates =
    dto.name !== undefined ||
    dto.type !== undefined ||
    dto.gramsToCarbohydrate !== undefined ||
    dto.bloodGlucoseIndex !== undefined;

  if (!hasUpdates) {
    errors.general = "At least one field must be provided for update";
  }

  // Validate name if provided
  if (dto.name !== undefined) {
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      errors.name = "Name is required";
    } else if (trimmedName.length > 200) {
      errors.name = "Name must be 200 characters or less";
    }
  }

  // Validate gramsToCarbohydrate if provided
  if (dto.gramsToCarbohydrate !== undefined && dto.gramsToCarbohydrate <= 0) {
    errors.gramsToCarbohydrate = "Must be greater than 0";
  }

  // Validate bloodGlucoseIndex if provided
  if (dto.bloodGlucoseIndex !== undefined) {
    if (dto.bloodGlucoseIndex < 0 || dto.bloodGlucoseIndex > 100) {
      errors.bloodGlucoseIndex = "Blood glucose index must be between 0-100";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Type guard to check if an AlimentInfo is a CustomAliment
 *
 * @param aliment - AlimentInfo to check
 * @returns true if aliment is a CustomAliment
 */
export function isCustomAliment(
  aliment: AlimentInfo,
): aliment is CustomAliment {
  return "isCustom" in aliment && (aliment as CustomAliment).isCustom === true;
}
