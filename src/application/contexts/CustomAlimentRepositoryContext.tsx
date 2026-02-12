/**
 * CustomAlimentRepositoryContext
 *
 * React context for dependency injection of CustomAlimentRepository.
 * Follows the Repository Pattern for hexagonal architecture.
 *
 * @see Constitution Principle I: Architectural Integrity
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CustomAlimentRepository } from "@/src/domain/repositories/CustomAlimentRepository";
import { LocalStorageCustomAlimentRepository } from "@/src/infrastructure/repositories/LocalStorageCustomAlimentRepository";
import { LocalStorageAdapter } from "@/src/infrastructure/storage/LocalStorageAdapter";

// Create context
const CustomAlimentRepositoryContext =
  createContext<CustomAlimentRepository | null>(null);

// Create default repository instance
const defaultRepository = new LocalStorageCustomAlimentRepository(
  new LocalStorageAdapter(),
);

/**
 * CustomAlimentRepositoryProvider
 *
 * Provides CustomAlimentRepository to child components via React context.
 */
export function CustomAlimentRepositoryProvider({
  children,
  repository = defaultRepository,
}: {
  children: ReactNode;
  repository?: CustomAlimentRepository;
}) {
  return (
    <CustomAlimentRepositoryContext.Provider value={repository}>
      {children}
    </CustomAlimentRepositoryContext.Provider>
  );
}

/**
 * useCustomAlimentRepository
 *
 * Hook to access CustomAlimentRepository from context.
 *
 * @throws Error if used outside CustomAlimentRepositoryProvider
 */
export function useCustomAlimentRepository(): CustomAlimentRepository {
  const repository = useContext(CustomAlimentRepositoryContext);

  if (!repository) {
    throw new Error(
      "useCustomAlimentRepository must be used within CustomAlimentRepositoryProvider",
    );
  }

  return repository;
}
