import { useState, useEffect, useRef } from "react";

interface WeightInputDialogProps {
  isOpen: boolean;
  alimentName: string;
  gramsToCarbohydrate?: number;
  onAdd: (weight: number) => void;
  onCancel: () => void;
}

export function WeightInputDialog({
  isOpen,
  alimentName,
  gramsToCarbohydrate,
  onAdd,
  onCancel,
}: WeightInputDialogProps) {
  const [weight, setWeight] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setWeight("");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

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

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeight(value);
    if (value) validateWeight(value);
    else setError("");
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    if (validateWeight(weight)) {
      setIsSubmitting(true);
      const numValue = parseFloat(weight);
      onAdd(numValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const isValid = weight !== "" && !error && parseFloat(weight) > 0;
  const numWeight = parseFloat(weight);
  const previewRations =
    !isNaN(numWeight) && gramsToCarbohydrate && gramsToCarbohydrate > 0
      ? numWeight / gramsToCarbohydrate
      : null;

  if (!isOpen) return null;

  return (
    <div
      data-testid="dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
      >
        <h2
          id="dialog-title"
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Add {alimentName}
        </h2>

        <p
          id="dialog-description"
          className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5"
        >
          Enter the weight in grams (1-10000g)
        </p>

        <div className="mb-4">
          <label
            htmlFor="weight-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-lg ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="150"
            inputMode="numeric"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {previewRations !== null && previewRations > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ≈{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {previewRations.toFixed(2)}
              </span>{" "}
              rations
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition active:scale-[0.98] ${
              isValid && !isSubmitting
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add to menu"}
          </button>
        </div>
      </div>
    </div>
  );
}
