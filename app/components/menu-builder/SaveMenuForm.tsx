/**
 * SaveMenuForm Component
 * Form for saving menu with name and type selection
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MenuType } from '@/src/domain/models/MenuType';

interface SaveMenuFormProps {
  onSave: (name: string, type: MenuType) => void | Promise<void>;
  isLoading: boolean;
  error: string | null;
  hasItems: boolean;
}

export function SaveMenuForm({ onSave, isLoading, error, hasItems }: SaveMenuFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<MenuType | ''>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, type: false });

  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.length > 200) {
      return 'Name must be 200 characters or less';
    }
    return null;
  };

  const validateType = (value: string): string | null => {
    if (!value) {
      return 'Type is required';
    }
    return null;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Always validate to keep error state in sync
    setNameError(validateName(value));
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MenuType | '';
    setType(value);
    
    // Always validate to keep error state in sync
    setTypeError(validateType(value));
  };

  const handleTypeBlur = () => {
    setTouched(prev => ({ ...prev, type: true }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameValidation = validateName(name);
    const typeValidation = validateType(type);

    setNameError(nameValidation);
    setTypeError(typeValidation);
    setTouched({ name: true, type: true });

    if (nameValidation || typeValidation) {
      return;
    }

    // Call onSave with validated data
    onSave(name, type as MenuType);
  };

  const handleCancel = () => {
    if (!isLoading) {
      router.back();
    }
  };

  const isFormValid = !nameError && !typeError && name.trim() && type;
  const isSaveDisabled = !hasItems || isLoading || !isFormValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Global Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor="menu-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Menu Name
        </label>
        <input
          id="menu-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          disabled={isLoading}
          aria-label="Menu Name"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? 'name-error' : undefined}
          className={`
            w-full px-3 py-2 border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
            ${nameError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}
          `}
          placeholder="Enter menu name"
        />
        {nameError && (
          <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {nameError}
          </p>
        )}
      </div>

      {/* Type Select */}
      <div>
        <label
          htmlFor="menu-type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Menu Type
        </label>
        <select
          id="menu-type"
          value={type}
          onChange={handleTypeChange}
          onBlur={handleTypeBlur}
          disabled={isLoading}
          aria-label="Menu Type"
          aria-invalid={!!typeError}
          aria-describedby={typeError ? 'type-error' : undefined}
          className={`
            w-full px-3 py-2 border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
            ${typeError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}
          `}
        >
          <option value="">Select a type...</option>
          <option value="BREAKFAST">Breakfast</option>
          <option value="LUNCH">Lunch</option>
          <option value="DINNER">Dinner</option>
          <option value="SNACK">Snack</option>
        </select>
        {typeError && (
          <p id="type-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {typeError}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaveDisabled}
          className="
            flex-1 px-4 py-2 bg-blue-600 text-white rounded-md
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500
            transition-colors
          "
        >
          {isLoading ? 'Saving...' : 'Save Menu'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="
            px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md
            hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            transition-colors
          "
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
