import { Guide } from './types';
import { greenkassaGuide } from '../guides/greenkassa';
import { greenkassaCalcGuide } from '../guides/greenkassa-calc';

export class GuideRegistry {
  // В реальном приложении это может загружаться из API
  private static guides: Guide[] = [
    greenkassaGuide,
    greenkassaCalcGuide
  ];

  static findGuidesForUrl(url: string): Guide[] {
    return this.guides.filter(guide => 
      guide.matches.some(match => url.includes(match))
    );
  }

  static getGuideById(id: string): Guide | null {
    return this.guides.find(g => g.id === id) || null;
  }

  static getAllGuides(): Guide[] {
    return this.guides;
  }
}
