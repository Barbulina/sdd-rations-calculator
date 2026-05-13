import { LocalStorageAdapter } from "../../src/infrastructure/storage/LocalStorageAdapter";

export function createQuotaExceededMock(): { restore: () => void } {
  const originalSetItem = LocalStorageAdapter.prototype.setItem;
  LocalStorageAdapter.prototype.setItem = () => false;
  return {
    restore: () => {
      LocalStorageAdapter.prototype.setItem = originalSetItem;
    },
  };
}
