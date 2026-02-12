/**
 * Custom Aliment Types
 *
 * Type definitions for custom user-created aliments.
 * These extend the existing AlimentInfo interface from the catalog.
 */

import type { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import type { RationsType } from "@/src/domain/models/RationsType";

/**
 * CustomAliment
 *
 * Represents a user-created aliment with persistence fields.
 * Extends AlimentInfo from the catalog with ID and timestamps.
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

// Equivalent to:
// {
//   name: string;
//   type: RationsType;
//   gramsToCarbohydrate: number;
//   bloodGlucoseIndex?: number;
// }

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
 * Type guard to check if an AlimentInfo is a CustomAliment
 */
export function isCustomAliment(
  aliment: AlimentInfo,
): aliment is CustomAliment {
  return "isCustom" in aliment && aliment.isCustom === true;
}

/**
 * Validation error thrown by repository
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Storage quota exceeded error
 */
export class StorageQuotaError extends Error {
  constructor(message: string = "Storage quota exceeded") {
    super(message);
    this.name = "StorageQuotaError";
  }
}
