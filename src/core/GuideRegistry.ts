import { Guide } from './types';
import { greenkassaGuide } from '../guides/greenkassa';
import { greenkassaCalcGuide } from '../guides/greenkassa-calc';
import { StorageService } from './StorageService';

export class GuideRegistry {
  private static staticGuides: Guide[] = [
    greenkassaGuide,
    greenkassaCalcGuide
  ];

  static async findGuidesForUrl(url: string): Promise<Guide[]> {
    const customGuides = await StorageService.getCustomGuides();
    const allGuides = [...this.staticGuides, ...customGuides];
    
    return allGuides.filter(guide => 
      guide.matches.some(match => url.includes(match))
    );
  }

  static async getGuideById(id: string): Promise<Guide | null> {
    const customGuides = await StorageService.getCustomGuides();
    const allGuides = [...this.staticGuides, ...customGuides];
    return allGuides.find(g => g.id === id) || null;
  }

  static async getAllGuides(): Promise<Guide[]> {
    const customGuides = await StorageService.getCustomGuides();
    return [...this.staticGuides, ...customGuides];
  }
}
