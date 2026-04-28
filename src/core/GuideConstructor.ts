import { Guide, GuideStep } from './types';
import { SelectorGenerator } from './SelectorGenerator';

export class GuideConstructor {
  private steps: GuideStep[] = [];
  private isRecording: boolean = false;
  private isPicking: boolean = false;
  private onStepAdded: (steps: GuideStep[]) => void = () => {};
  private highlightElement: HTMLElement | null = null;

  start(callback: (steps: GuideStep[]) => void) {
    this.steps = [];
    this.isRecording = true;
    this.isPicking = false;
    this.onStepAdded = callback;
    document.addEventListener('click', this.handleGlobalClick, true);
    document.addEventListener('mouseover', this.handleMouseOver, true);
    this.createHighlight();
    console.log('Tourix Constructor: Started');
  }

  setPicking(val: boolean) {
    this.isPicking = val;
    if (this.highlightElement) {
      this.highlightElement.style.display = 'none';
    }
    if (val) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = 'default';
    }
  }

  stop() {
    this.isRecording = false;
    this.isPicking = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('click', this.handleGlobalClick, true);
    document.removeEventListener('mouseover', this.handleMouseOver, true);
    this.removeHighlight();
  }

  private createHighlight() {
    this.highlightElement = document.createElement('div');
    this.highlightElement.id = 'tourix-constructor-highlight';
    Object.assign(this.highlightElement.style, {
      position: 'fixed',
      pointerEvents: 'none',
      border: '3px solid #42b883',
      boxShadow: '0 0 15px rgba(66, 184, 131, 0.5)',
      backgroundColor: 'rgba(66, 184, 131, 0.15)',
      zIndex: '2147483646',
      transition: 'none',
      display: 'none',
      borderRadius: '2px'
    });
    document.body.appendChild(this.highlightElement);
  }

  private removeHighlight() {
    this.highlightElement?.remove();
    this.highlightElement = null;
  }

  private handleMouseOver = (e: MouseEvent) => {
    if (!this.isRecording || !this.isPicking || !this.highlightElement) return;
    const target = e.target as HTMLElement;
    if (target.closest('#tourix-builder-container')) {
      this.highlightElement.style.display = 'none';
      return;
    }

    const rect = target.getBoundingClientRect();
    Object.assign(this.highlightElement.style, {
      display: 'block',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
  };

  private handleGlobalClick = (e: MouseEvent) => {
    if (!this.isRecording || !this.isPicking) return;

    const target = e.target as HTMLElement;
    if (target.closest('#tourix-builder-container')) return;

    // Только если мы в режиме "выбора" (Picking)
    e.preventDefault();
    e.stopPropagation();

    const selector = SelectorGenerator.generate(target);
    const newStep: GuideStep = {
      id: `step-${Date.now()}`,
      selector,
      title: 'Новый шаг',
      description: 'Введите описание...',
      placement: 'bottom'
    };

    this.steps.push(newStep);
    this.isPicking = false; // Выключаем режим выбора после одного клика
    document.body.style.cursor = 'default';
    this.onStepAdded([...this.steps]);
  };

  updateSteps(updatedSteps: GuideStep[]) {
    this.steps = updatedSteps;
  }

  export(guideName: string, guideDescription: string): Guide {
    return {
      id: `custom-guide-${Date.now()}`,
      name: guideName || 'Новый гайд',
      description: guideDescription,
      matches: [window.location.hostname],
      steps: this.steps
    };
  }
}
