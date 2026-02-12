"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRationRepository } from "@/src/application/contexts/RationRepositoryContext";
import type { CreateRationDTO } from "@/src/domain/models/Ration";
import { RationsType } from "@/src/domain/models/RationsType";

/**
 * Create Ration Page
 *
 * Form page for creating new ration entries.
 * Features:
 * - Form validation with error messages
 * - Type dropdown with all 7 ration types
 * - Optional blood glucose index field
 * - Cancel and Save actions
 * - Loading state during submission
 * - Error handling for storage failures
 *
 * @see ../../../../specs/002-ration-menu-management/spec.md for user story
 */
export default function CreateRationPage() {
  const router = useRouter();
  const repository = useRationRepository();

  // Form state
  const [formData, setFormData] = useState<CreateRationDTO>({
    type: RationsType.lacteal,
    name: "",
    gramsToCarbohydrate: 0,
    weight: 0,
    rations: 0,
    bloodGlucoseIndex: undefined,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  /**
   * Validate form data
   * @returns true if valid, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 200) {
      newErrors.name = "Name must be 200 characters or less";
    }

    // Grams to carbohydrate validation
    if (formData.gramsToCarbohydrate <= 0) {
      newErrors.gramsToCarbohydrate = "Must be greater than 0";
    }

    // Weight validation
    if (formData.weight <= 0) {
      newErrors.weight = "Must be greater than 0";
    }

    // Rations validation
    if (formData.rations <= 0) {
      newErrors.rations = "Must be greater than 0";
    }

    // Blood glucose index validation (optional field)
    if (
      formData.bloodGlucoseIndex !== undefined &&
      (formData.bloodGlucoseIndex < 0 || formData.bloodGlucoseIndex > 100)
    ) {
      newErrors.bloodGlucoseIndex = "Blood glucose index must be between 0-100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Validate form
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save ration
      await repository.save(formData);

      // Navigate back to home
      router.push("/");
    } catch (error) {
      console.error("Failed to save ration:", error);
      setSubmitError(
        "Storage full - please delete some rations or try again later",
      );
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    router.push("/");
  };

  /**
   * Update form field
   */
  const updateField = (field: keyof CreateRationDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create Ration</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Create new ration"
      >
        {/* Type Dropdown */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => updateField("type", e.target.value as RationsType)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            aria-required="true"
            aria-label="Ration type"
          >
            <option value={RationsType.lacteal}>{RationsType.lacteal}</option>
            <option value={RationsType.cereals_flours_pulses_legumes_tubers}>
              {RationsType.cereals_flours_pulses_legumes_tubers}
            </option>
            <option value={RationsType.fruits}>{RationsType.fruits}</option>
            <option value={RationsType.vegetables}>
              {RationsType.vegetables}
            </option>
            <option value={RationsType.oily_and_dry_fruit}>
              {RationsType.oily_and_dry_fruit}
            </option>
            <option value={RationsType.drinks}>{RationsType.drinks}</option>
            <option value={RationsType.others}>{RationsType.others}</option>
          </select>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *{" "}
            <span className="text-xs text-gray-500">
              ({formData.name.length}/200)
            </span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            maxLength={200}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="e.g., Leche desnatada"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Grams to Carbohydrate */}
        <div>
          <label
            htmlFor="gramsToCarbohydrate"
            className="block text-sm font-medium mb-1"
          >
            Grams to Carbohydrate (10g HC) *
          </label>
          <input
            id="gramsToCarbohydrate"
            type="number"
            value={formData.gramsToCarbohydrate || ""}
            onChange={(e) =>
              updateField(
                "gramsToCarbohydrate",
                parseFloat(e.target.value) || 0,
              )
            }
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="e.g., 200"
          />
          {errors.gramsToCarbohydrate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.gramsToCarbohydrate}
            </p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium mb-1">
            Weight (grams) *
          </label>
          <input
            id="weight"
            type="number"
            value={formData.weight || ""}
            onChange={(e) =>
              updateField("weight", parseFloat(e.target.value) || 0)
            }
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="e.g., 250"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>

        {/* Rations */}
        <div>
          <label htmlFor="rations" className="block text-sm font-medium mb-1">
            Rations *
          </label>
          <input
            id="rations"
            type="number"
            value={formData.rations || ""}
            onChange={(e) =>
              updateField("rations", parseFloat(e.target.value) || 0)
            }
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="e.g., 1.25"
          />
          {errors.rations && (
            <p className="text-red-500 text-sm mt-1">{errors.rations}</p>
          )}
        </div>

        {/* Blood Glucose Index (Optional) */}
        <div>
          <label
            htmlFor="bloodGlucoseIndex"
            className="block text-sm font-medium mb-1"
          >
            Blood Glucose Index (optional, 0-100)
          </label>
          <input
            id="bloodGlucoseIndex"
            type="number"
            value={formData.bloodGlucoseIndex || ""}
            onChange={(e) =>
              updateField(
                "bloodGlucoseIndex",
                e.target.value ? parseFloat(e.target.value) : undefined,
              )
            }
            min="0"
            max="100"
            step="1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="e.g., 32"
          />
          {errors.bloodGlucoseIndex && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bloodGlucoseIndex}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
            {submitError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Ration"}
          </button>
        </div>
      </form>
    </div>
  );
}
