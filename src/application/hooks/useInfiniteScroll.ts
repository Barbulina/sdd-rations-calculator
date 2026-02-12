import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useInfiniteScroll Hook
 *
 * Custom hook for implementing infinite scroll with Intersection Observer.
 * Loads items in batches when user scrolls to the bottom of the list.
 *
 * @template T - Type of items in the array
 * @param items - Full array of items to display
 * @param batchSize - Number of items to load per batch (default: 10)
 * @returns Object containing displayedItems, hasMore flag, and loadMoreRef
 *
 * @see ../../../../specs/002-ration-menu-management/research.md for implementation details
 *
 * @example
 * ```tsx
 * const { displayedItems, hasMore, loadMoreRef } = useInfiniteScroll(allRations, 10);
 *
 * return (
 *   <div>
 *     {displayedItems.map(item => <ItemCard key={item.id} item={item} />)}
 *     {hasMore && <div ref={loadMoreRef}>Loading...</div>}
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll<T>(items: T[], batchSize: number = 10) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);

  /**
   * Load the next batch of items
   */
  const loadMore = useCallback(() => {
    const nextBatch = items.slice(
      currentIndexRef.current,
      currentIndexRef.current + batchSize,
    );

    if (nextBatch.length === 0) {
      setHasMore(false);
      return;
    }

    setDisplayedItems((prev) => [...prev, ...nextBatch]);
    currentIndexRef.current += nextBatch.length;

    // Check if there are more items to load
    if (currentIndexRef.current >= items.length) {
      setHasMore(false);
    }
  }, [items, batchSize]);

  /**
   * Reset when items array changes
   */
  useEffect(() => {
    setDisplayedItems([]);
    currentIndexRef.current = 0;
    setHasMore(true);

    // Load initial batch
    if (items.length > 0) {
      const initialBatch = items.slice(0, batchSize);
      setDisplayedItems(initialBatch);
      currentIndexRef.current = initialBatch.length;
      setHasMore(initialBatch.length < items.length);
    }
  }, [items, batchSize]);

  /**
   * Setup Intersection Observer
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
      },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadMore]);

  return {
    displayedItems,
    hasMore,
    loadMoreRef,
  };
}
