"use client";

import { useState, useEffect, useRef } from "react";
import { useCompositeAliments } from "@/src/application/hooks/useCompositeAliments";
import { searchByName } from "@/src/application/utils/search";
import type { UnifiedAliment } from "@/src/domain/repositories/CompositeAlimentRepository";
import { AlimentSuggestionItem } from "./AlimentSuggestionItem";

interface AutocompleteSearchProps {
  onSelectAliment: (aliment: UnifiedAliment) => void;
}

export function AutocompleteSearch({
  onSelectAliment,
}: AutocompleteSearchProps) {
  const repository = useCompositeAliments();
  const [aliments, setAliments] = useState<UnifiedAliment[]>([]);
  const [isLoadingAliments, setIsLoadingAliments] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all aliments on mount
  useEffect(() => {
    let mounted = true;

    async function loadAliments() {
      setIsLoadingAliments(true);
      try {
        const allAliments = await repository.findAll();
        if (mounted) {
          setAliments(allAliments);
        }
      } finally {
        if (mounted) {
          setIsLoadingAliments(false);
        }
      }
    }

    loadAliments();

    return () => {
      mounted = false;
    };
  }, [repository]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter aliments based on debounced search term
  const filteredAliments = debouncedSearchTerm.trim()
    ? searchByName(aliments, debouncedSearchTerm)
    : [];

  // Show dropdown when there are filtered results
  useEffect(() => {
    setIsOpen(
      filteredAliments.length > 0 ||
        (debouncedSearchTerm.trim() !== "" && filteredAliments.length === 0),
    );
    setHighlightedIndex(-1);
  }, [filteredAliments.length, debouncedSearchTerm]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev < filteredAliments.length - 1) {
            return prev + 1;
          }
          return 0; // Wrap to first
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return filteredAliments.length - 1; // Wrap to last
        });
        break;

      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredAliments.length
        ) {
          handleSelect(filteredAliments[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setDebouncedSearchTerm("");
        break;
    }
  };

  const handleSelect = (aliment: UnifiedAliment) => {
    onSelectAliment(aliment);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search foods..."
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-activedescendant={
          highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
        }
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-slide-down"
        >
          {filteredAliments.length > 0 ? (
            filteredAliments.map((aliment, index) => (
              <AlimentSuggestionItem
                key={`${aliment.name}-${index}`}
                aliment={aliment}
                isHighlighted={index === highlightedIndex}
                onClick={() => handleSelect(aliment)}
                id={`suggestion-${index}`}
                style={{ animationDelay: `${index * 30}ms` }}
              />
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
              No foods found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
