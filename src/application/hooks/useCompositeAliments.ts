/**
 * useCompositeAliments Hook
 *
 * Provides unified access to both catalog and custom aliments.
 *
 * @see Constitution Principle I: Architectural Integrity
 */

"use client";

import { useMemo } from "react";
import { useAlimentInfoRepository } from "../contexts/AlimentInfoRepositoryContext";
import { useCustomAlimentRepository } from "../contexts/CustomAlimentRepositoryContext";
import { CompositeAlimentRepository } from "@/src/domain/repositories/CompositeAlimentRepository";

/**
 * useCompositeAliments
 *
 * Hook that creates a CompositeAlimentRepository combining catalog and custom aliments.
 *
 * @returns CompositeAlimentRepository instance
 */
export function useCompositeAliments(): CompositeAlimentRepository {
  const catalogRepository = useAlimentInfoRepository();
  const customRepository = useCustomAlimentRepository();

  const compositeRepository = useMemo(
    () => new CompositeAlimentRepository(catalogRepository, customRepository),
    [catalogRepository, customRepository],
  );

  return compositeRepository;
}
