"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { AlimentInfoRepository } from "@/src/domain/repositories/AlimentInfoRepository";
import { InMemoryAlimentInfoRepository } from "@/src/infrastructure/repositories/InMemoryAlimentInfoRepository";

const AlimentInfoRepositoryContext = createContext<
  AlimentInfoRepository | undefined
>(undefined);

interface AlimentInfoRepositoryProviderProps {
  children: ReactNode;
}

/**
 * AlimentInfoRepositoryProvider
 *
 * Context provider for aliment catalog access.
 * Provides dependency injection for the AlimentInfoRepository.
 */
export function AlimentInfoRepositoryProvider({
  children,
}: AlimentInfoRepositoryProviderProps) {
  const repository = useMemo(() => new InMemoryAlimentInfoRepository(), []);

  return (
    <AlimentInfoRepositoryContext.Provider value={repository}>
      {children}
    </AlimentInfoRepositoryContext.Provider>
  );
}

/**
 * useAlimentInfoRepository
 *
 * Hook to access the AlimentInfoRepository from context.
 * Must be used within AlimentInfoRepositoryProvider.
 *
 * @throws Error if used outside of AlimentInfoRepositoryProvider
 */
export function useAlimentInfoRepository(): AlimentInfoRepository {
  const context = useContext(AlimentInfoRepositoryContext);

  if (!context) {
    throw new Error(
      "useAlimentInfoRepository must be used within AlimentInfoRepositoryProvider",
    );
  }

  return context;
}
