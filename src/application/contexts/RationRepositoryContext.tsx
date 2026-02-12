"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { RationRepository } from "../../domain/repositories/RationRepository";
import { LocalStorageRationRepository } from "../../infrastructure/repositories/LocalStorageRationRepository";

/**
 * RationRepositoryContext
 *
 * React Context to provide RationRepository instance throughout the app.
 * Enables dependency injection and easy testing with mock repositories.
 *
 * @see ../../../specs/002-ration-menu-management/research.md for context pattern
 */
const RationRepositoryContext = createContext<RationRepository | null>(null);

/**
 * RationRepositoryProvider Props
 */
interface RationRepositoryProviderProps {
  children: React.ReactNode;
  repository?: RationRepository; // Optional for testing with mock repositories
}

/**
 * RationRepositoryProvider
 *
 * Provides RationRepository instance to the entire app via React Context.
 * Uses LocalStorageRationRepository by default, but allows injection for testing.
 *
 * @example
 * ```tsx
 * <RationRepositoryProvider>
 *   <App />
 * </RationRepositoryProvider>
 * ```
 *
 * @example Testing with mock repository
 * ```tsx
 * const mockRepo = new MockRationRepository();
 * <RationRepositoryProvider repository={mockRepo}>
 *   <ComponentUnderTest />
 * </RationRepositoryProvider>
 * ```
 */
export function RationRepositoryProvider({
  children,
  repository,
}: RationRepositoryProviderProps) {
  // Create repository instance only once
  const repositoryInstance = useMemo(
    () => repository || new LocalStorageRationRepository(),
    [repository],
  );

  return (
    <RationRepositoryContext.Provider value={repositoryInstance}>
      {children}
    </RationRepositoryContext.Provider>
  );
}

/**
 * useRationRepository Hook
 *
 * Access the RationRepository instance from React Context.
 * Must be used within a RationRepositoryProvider.
 *
 * @returns RationRepository instance
 * @throws {Error} If used outside of RationRepositoryProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const repository = useRationRepository();
 *
 *   const handleSave = async (data: CreateRationDTO) => {
 *     await repository.save(data);
 *   };
 *
 *   return <button onClick={() => handleSave(data)}>Save</button>;
 * }
 * ```
 */
export function useRationRepository(): RationRepository {
  const context = useContext(RationRepositoryContext);

  if (!context) {
    throw new Error(
      "useRationRepository must be used within a RationRepositoryProvider",
    );
  }

  return context;
}
