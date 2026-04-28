import { GuideRunner } from '../core/GuideRunner';
import { GuideRegistry } from '../core/GuideRegistry';
import { MessageBridge } from '../core/MessageBridge';
import { ExtensionMessage, GuideStep } from '../core/types';
import { BuilderOverlay } from './BuilderOverlay';
import { GuideConstructor } from '../core/GuideConstructor';
import { StorageService } from '../core/StorageService';

console.log('!!! TOURIX DEBUG: SCRIPT ATTEMPTING TO LOAD !!!');

const runner = new GuideRunner();
const guideConstructor = new GuideConstructor();
let builderOverlay: BuilderOverlay | null = null;

function detectVue(): boolean {
  const hasDevtoolsHook = !!(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__;
  const hasAppRoot = !!document.querySelector('[data-v-app]');
  const hasVueAttr = !!document.querySelector('*[class*="v-"], *[id*="v-"]'); // Simple heuristic
  
  // Checking for internal properties (experimental)
  const allElements = document.querySelectorAll('*');
  let hasVueInstance = false;
  for (let i = 0; i < Math.min(allElements.length, 100); i++) {
    if ((allElements[i] as any).__vue_app__ || (allElements[i] as any).__vueParentComponent) {
      hasVueInstance = true;
      break;
    }
  }

  return hasDevtoolsHook || hasAppRoot || hasVueInstance || hasVueAttr;
}

async function updateBadge() {
  console.log('Tourix: Checking for guides...', window.location.href);
  const isVue = detectVue();
  const guides = await GuideRegistry.findGuidesForUrl(window.location.href);
  const hasGuide = guides.length > 0;
  
  console.log('Tourix: Vue detected:', isVue, 'Guides found:', guides.length);

  if (hasGuide) {
    chrome.runtime.sendMessage({
      type: 'SET_BADGE',
      payload: { text: 'ON', color: '#42b883' }
    });
  } else if (isVue) {
    chrome.runtime.sendMessage({
      type: 'SET_BADGE',
      payload: { text: 'VUE', color: '#35495e' }
    });
  }
}

// Запускаем проверку при загрузке
setTimeout(updateBadge, 1500); 

MessageBridge.onMessage(async (message: ExtensionMessage, sender, sendResponse) => {
  console.log('Tourix: Received message:', message.type, message.payload);
  
  switch (message.type) {
    case 'START_GUIDE':
      const guide = await GuideRegistry.getGuideById(message.payload.guideId);
      if (guide) {
        runner.start(guide).then(() => {
          sendResponse({ success: true });
        });
        return true; // Keep channel open for async response
      }
      break;

    case 'CONTINUE_GUIDE':
      const contGuide = await GuideRegistry.getGuideById(message.payload.guideId);
      if (contGuide) {
        runner.start(contGuide, message.payload.stepIndex).then(() => {
          sendResponse({ success: true });
        });
        return true;
      }
      break;

    case 'STOP_GUIDE':
      runner.stop().then(() => {
        sendResponse({ success: true });
      });
      return true;

    case 'GET_STATUS':
      sendResponse({
        isActive: runner.isActive(),
        vueDetected: detectVue()
      });
      break;
    
    case 'CHECK_VUE':
      sendResponse({ vueDetected: detectVue() });
      break;

    case 'START_CONSTRUCTOR':
      builderOverlay = new BuilderOverlay(
        async (name: string, description: string, steps: GuideStep[]) => {
          guideConstructor.updateSteps(steps);
          const guide = guideConstructor.export(name, description);
          await StorageService.saveCustomGuide(guide);
          console.log('TOURIX SAVED:', guide);
          alert('Гайд сохранен локально и появится в списке расширения!');
        },
        () => {
          guideConstructor.stop();
          builderOverlay?.remove();
          builderOverlay = null;
        },
        () => {
          guideConstructor.setPicking(true);
        },
        (updatedSteps: GuideStep[]) => {
          // Важно! Синхронизируем состояние в ядре при любом изменении в UI
          guideConstructor.updateSteps(updatedSteps);
        }
      );
      guideConstructor.start((steps: GuideStep[]) => {
        builderOverlay?.updateSteps(steps);
      });
      sendResponse({ success: true });
      break;

    case 'STOP_CONSTRUCTOR':
      guideConstructor.stop();
      builderOverlay?.remove();
      builderOverlay = null;
      sendResponse({ success: true });
      break;
  }
});

console.log('Tourix Content Script Loaded');
