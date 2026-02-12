"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRationRepository } from "@/src/application/contexts/RationRepositoryContext";
import { useInfiniteScroll } from "@/src/application/hooks/useInfiniteScroll";
import { RationCard } from "./components/RationCard";
import { EmptyState } from "./components/EmptyState";
import type { Ration } from "@/src/domain/models/Ration";

/**
 * Home Page
 *
 * Displays list of all rations with infinite scroll.
 * Features:
 * - Load rations from repository on mount
 * - Infinite scroll with 10 items per batch
 * - Empty state when no rations exist
 * - Link to create new rations
 *
 * @see ../../specs/002-ration-menu-management/spec.md for user story
 */
export default function HomePage() {
  const repository = useRationRepository();
  const [rations, setRations] = useState<Ration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Infinite scroll with batch size of 10
  const { displayedItems, hasMore, loadMoreRef } = useInfiniteScroll(
    rations,
    10,
  );

  /**
   * Load rations from repository on mount
   */
  useEffect(() => {
    loadRations();
  }, []);

  /**
   * Load all rations from repository
   */
  const loadRations = async () => {
    setIsLoading(true);
    try {
      const allRations = await repository.findAll();
      setRations(allRations);
    } catch (error) {
      console.error("Failed to load rations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      {/* Header */}
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Rations</h1>
          <div className="flex gap-2">
            <Link
              href="/aliment-browser"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Browse Aliments
            </Link>
            <Link
              href="/create-ration"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition font-medium"
            >
              + Create
            </Link>
          </div>
          <Link
            href="/create-ration"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition font-medium"
          >
            + Create
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading rations...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && rations.length === 0 && <EmptyState />}

        {/* Rations List */}
        {!isLoading && rations.length > 0 && (
          <div>
            {displayedItems.map((ration) => (
              <RationCard key={ration.id} ration={ration} />
            ))}

            {/* Loading Indicator for Infinite Scroll */}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                Loading more...
              </div>
            )}

            {/* End of List Message */}
            {!hasMore && rations.length > 10 && (
              <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
                End of list - {rations.length} ration
                {rations.length !== 1 ? "s" : ""} total
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
