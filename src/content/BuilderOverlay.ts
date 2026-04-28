import { GuideStep } from '../core/types';

export class BuilderOverlay {
  private container: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private panel: HTMLElement | null = null;

  constructor(
    private onSave: (name: string, description: string, steps: GuideStep[]) => void,
    private onClose: () => void,
    private onPick: () => void,
    private onChange: (steps: GuideStep[]) => void
  ) {
    this.init();
  }

  private init() {
    this.container = document.createElement('div');
    this.container.id = 'tourix-builder-container';
    this.shadow = this.container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 380px;
        height: calc(100vh - 40px);
        z-index: 2147483647;
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
      }
      .panel {
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      }
      .header {
        padding: 16px;
        background: #1e293b;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #f8fafc;
      }
      .section-title {
        font-size: 12px;
        text-transform: uppercase;
        color: #64748b;
        font-weight: 700;
        margin-bottom: 8px;
        margin-top: 16px;
      }
      .step-item {
        background: white;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin-bottom: 16px;
        position: relative;
        transition: transform 0.2s;
      }
      .btn-delete-step {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #fee2e2;
        color: #ef4444;
        font-size: 10px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      }
      input, textarea, select {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 8px 12px;
        margin-top: 6px;
        font-size: 13px;
        box-sizing: border-box;
      }
      textarea { height: 60px; resize: vertical; }
      .footer {
        padding: 20px;
        border-top: 1px solid #e2e8f0;
        background: white;
      }
      button {
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        border: none;
      }
      .btn-save { background: #42b883; color: white; width: 100%; font-size: 15px; }
      .btn-add-step { 
        background: #1e293b; 
        color: white; 
        width: 100%; 
        font-size: 14px; 
        margin-top: 10px;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .picking-active .btn-add-step {
        background: #42b883;
      }
      .btn-close { background: transparent; color: white; font-size: 20px; padding: 0; width: auto; }
      .selector-badge {
        font-family: monospace;
        font-size: 11px;
        background: #f1f5f9;
        padding: 4px 8px;
        color: #475569;
        word-break: break-all;
        border-radius: 4px;
        margin-bottom: 8px;
      }
    `;

    this.shadow.appendChild(style);
    this.panel = document.createElement('div');
    this.panel.className = 'panel';
    this.panel.innerHTML = `
      <div class="header">
        <span style="font-weight: 700;">Tourix Builder</span>
        <button class="btn-close">✕</button>
      </div>
      <div class="content">
        <div class="section-title">Основная информация</div>
        <input type="text" id="guide-name" placeholder="Название гайда">
        <textarea id="guide-desc" placeholder="Описание гайда..."></textarea>
        
        <div class="section-title">Шаги гайда (<span id="steps-count">0</span>)</div>
        <div id="steps-list"></div>
        <button class="btn-add-step">+ Добавить новый шаг</button>
      </div>
      <div class="footer">
        <button class="btn-save">Завершить и сохранить</button>
      </div>
    `;

    this.shadow.appendChild(this.panel);
    document.body.appendChild(this.container);

    (this.panel.querySelector('.btn-close') as HTMLElement).onclick = this.onClose;
    (this.panel.querySelector('.btn-add-step') as HTMLElement).onclick = () => {
      this.onPick();
      this.panel!.classList.add('picking-active');
      const btn = this.shadow!.querySelector('.btn-add-step') as HTMLElement;
      btn.textContent = 'Кликните по элементу...';
    };
    (this.panel.querySelector('.btn-save') as HTMLElement).onclick = () => {
      const name = (this.shadow!.querySelector('#guide-name') as HTMLInputElement).value;
      const description = (this.shadow!.querySelector('#guide-desc') as HTMLTextAreaElement).value;
      const steps = this.getCurrentSteps();
      this.onSave(name, description, steps);
    };
  }

  updateSteps(steps: GuideStep[]) {
    const list = this.shadow!.querySelector('#steps-list')!;
    const count = this.shadow!.querySelector('#steps-count')!;
    const addBtn = this.shadow!.querySelector('.btn-add-step') as HTMLElement;
    
    this.panel!.classList.remove('picking-active');
    addBtn.textContent = '+ Добавить новый шаг';

    count.textContent = steps.length.toString();
    list.innerHTML = '';
    
    steps.forEach((step, index) => {
      const item = document.createElement('div');
      item.className = 'step-item';
      item.innerHTML = `
        <div class="btn-delete-step" data-index="${index}">Удалить</div>
        <div style="font-size: 11px; font-weight: bold; color: #42b883; margin-bottom: 8px;">ШАГ ${index + 1}</div>
        <div class="selector-badge">${step.selector}</div>
        <input type="text" class="step-title" value="${step.title}" placeholder="Заголовок шага">
        <textarea class="step-desc" placeholder="Описание...">${step.description}</textarea>
        <select class="step-placement">
          <option value="bottom" ${step.placement === 'bottom' ? 'selected' : ''}>Снизу</option>
          <option value="top" ${step.placement === 'top' ? 'selected' : ''}>Сверху</option>
          <option value="left" ${step.placement === 'left' ? 'selected' : ''}>Слева</option>
          <option value="right" ${step.placement === 'right' ? 'selected' : ''}>Справа</option>
        </select>
      `;
      list.appendChild(item);
    });

    list.querySelectorAll('.btn-delete-step').forEach(btn => {
      (btn as HTMLElement).onclick = (e) => {
        const idx = parseInt((e.target as HTMLElement).dataset.index!);
        const currentSteps = this.getCurrentSteps();
        currentSteps.splice(idx, 1);
        this.onChange(currentSteps);
        this.updateSteps(currentSteps);
      };
    });

    list.querySelectorAll('input, textarea, select').forEach(el => {
      (el as HTMLElement).oninput = () => {
        this.onChange(this.getCurrentSteps());
      };
    });
  }

  private getCurrentSteps(): GuideStep[] {
    const items = this.shadow!.querySelectorAll('.step-item');
    const steps: GuideStep[] = [];
    items.forEach((item, index) => {
      steps.push({
        id: `step-${index}-${Date.now()}`,
        selector: item.querySelector('.selector-badge')!.textContent || '',
        title: (item.querySelector('.step-title') as HTMLInputElement).value,
        description: (item.querySelector('.step-desc') as HTMLTextAreaElement).value,
        placement: (item.querySelector('.step-placement') as HTMLSelectElement).value as any
      });
    });
    return steps;
  }

  remove() {
    this.container?.remove();
  }
}
