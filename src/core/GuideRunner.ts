import { Guide, GuideProgress } from './types';
import { OverlayRenderer } from './OverlayRenderer';
import { ElementResolver } from './ElementResolver';
import { StorageService } from './StorageService';

export class GuideRunner {
  private guide: Guide | null = null;
  private currentStepIndex: number = 0;
  private renderer: OverlayRenderer | null = null;

  constructor() {}

  async start(guide: Guide, startIndex: number = 0) {
    this.guide = guide;
    this.currentStepIndex = startIndex;
    this.renderer = new OverlayRenderer();
    this.render();
  }

  private async render() {
    if (!this.guide || !this.renderer) return;

    const step = this.guide.steps[this.currentStepIndex];
    const target = ElementResolver.resolve(step.selector);

    this.renderer.renderStep(
      step,
      target,
      this.currentStepIndex,
      this.guide.steps.length,
      () => this.next(),
      () => this.back(),
      () => this.stop()
    );

    await StorageService.saveProgress({
      guideId: this.guide.id,
      currentStepIndex: this.currentStepIndex,
      completed: false
    });
  }

  next() {
    if (!this.guide) return;
    if (this.currentStepIndex < this.guide.steps.length - 1) {
      this.currentStepIndex++;
      this.render();
    } else {
      this.complete();
    }
  }

  back() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.render();
    }
  }

  async stop() {
    this.renderer?.remove();
    this.renderer = null;
    this.guide = null;
    await StorageService.clearProgress();
  }

  async complete() {
    if (this.guide) {
      await StorageService.saveProgress({
        guideId: this.guide.id,
        currentStepIndex: this.currentStepIndex,
        completed: true
      });
    }
    this.stop();
  }

  isActive(): boolean {
    return this.guide !== null;
  }
}
