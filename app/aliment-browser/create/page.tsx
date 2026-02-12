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
      <h1 className="text-3xl font-bold mb-6">Create Custom Aliment</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Homemade Granola"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Grams to Carbohydrate Field */}
        <div>
          <label
            htmlFor="gramsToCarbohydrate"
            className="block text-sm font-medium mb-2"
          >
            Grams to Carbohydrate *
          </label>
          <input
            id="gramsToCarbohydrate"
            type="number"
            step="0.01"
            value={formData.gramsToCarbohydrate}
            onChange={(e) =>
              setFormData({ ...formData, gramsToCarbohydrate: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.gramsToCarbohydrate ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 15.5"
            disabled={isSubmitting}
          />
          {errors.gramsToCarbohydrate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.gramsToCarbohydrate}
            </p>
          )}
        </div>

        {/* Blood Glucose Index Field */}
        <div>
          <label
            htmlFor="bloodGlucoseIndex"
            className="block text-sm font-medium mb-2"
          >
            Blood Glucose Index *
          </label>
          <input
            id="bloodGlucoseIndex"
            type="number"
            step="0.01"
            value={formData.bloodGlucoseIndex}
            onChange={(e) =>
              setFormData({ ...formData, bloodGlucoseIndex: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.bloodGlucoseIndex ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 55"
            disabled={isSubmitting}
          />
          {errors.bloodGlucoseIndex && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bloodGlucoseIndex}
            </p>
          )}
        </div>

        {/* Type Field */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Categoría *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as RationsType })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            disabled={isSubmitting}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Aliment"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
