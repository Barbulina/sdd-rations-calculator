/**
 * LocalStorageMenuRepository
 * Implements MenuRepository interface using browser localStorage
 */

import type { MenuRepository } from '@/src/domain/repositories/MenuRepository';
import type { Menu } from '../../../specs/004-menu-builder/contracts/types';
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';

const STORAGE_KEY = 'menus';

export class LocalStorageMenuRepository implements MenuRepository {
  private adapter: LocalStorageAdapter;
  private operationQueue: Promise<any> = Promise.resolve();

  constructor() {
    this.adapter = new LocalStorageAdapter();
  }

  /**
   * Queue an operation to prevent race conditions
   */
  private queueOperation<T>(operation: () => Promise<T>): Promise<T> {
    this.operationQueue = this.operationQueue
      .then(() => operation())
      .catch(() => operation());
    return this.operationQueue as Promise<T>;
  }

  async getAll(): Promise<Menu[]> {
    try {
      const data = this.adapter.getItem<any[]>(STORAGE_KEY);
      
      if (!data || !Array.isArray(data)) {
        return [];
      }

      // Deserialize and validate menus
      return data
        .map(item => this.deserializeMenu(item))
        .filter((menu): menu is Menu => menu !== null);
    } catch (error) {
      console.error('Failed to retrieve menus:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Menu | null> {
    const menus = await this.getAll();
    return menus.find(menu => menu.id === id) || null;
  }

  async save(menu: Menu): Promise<Menu> {
    return this.queueOperation(async () => {
      try {
        const menus = await this.getAll();
        menus.push(menu);
        
        const success = this.adapter.setItem(STORAGE_KEY, menus.map(m => this.serializeMenu(m)));
        
        if (!success) {
          throw new Error('Storage quota exceeded. Please delete old menus.');
        }
        
        return menu;
      } catch (error: any) {
        if (error.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. Please delete old menus.');
        }
        throw error;
      }
    });
  }

  async update(menu: Menu): Promise<Menu> {
    return this.queueOperation(async () => {
      const menus = await this.getAll();
      const index = menus.findIndex(m => m.id === menu.id);

      if (index === -1) {
        throw new Error('Menu not found');
      }

      // Set updatedAt timestamp
      const updatedMenu = {
        ...menu,
        updatedAt: new Date(),
      };

      menus[index] = updatedMenu;
      
      const success = this.adapter.setItem(STORAGE_KEY, menus.map(m => this.serializeMenu(m)));
      
      if (!success) {
        throw new Error('Storage quota exceeded. Please delete old menus.');
      }

      return updatedMenu;
    });
  }

  async delete(id: string): Promise<void> {
    return this.queueOperation(async () => {
      const menus = await this.getAll();
      const filtered = menus.filter(menu => menu.id !== id);
      
      if (filtered.length === 0) {
        this.adapter.removeItem(STORAGE_KEY);
      } else {
        this.adapter.setItem(STORAGE_KEY, filtered.map(m => this.serializeMenu(m)));
      }
    });
  }

  async deleteAll(): Promise<void> {
    return this.queueOperation(async () => {
      this.adapter.removeItem(STORAGE_KEY);
    });
  }

  async isAvailable(): Promise<boolean> {
    return this.adapter.isAvailable();
  }

  /**
   * Serialize menu for storage (convert Dates to ISO strings)
   */
  private serializeMenu(menu: Menu): any {
    return {
      ...menu,
      createdAt: menu.createdAt.toISOString(),
      updatedAt: menu.updatedAt?.toISOString(),
    };
  }

  /**
   * Deserialize menu from storage (convert ISO strings to Dates)
   */
  private deserializeMenu(data: any): Menu | null {
    try {
      // Validate required fields
      if (!data || typeof data !== 'object') {
        return null;
      }

      if (!data.id || !data.name || !data.type || !Array.isArray(data.items)) {
        return null;
      }

      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      };
    } catch (error) {
      console.error('Failed to deserialize menu:', error);
      return null;
    }
  }
}
