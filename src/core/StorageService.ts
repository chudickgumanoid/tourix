import { Guide, GuideProgress } from './types';

export class StorageService {
  private static readonly PROGRESS_KEY = 'tourix_progress';
  private static readonly CUSTOM_GUIDES_KEY = 'tourix_custom_guides';

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

  static async saveCustomGuide(guide: Guide): Promise<void> {
    const result = await chrome.storage.local.get(this.CUSTOM_GUIDES_KEY);
    const guides = result[this.CUSTOM_GUIDES_KEY] || [];
    guides.push(guide);
    await chrome.storage.local.set({ [this.CUSTOM_GUIDES_KEY]: guides });
  }

  static async getCustomGuides(): Promise<Guide[]> {
    const result = await chrome.storage.local.get(this.CUSTOM_GUIDES_KEY);
    return result[this.CUSTOM_GUIDES_KEY] || [];
  }
}
