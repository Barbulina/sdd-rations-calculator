/**
 * Create Custom Aliment Page
 *
 * Form to create user-defined aliments with nutritional information.
 *
 * @see Constitution Principle I & II: Architectural Integrity + UX Excellence
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomAlimentRepository } from "@/src/application/contexts/CustomAlimentRepositoryContext";
import { RationsType } from "@/src/domain/models/RationsType";
import { PageHeader } from "@/app/components/PageHeader";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";

const CATEGORY_LABELS: Record<RationsType, string> = {
  [RationsType.lacteal]: "Lácteos",
  [RationsType.cereals_flours_pulses_legumes_tubers]: "Cereales y Legumbres",
  [RationsType.fruits]: "Frutas",
  [RationsType.vegetables]: "Hortalizas",
  [RationsType.oily_and_dry_fruit]: "Frutos Secos",
  [RationsType.drinks]: "Bebidas",
  [RationsType.others]: "Otros",
};

export default function CreateCustomAlimentPage() {
  const router = useRouter();
  const repository = useCustomAlimentRepository();

  const [formData, setFormData] = useState({
    name: "",
    gramsToCarbohydrate: "",
    bloodGlucoseIndex: "",
    type: RationsType.others,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    // Grams to Carbohydrate validation
    const gtc = parseFloat(formData.gramsToCarbohydrate);
    if (!formData.gramsToCarbohydrate) {
      newErrors.gramsToCarbohydrate = "Grams to Carbohydrate is required";
    } else if (isNaN(gtc) || gtc <= 0) {
      newErrors.gramsToCarbohydrate = "Must be a positive number";
    }

    // Blood Glucose Index validation
    const bgi = parseFloat(formData.bloodGlucoseIndex);
    if (!formData.bloodGlucoseIndex) {
      newErrors.bloodGlucoseIndex = "Blood Glucose Index is required";
    } else if (isNaN(bgi) || bgi <= 0) {
      newErrors.bloodGlucoseIndex = "Must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await repository.save({
        name: formData.name.trim(),
        gramsToCarbohydrate: parseFloat(formData.gramsToCarbohydrate),
        bloodGlucoseIndex: parseFloat(formData.bloodGlucoseIndex),
        type: formData.type,
      });

      router.push("/aliment-browser");
    } catch (error) {
      console.error("Failed to create custom aliment:", error);
      setErrors({ submit: "Failed to save aliment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/aliment-browser");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <PageHeader title="Create Custom Aliment" backHref="/aliment-browser" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            placeholder="e.g., Homemade Granola"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Grams to Carbohydrate Field */}
        <div>
          <label
            htmlFor="gramsToCarbohydrate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Grams to Carbohydrate *
          </label>
          <Input
            id="gramsToCarbohydrate"
            type="number"
            step="0.01"
            value={formData.gramsToCarbohydrate}
            onChange={(e) =>
              setFormData({ ...formData, gramsToCarbohydrate: e.target.value })
            }
            error={!!errors.gramsToCarbohydrate}
            placeholder="e.g., 15.5"
            disabled={isSubmitting}
          />
          {errors.gramsToCarbohydrate && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.gramsToCarbohydrate}
            </p>
          )}
        </div>

        {/* Blood Glucose Index Field */}
        <div>
          <label
            htmlFor="bloodGlucoseIndex"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Blood Glucose Index *
          </label>
          <Input
            id="bloodGlucoseIndex"
            type="number"
            step="0.01"
            value={formData.bloodGlucoseIndex}
            onChange={(e) =>
              setFormData({ ...formData, bloodGlucoseIndex: e.target.value })
            }
            error={!!errors.bloodGlucoseIndex}
            placeholder="e.g., 55"
            disabled={isSubmitting}
          />
          {errors.bloodGlucoseIndex && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.bloodGlucoseIndex}
            </p>
          )}
        </div>

        {/* Type Field */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría *
          </label>
          <Select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as RationsType })
            }
            disabled={isSubmitting}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Aliment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
