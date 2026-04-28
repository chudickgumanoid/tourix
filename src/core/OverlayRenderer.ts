import { GuideStep, Placement } from './types';

export class OverlayRenderer {
  private container: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private overlay: HTMLElement | null = null;
  private popup: HTMLElement | null = null;
  private svgMask: SVGElement | null = null;
  private maskPath: SVGPathElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (document.getElementById('tourix-overlay-container')) return;

    this.container = document.createElement('div');
    this.container.id = 'tourix-overlay-container';
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes popupEntrance {
        from { opacity: 0; transform: translate(-50%, -40%) scale(0.95); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes popupStepEntrance {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { filter: drop-shadow(0 0 0px rgba(66, 184, 131, 0)); }
        50% { filter: drop-shadow(0 0 15px rgba(66, 184, 131, 0.6)); }
        100% { filter: drop-shadow(0 0 0px rgba(66, 184, 131, 0)); }
      }
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2147483647;
        pointer-events: none;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        background: transparent;
        transition: all 0.5s ease;
      }
      .spotlight-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .spotlight-path {
        transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        fill: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(3px); /* Apply blur ONLY to the shaded area */
      }
      .spotlight-active {
        animation: pulse 2s infinite;
      }
      .popup {
        position: absolute;
        background: white;
        padding: 28px;
        border-radius: 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        min-width: 320px;
        max-width: 420px;
        pointer-events: auto;
        z-index: 10;
        display: none;
        color: #1e293b;
        border: 1px solid rgba(255,255,255,0.1);
        animation: popupStepEntrance 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .popup.intro-mode {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: popupEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-align: center;
        max-width: 500px;
        backdrop-filter: none; /* Intro popup shouldn't blur itself */
      }
      .popup.intro-mode .progress-container { display: none; }
      .popup.intro-mode h3 { font-size: 28px; margin-bottom: 16px; }
      .popup.intro-mode p { font-size: 16px; margin-bottom: 32px; }
      .popup.intro-mode .controls { justify-content: center; border: none; }
      
      .progress-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }
      .progress-bar {
        flex-grow: 1;
        height: 6px;
        background: #f1f5f9;
        border-radius: 3px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #42b883, #34d399);
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .step-count {
        font-size: 11px;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .popup h3 { 
        margin: 0 0 10px 0; 
        font-size: 20px; 
        font-weight: 800;
        color: #0f172a;
      }
      .popup p { 
        margin: 0 0 24px 0; 
        font-size: 15px; 
        line-height: 1.6;
        color: #475569; 
      }
      .controls { 
        display: flex; 
        gap: 12px; 
        align-items: center;
        border-top: 1px solid #f1f5f9;
        padding-top: 20px;
      }
      button {
        padding: 10px 20px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 700;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-next { 
        background: #42b883; 
        color: white;
        box-shadow: 0 10px 15px -3px rgba(66, 184, 131, 0.3);
        flex-grow: 1;
      }
      .btn-next:hover { 
        background: #33a06f;
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(66, 184, 131, 0.4);
      }
      .btn-back { 
        background: #f8fafc; 
        color: #64748b;
      }
      .btn-back:hover { 
        background: #f1f5f9;
        color: #1e293b;
      }
      .btn-close { 
        background: transparent; 
        color: #cbd5e1;
        padding: 10px;
      }
      .btn-close:hover { 
        color: #ef4444;
        background: #fef2f2;
      }
    `;

    this.shadowRoot!.appendChild(style);

    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay';
    
    this.svgMask = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgMask.setAttribute('class', 'spotlight-svg');
    this.maskPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.maskPath.setAttribute('class', 'spotlight-path');
    this.maskPath.setAttribute('fill-rule', 'evenodd');
    this.svgMask.appendChild(this.maskPath);
    
    this.popup = document.createElement('div');
    this.popup.className = 'popup';
    this.popup.innerHTML = `
      <div class="progress-container">
        <div class="step-count"></div>
        <div class="progress-bar"><div class="progress-fill"></div></div>
      </div>
      <div class="error-msg">Элемент не найден</div>
      <h3></h3>
      <p></p>
      <div class="controls">
        <button class="btn-close">✕</button>
        <button class="btn-back">Назад</button>
        <button class="btn-next">Далее</button>
      </div>
    `;

    this.shadowRoot!.appendChild(this.overlay);
    this.shadowRoot!.appendChild(this.svgMask);
    this.shadowRoot!.appendChild(this.popup);
    document.body.appendChild(this.container);
  }

  renderStep(
    step: GuideStep, 
    target: HTMLElement | null, 
    currentIndex: number, 
    totalSteps: number, 
    onNext: () => void, 
    onBack: () => void, 
    onClose: () => void
  ) {
    if (!this.popup || !this.maskPath) return;

    this.popup.style.display = 'block';
    
    if (step.isIntro) {
      this.popup.classList.add('intro-mode');
      this.overlay?.classList.add('blur-all');
      this.updateSpotlight(null);
    } else {
      this.popup.classList.remove('intro-mode');
      this.overlay?.classList.remove('blur-all');
    }

    this.popup.querySelector('h3')!.textContent = step.title;
    this.popup.querySelector('p')!.textContent = step.description;

    const progressPercent = ((currentIndex + 1) / totalSteps) * 100;
    this.popup.querySelector('.step-count')!.textContent = `Шаг ${currentIndex + 1} / ${totalSteps}`;
    (this.popup.querySelector('.progress-fill') as HTMLElement).style.width = `${progressPercent}%`;

    const btnBack = this.popup.querySelector('.btn-back') as HTMLButtonElement;
    const btnNext = this.popup.querySelector('.btn-next') as HTMLButtonElement;
    const btnClose = this.popup.querySelector('.btn-close') as HTMLButtonElement;
    const errorMsg = this.popup.querySelector('.error-msg') as HTMLElement;

    btnBack.style.display = (currentIndex === 0 || step.isIntro) ? 'none' : 'block';
    btnNext.textContent = step.isIntro ? 'Начать обучение' : (currentIndex === totalSteps - 1 ? 'Завершить' : 'Далее');
    errorMsg.style.display = (!target && !step.isIntro) ? 'block' : 'none';

    btnBack.onclick = (e: MouseEvent) => { e.stopPropagation(); onBack(); };
    btnNext.onclick = (e: MouseEvent) => { e.stopPropagation(); onNext(); };
    btnClose.onclick = (e: MouseEvent) => { e.stopPropagation(); onClose(); };

    if (step.isIntro) {
      // Handled by intro-mode CSS
    } else if (target) {
      const rect = target.getBoundingClientRect();
      this.updateSpotlight(rect);
      this.positionPopup(rect, step.placement || 'bottom');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      this.updateSpotlight(null);
      this.centerPopup();
    }
  }

  private updateSpotlight(rect: DOMRect | null) {
    if (!this.maskPath) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (!rect) {
      this.maskPath.setAttribute('d', `M0,0 H${w} V${h} H0 Z`);
      this.maskPath.classList.remove('spotlight-active');
      return;
    }

    this.maskPath.classList.add('spotlight-active');
    const padding = 8;
    const r = {
      t: rect.top - padding,
      l: rect.left - padding,
      w: rect.width + padding * 2,
      h: rect.height + padding * 2,
      rad: 12
    };

    const d = `
      M0,0 H${w} V${h} H0 Z
      M${r.l + r.rad},${r.t} 
      h${r.w - r.rad * 2} 
      a${r.rad},${r.rad} 0 0 1 ${r.rad},${r.rad} 
      v${r.h - r.rad * 2} 
      a${r.rad},${r.rad} 0 0 1 -${r.rad},${r.rad} 
      h-${r.w - r.rad * 2} 
      a${r.rad},${r.rad} 0 0 1 -${r.rad},-${r.rad} 
      v-${r.h - r.rad * 2} 
      a${r.rad},${r.rad} 0 0 1 ${r.rad},-${r.rad} 
      z
    `;
    this.maskPath.setAttribute('d', d);
  }

  private positionPopup(rect: DOMRect, requestedPlacement: Placement) {
    if (!this.popup) return;
    
    const gap = 20;
    const popupWidth = this.popup.offsetWidth;
    const popupHeight = this.popup.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let placement = requestedPlacement;

    if (placement === 'top' && rect.top < popupHeight + gap) {
      placement = 'bottom';
    } else if (placement === 'bottom' && rect.bottom + popupHeight + gap > viewportHeight) {
      placement = 'top';
    }

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - popupHeight - gap;
        left = rect.left + (rect.width / 2) - (popupWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + (rect.width / 2) - (popupWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (popupHeight / 2);
        left = rect.left - popupWidth - gap;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (popupHeight / 2);
        left = rect.right + gap;
        break;
    }

    left = Math.max(10, Math.min(left, viewportWidth - popupWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupHeight - 10));

    const isOverlapping = !(
      top + popupHeight < rect.top ||
      top > rect.bottom ||
      left + popupWidth < rect.left ||
      left > rect.right
    );

    if (isOverlapping && (placement === 'top' || placement === 'bottom')) {
      left = rect.right + gap;
      top = rect.top;
      left = Math.max(10, Math.min(left, viewportWidth - popupWidth - 10));
      top = Math.max(10, Math.min(top, viewportHeight - popupHeight - 10));
    }

    this.popup.style.top = `${top}px`;
    this.popup.style.left = `${left}px`;
    this.popup.style.transform = 'none';
  }

  private centerPopup() {
    if (!this.popup) return;
    this.popup.style.top = '50%';
    this.popup.style.left = '50%';
    this.popup.style.transform = 'translate(-50%, -50%)';
  }

  remove() {
    this.container?.remove();
  }
}
