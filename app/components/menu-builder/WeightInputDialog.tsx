"use client";

import { useState, useEffect, useRef } from "react";

interface WeightInputDialogProps {
  isOpen: boolean;
  alimentName: string;
  onAdd: (weight: number) => void;
  onCancel: () => void;
}

export function WeightInputDialog({
  isOpen,
  alimentName,
  onAdd,
  onCancel,
}: WeightInputDialogProps) {
  const [weight, setWeight] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setWeight("");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Validate weight
  const validateWeight = (value: string): boolean => {
    const numValue = parseFloat(value);

    if (!value || isNaN(numValue)) {
      setError("Weight is required");
      return false;
    }

    if (numValue < 1 || numValue > 10000) {
      setError("Weight must be between 1 and 10000 grams");
      return false;
    }

    setError("");
    return true;
  };

  // Handle weight change
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeight(value);
    validateWeight(value);
  };

  // Handle submit
  const handleSubmit = () => {
    if (isSubmitting) return; // Prevent double submit

    if (validateWeight(weight)) {
      setIsSubmitting(true);
      const numValue = parseFloat(weight);
      onAdd(numValue);
      // Note: Dialog will be closed by parent, which resets isSubmitting via useEffect
    }
  };

  // Handle Enter key on input only
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const isValid = weight !== "" && !error;

  if (!isOpen) return null;

  return (
    <div
      data-testid="dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          id="dialog-title"
          className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100"
        >
          Add {alimentName}
        </h2>

        {/* Description */}
        <p
          id="dialog-description"
          className="text-sm text-gray-600 dark:text-gray-400 mb-4"
        >
          Enter the weight in grams (1-10000g)
        </p>

        {/* Weight Input */}
        <div className="mb-4">
          <label
            htmlFor="weight-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Weight (grams)
          </label>
          <input
            ref={inputRef}
            id="weight-input"
            type="number"
            min="1"
            max="10000"
            value={weight}
            onChange={handleWeightChange}
            onKeyDown={handleInputKeyDown}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            placeholder="150"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`px-4 py-2 rounded-md font-medium transition ${
              isValid && !isSubmitting
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
