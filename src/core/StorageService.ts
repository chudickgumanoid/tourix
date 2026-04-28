import { GuideProgress } from './types';

export class StorageService {
  private static readonly PROGRESS_KEY = 'tourix_progress';

  static async saveProgress(progress: GuideProgress): Promise<void> {
    await chrome.storage.local.set({ [this.PROGRESS_KEY]: progress });
  }

  static async getProgress(): Promise<GuideProgress | null> {
    const result = await chrome.storage.local.get(this.PROGRESS_KEY);
    return result[this.PROGRESS_KEY] || null;
  }

  static async clearProgress(): Promise<void> {
    await chrome.storage.local.remove(this.PROGRESS_KEY);
  }
}
