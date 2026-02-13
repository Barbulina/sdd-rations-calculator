/**
 * MenuRepositoryContext
 * Provides MenuRepository instance via React Context for dependency injection
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { MenuRepository } from '@/src/domain/repositories/MenuRepository';

/**
 * Context for MenuRepository dependency injection
 */
const MenuRepositoryContext = createContext<MenuRepository | null>(null);

/**
 * Props for MenuRepositoryProvider
 */
interface MenuRepositoryProviderProps {
  repository: MenuRepository;
  children: ReactNode;
}

/**
 * Provider component for MenuRepository context
 * 
 * @param repository - MenuRepository implementation to provide
 * @param children - Child components
 * @returns Provider component
 * 
 * @example
 * ```tsx
 * const repository = new LocalStorageMenuRepository();
 * 
 * <MenuRepositoryProvider repository={repository}>
 *   <App />
 * </MenuRepositoryProvider>
 * ```
 */
export function MenuRepositoryProvider({ repository, children }: MenuRepositoryProviderProps) {
  return (
    <MenuRepositoryContext.Provider value={repository}>
      {children}
    </MenuRepositoryContext.Provider>
  );
}

/**
 * Hook to access MenuRepository from context
 * 
 * @returns MenuRepository instance
 * @throws Error if used outside MenuRepositoryProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const repository = useMenuRepository();
 *   // Use repository...
 * }
 * ```
 */
export function useMenuRepository(): MenuRepository {
  const repository = useContext(MenuRepositoryContext);
  
  if (!repository) {
    throw new Error('useMenuRepository must be used within MenuRepositoryProvider');
  }
  
  return repository;
}
